// supabase/functions/upload-dataset/index.ts

import { serve, supabase, corsHeaders, getAuthenticatedUser } from '../utils/supabase.ts';
import { nanoid } from 'https://esm.sh/nanoid@4.0.2';

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    const user = await getAuthenticatedUser(req);
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return new Response(JSON.stringify({ error: 'No file uploaded or file is invalid.' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
        
        const fileContent = await file.arrayBuffer();
        const fileName = `${nanoid()}-${file.name}`;
        const filePathInStorage = `${user.id}/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('datasets')
            .upload(filePathInStorage, fileContent, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) throw uploadError;

        const fileUrl = `${Deno.env.get('SUPABASE_URL')!}/storage/v1/object/public/datasets/${filePathInStorage}`;

        const name = formData.get('name') as string || file.name;
        const description = formData.get('description') as string || '';

        const { data: datasetRecord, error: dbError } = await supabase
            .from('datasets')
            .insert({
                user_id: user.id,
                name: name,
                description: description,
                file_url: fileUrl,
                file_size: file.size,
            })
            .select()
            .single();
        
        if (dbError) throw dbError;

        return new Response(JSON.stringify(datasetRecord), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});