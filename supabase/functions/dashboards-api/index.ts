// supabase/functions/dashboards-api/index.ts

import { serve, supabase, corsHeaders, getAuthenticatedUser } from '../utils/supabase.ts';
import { z } from 'https://deno.land/x/zod@v3.23.4/mod.ts';

const dashboardSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  description: z.string().optional(),
  config: z.record(z.any()).default({}),
  is_public: z.boolean().default(false),
});

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
    const dashboardId = url.pathname.split('/').pop();

    try {
        if (req.method === 'GET' && dashboardId === 'dashboards-api') { // GET all dashboards
            const { data, error } = await supabase
                .from('dashboards')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
        
        if (req.method === 'GET' && dashboardId) { // GET a single dashboard
            const { data, error } = await supabase
                .from('dashboards')
                .select('*')
                .eq('id', dashboardId)
                .single();

            if (error) throw error;
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const body = await req.json();

        if (req.method === 'POST') { // Create a new dashboard
            const parsedBody = dashboardSchema.safeParse(body);
            if (!parsedBody.success) {
                return new Response(JSON.stringify({ error: parsedBody.error }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
            const { data, error } = await supabase
                .from('dashboards')
                .insert({ ...parsedBody.data, user_id: user.id });

            if (error) throw error;
            return new Response(JSON.stringify(data), {
                status: 201,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        if (req.method === 'PUT' && dashboardId) { // Update a dashboard
            const parsedBody = dashboardSchema.safeParse(body);
            if (!parsedBody.success) {
                return new Response(JSON.stringify({ error: parsedBody.error }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
            const { data, error } = await supabase
                .from('dashboards')
                .update(parsedBody.data)
                .eq('id', dashboardId)
                .eq('user_id', user.id);
            
            if (error) throw error;
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        if (req.method === 'DELETE' && dashboardId) { // Delete a dashboard
            const { error } = await supabase
                .from('dashboards')
                .delete()
                .eq('id', dashboardId)
                .eq('user_id', user.id);

            if (error) throw error;
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