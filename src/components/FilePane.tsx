import { useState } from "react";
import { File, Folder, ChevronRight, MoreVertical, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileItem {
  name: string;
  type: "file" | "directory";
  size?: string;
  modified: string;
  permissions?: string;
}

interface FilePaneProps {
  type: "local" | "remote";
  path: string;
  onPathChange: (path: string) => void;
}

export function FilePane({ type, path, onPathChange }: FilePaneProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  // Demo files
  const files: FileItem[] = [
    { name: "..", type: "directory", modified: "", permissions: "drwxr-xr-x" },
    { name: "documents", type: "directory", modified: "2025-01-15 10:30", permissions: "drwxr-xr-x" },
    { name: "projects", type: "directory", modified: "2025-01-14 15:45", permissions: "drwxr-xr-x" },
    { name: "downloads", type: "directory", modified: "2025-01-13 09:20", permissions: "drwxr-xr-x" },
    { name: "config.yaml", type: "file", size: "2.4 KB", modified: "2025-01-15 14:22", permissions: "-rw-r--r--" },
    { name: "README.md", type: "file", size: "5.1 KB", modified: "2025-01-14 11:10", permissions: "-rw-r--r--" },
    { name: "package.json", type: "file", size: "1.2 KB", modified: "2025-01-13 16:30", permissions: "-rw-r--r--" },
    { name: "app.log", type: "file", size: "45.8 KB", modified: "2025-01-15 18:05", permissions: "-rw-r--r--" },
    { name: ".env", type: "file", size: "0.5 KB", modified: "2025-01-10 08:15", permissions: "-rw-------" },
  ];

  const toggleSelect = (filename: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(filename)) {
      newSelected.delete(filename);
    } else {
      newSelected.add(filename);
    }
    setSelectedFiles(newSelected);
  };

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === "directory") {
      const newPath = file.name === ".." 
        ? path.split("/").slice(0, -1).join("/") || "/"
        : `${path}/${file.name}`;
      onPathChange(newPath);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Column Headers */}
      <div className="border-b border-border bg-muted/30 px-4 py-2 grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground">
        <div className="col-span-5">Name</div>
        <div className="col-span-2">Size</div>
        <div className="col-span-3">Modified</div>
        {type === "remote" && <div className="col-span-2">Permissions</div>}
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.name}
            className={cn(
              "px-4 py-2 grid grid-cols-12 gap-4 items-center cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/30",
              selectedFiles.has(file.name) && "bg-primary/10 hover:bg-primary/15"
            )}
            onClick={() => toggleSelect(file.name)}
            onDoubleClick={() => handleDoubleClick(file)}
          >
            <div className="col-span-5 flex items-center gap-2 min-w-0">
              {file.type === "directory" ? (
                <Folder className="w-4 h-4 text-primary flex-shrink-0" />
              ) : (
                <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className="text-sm truncate path-font">{file.name}</span>
              {file.name.startsWith(".") && file.name !== ".." && (
                <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              )}
            </div>
            <div className="col-span-2 text-sm text-muted-foreground">
              {file.size || "-"}
            </div>
            <div className="col-span-3 text-sm text-muted-foreground">
              {file.modified}
            </div>
            {type === "remote" && (
              <div className="col-span-2 flex items-center justify-between">
                <span className="text-xs path-font text-muted-foreground">
                  {file.permissions}
                </span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="border-t border-border bg-card/30 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{files.length - 1} items</span>
        <span>{selectedFiles.size} selected</span>
      </div>
    </div>
  );
}
