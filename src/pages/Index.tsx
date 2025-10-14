import { useState } from "react";
import { ConnectionManager } from "@/components/ConnectionManager";
import { FileManager } from "@/components/FileManager";

interface Connection {
  id: string;
  name: string;
  host: string;
  username: string;
  port: number;
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
