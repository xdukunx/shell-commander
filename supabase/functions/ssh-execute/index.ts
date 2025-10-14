import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { command } = await req.json();

    // Mock command execution
    // Real SSH exec will be added when proper library is available
    let stdout = '';
    
    if (command.includes('ls')) {
      stdout = 'documents/  projects/  config.yaml  README.md';
    } else if (command.includes('pwd')) {
      stdout = '/home/user';
    } else {
      stdout = `Command executed: ${command}`;
    }

    return new Response(
      JSON.stringify({ 
        stdout, 
        stderr: '', 
        exitCode: 0 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});