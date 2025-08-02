// supabase/functions/datasets-api/index.ts

import { serve, supabase, corsHeaders, getAuthenticatedUser } from '../utils/supabase.ts';

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

    const url = new URL(req.url);
    const datasetId = url.pathname.split('/').pop();

    try {
        if (req.method === 'GET' && datasetId === 'datasets-api') { // GET all datasets
            const { data, error } = await supabase
                .from('datasets')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
        
        if (req.method === 'GET' && datasetId) { // GET a single dataset
            const { data, error } = await supabase
                .from('datasets')
                .select('*')
                .eq('id', datasetId)
                .eq('user_id', user.id)
                .single();

            if (error) throw error;
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        if (req.method === 'DELETE' && datasetId) { // Delete a dataset
            const { data: dataset, error: fetchError } = await supabase
                .from('datasets')
                .select('file_url')
                .eq('id', datasetId)
                .eq('user_id', user.id)
                .single();
            if (fetchError || !dataset) throw new Error('Dataset not found.');

            const filePath = dataset.file_url.split('/datasets/')[1];
            if (filePath) {
                const { error: storageError } = await supabase.storage.from('datasets').remove([filePath]);
                if (storageError) console.error('Failed to delete file from storage:', storageError);
            }

            const { error: dbError } = await supabase.from('datasets').delete().eq('id', datasetId);
            if (dbError) throw dbError;
            
            return new Response(null, {
                status: 204,
                headers: { ...corsHeaders },
            });
        }

        return new Response('Method Not Allowed', {
            status: 405,
            headers: { ...corsHeaders },
        });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});