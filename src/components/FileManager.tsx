import { useState } from "react";
import { ChevronRight, Home, HardDrive, Server, RefreshCw, Upload, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilePane } from "./FilePane";
import { Terminal } from "./Terminal";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface FileManagerProps {
  connection: {
    name: string;
    host: string;
    username: string;
  };
  onDisconnect: () => void;
}

export function FileManager({ connection, onDisconnect }: FileManagerProps) {
  const [localPath, setLocalPath] = useState("/home/user");
  const [remotePath, setRemotePath] = useState("/home/user");
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                <Server className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{connection.name}</p>
                <p className="text-xs text-muted-foreground path-font">
                  {connection.username}@{connection.host}
                </p>
              </div>
            </div>

            <div className="h-6 w-px bg-border" />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSync}
              disabled={syncing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              Sync
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDisconnect}>
              Disconnect
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ResizablePanelGroup direction="vertical">
          {/* File Panes */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="h-full grid grid-cols-2 gap-px bg-border">
              {/* Local Pane */}
              <div className="bg-background flex flex-col">
                <div className="border-b border-border bg-card/30 px-4 py-2 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-primary" />
                  <Home className="w-3 h-3 text-muted-foreground" />
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm path-font flex-1">{localPath}</span>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
                <FilePane type="local" path={localPath} onPathChange={setLocalPath} />
              </div>

              {/* Remote Pane */}
              <div className="bg-background flex flex-col">
                <div className="border-b border-border bg-card/30 px-4 py-2 flex items-center gap-2">
                  <Server className="w-4 h-4 text-primary" />
                  <Home className="w-3 h-3 text-muted-foreground" />
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm path-font flex-1">{remotePath}</span>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
                <FilePane type="remote" path={remotePath} onPathChange={setRemotePath} />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Terminal */}
          <ResizablePanel defaultSize={40} minSize={20}>
            <Terminal currentPath={remotePath} onPathChange={setRemotePath} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
