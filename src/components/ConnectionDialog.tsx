import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, Key, Shield } from "lucide-react";

interface ConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (connection: any) => void;
}

export function ConnectionDialog({ open, onOpenChange, onConnect }: ConnectionDialogProps) {
  const [authType, setAuthType] = useState<"password" | "key">("password");
  const [formData, setFormData] = useState({
    name: "",
    host: "",
    port: "22",
    username: "",
    password: "",
    privateKey: "",
    passphrase: "",
  });

  const handleSave = () => {
    if (!formData.name || !formData.host || !formData.username) {
      return;
    }

    onConnect({
      name: formData.name,
      host: formData.host,
      port: parseInt(formData.port) || 22,
      username: formData.username,
      password: authType === "password" ? formData.password : undefined,
      privateKey: authType === "key" ? formData.privateKey : undefined,
      passphrase: authType === "key" ? formData.passphrase : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            New SSH Connection
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Connection Name</Label>
                <Input 
                  id="name" 
                  placeholder="Production Server" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group">Group</Label>
                <Input id="group" placeholder="Production" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input 
                  id="host" 
                  placeholder="example.com" 
                  className="path-font"
                  value={formData.host}
                  onChange={(e) => setFormData({...formData, host: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input 
                  id="port" 
                  type="number" 
                  value={formData.port}
                  onChange={(e) => setFormData({...formData, port: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="root" 
                className="path-font"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" placeholder="web, production, primary" />
            </div>
          </TabsContent>

          <TabsContent value="authentication" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Authentication Method</Label>
              <Select value={authType} onValueChange={(v) => setAuthType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="key">SSH Key</SelectItem>
                  <SelectItem value="password">Password</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {authType === "key" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="keyfile">Private Key Content</Label>
                  <Input 
                    id="keyfile" 
                    placeholder="Paste your private key here" 
                    className="path-font"
                    value={formData.privateKey}
                    onChange={(e) => setFormData({...formData, privateKey: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passphrase">Passphrase (if required)</Label>
                  <Input 
                    id="passphrase" 
                    type="password"
                    value={formData.passphrase}
                    onChange={(e) => setFormData({...formData, passphrase: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                  <Key className="w-4 h-4 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Your private key will be stored securely
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cipher">Preferred Cipher</Label>
                <Select defaultValue="auto">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (Recommended)</SelectItem>
                    <SelectItem value="aes256-ctr">AES256-CTR</SelectItem>
                    <SelectItem value="aes128-ctr">AES128-CTR</SelectItem>
                    <SelectItem value="chacha20">ChaCha20-Poly1305</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mac">MAC Algorithm</Label>
                <Select defaultValue="auto">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (Recommended)</SelectItem>
                    <SelectItem value="hmac-sha2-256">HMAC-SHA2-256</SelectItem>
                    <SelectItem value="hmac-sha2-512">HMAC-SHA2-512</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jumphost">Jump Host (Optional)</Label>
              <Input id="jumphost" placeholder="bastion.example.com" className="path-font" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialdir">Initial Remote Directory</Label>
              <Input id="initialdir" placeholder="/home/user" className="path-font" />
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Shield className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                Strict host key checking enabled. You'll be prompted to verify new hosts.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Connect</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
