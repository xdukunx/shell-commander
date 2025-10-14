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
    const { path } = await req.json();

    // Return mock data for now
    // Real SFTP implementation will be added when proper SSH library is available
    const mockFiles = [
      {
        name: "documents",
        size: 0,
        isDirectory: true,
        permissions: "0755",
        modified: new Date().toISOString(),
      },
      {
        name: "config.yaml",
        size: 2400,
        isDirectory: false,
        permissions: "0644",
        modified: new Date().toISOString(),
      },
    ];

    return new Response(
      JSON.stringify({ files: mockFiles }),
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