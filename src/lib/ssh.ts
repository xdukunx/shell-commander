import { supabase } from "@/integrations/supabase/client";

export interface SSHConnection {
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
}

export interface SSHFile {
  name: string;
  size: number;
  isDirectory: boolean;
  permissions: string;
  modified: string;
}

export async function testSSHConnection(connection: SSHConnection): Promise<{ success: boolean; error?: string; sessionId?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('ssh-connect', {
      body: connection,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function listSSHFiles(connection: SSHConnection, path: string): Promise<SSHFile[]> {
  try {
    const { data, error } = await supabase.functions.invoke('ssh-list-files', {
      body: { ...connection, path },
    });

    if (error) throw error;
    return data.files || [];
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
}

export async function executeSSHCommand(
  connection: SSHConnection, 
  command: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  try {
    const { data, error } = await supabase.functions.invoke('ssh-execute', {
      body: { ...connection, command },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error executing command:', error);
    return { stdout: '', stderr: error.message, exitCode: 1 };
  }
}