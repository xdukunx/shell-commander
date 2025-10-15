import { useState, useEffect } from "react";
import { Server, Plus, Folder, Tag, Key, Search, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConnectionDialog } from "./ConnectionDialog";

interface Connection {
  id: string;
  name: string;
  host: string;
  username: string;
  port: number;
  group?: string;
  tags?: string[];
  color?: string;
}

interface ConnectionManagerProps {
  onConnect: (connection: Connection) => void;
}

export function ConnectionManager({ onConnect }: ConnectionManagerProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [connections, setConnections] = useState<Connection[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    const { data, error } = await supabase
      .from("ssh_connections")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load connections",
        variant: "destructive",
      });
      return;
    }

    setConnections(
      data.map((conn) => ({
        id: conn.id,
        name: conn.name,
        host: conn.host,
        username: conn.username,
        port: conn.port,
        group: conn.group_name,
        tags: conn.tags || [],
        color: conn.color || "hsl(217 91% 60%)",
      }))
    );
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleConnectionSaved = () => {
    loadConnections();
  };

  const filteredConnections = connections.filter((conn) =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Server className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SSH Manager</h1>
                <p className="text-sm text-muted-foreground">Connect to your servers</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                New Connection
              </Button>
              <Button onClick={handleSignOut} variant="outline" className="gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search connections, hosts, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Connections Grid */}
      <div className="flex-1 container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConnections.map((connection) => (
            <Card
              key={connection.id}
              className="p-4 hover:shadow-glow transition-all cursor-pointer group border-border/50 hover:border-primary/50"
              onClick={() => onConnect(connection)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: connection.color + "20" }}
                  >
                    <Server className="w-5 h-5" style={{ color: connection.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {connection.name}
                    </h3>
                    <p className="text-xs text-muted-foreground path-font">
                      {connection.username}@{connection.host}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {connection.group && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Folder className="w-3 h-3" />
                    {connection.group}
                  </Badge>
                )}
                {connection.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="gap-1 text-xs">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Key className="w-3 h-3" />
                  SSH Key
                </span>
                <span>Port {connection.port}</span>
              </div>
            </Card>
          ))}
        </div>

        {filteredConnections.length === 0 && (
          <div className="text-center py-12">
            <Server className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No connections found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or add a new connection
            </p>
            <Button onClick={() => setShowDialog(true)} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Connection
            </Button>
          </div>
        )}
      </div>

      <ConnectionDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onConnect={onConnect}
        onSaved={handleConnectionSaved}
      />
    </div>
  );
}
