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
}

export function ConnectionDialog({ open, onOpenChange }: ConnectionDialogProps) {
  const [authType, setAuthType] = useState<"password" | "key">("key");

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
                <Input id="name" placeholder="Production Server" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group">Group</Label>
                <Input id="group" placeholder="Production" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input id="host" placeholder="example.com" className="path-font" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" type="number" defaultValue="22" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="root" className="path-font" />
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
                  <Label htmlFor="keyfile">Private Key File</Label>
                  <div className="flex gap-2">
                    <Input id="keyfile" placeholder="~/.ssh/id_rsa" className="path-font flex-1" />
                    <Button variant="outline">Browse</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passphrase">Passphrase (if required)</Label>
                  <Input id="passphrase" type="password" />
                </div>
                <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                  <Key className="w-4 h-4 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Your private key will be stored securely in the system keychain
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
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
          <Button onClick={() => onOpenChange(false)}>Save Connection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
