// supabase/functions/utils/supabase.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.7/dist/module/index.js';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from './cors.ts';

// Get your Supabase project URL and service role key from the environment
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// A helper function to validate a user's JWT from the request header
export const getAuthenticatedUser = async (req: Request) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return null;
    }

    return user;
};

// CORS helper
export { serve, corsHeaders };