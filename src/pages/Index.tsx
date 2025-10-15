import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { ConnectionManager } from "@/components/ConnectionManager";
import { FileManager } from "@/components/FileManager";

interface Connection {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [currentConnection, setCurrentConnection] = useState<Connection | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleConnect = (connection: Connection) => {
    setCurrentConnection(connection);
  };

  const handleDisconnect = () => {
    setCurrentConnection(null);
  };

  if (!session) {
    return null;
  }

  return (
    <>
      {currentConnection ? (
        <FileManager connection={currentConnection} onDisconnect={handleDisconnect} />
      ) : (
        <ConnectionManager onConnect={handleConnect} />
      )}
    </>
  );
};

export default Index;
