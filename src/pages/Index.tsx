import { useState } from "react";
import { ConnectionManager } from "@/components/ConnectionManager";
import { FileManager } from "@/components/FileManager";

interface Connection {
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
}

const Index = () => {
  const [currentConnection, setCurrentConnection] = useState<Connection | null>(null);

  const handleConnect = (connection: Connection) => {
    setCurrentConnection(connection);
  };

  const handleDisconnect = () => {
    setCurrentConnection(null);
  };

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
