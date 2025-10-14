import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Send, X, Plus, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TerminalProps {
  currentPath: string;
  onPathChange: (path: string) => void;
}

interface TerminalLine {
  type: "command" | "output" | "error";
  content: string;
}

export function Terminal({ currentPath, onPathChange }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "SSH Terminal - Connected to server" },
    { type: "output", content: "Type 'help' for available commands" },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Available commands for autocomplete
  const commands = ["ls", "cd", "pwd", "mkdir", "rm", "cp", "mv", "cat", "nano", "vim", "grep", "find", "chmod", "chown", "help"];
  
  // Directory suggestions (simulated)
  const directories = ["documents", "projects", "downloads", "config", "logs"];

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    // Update suggestions based on input
    if (input.trim()) {
      const parts = input.split(" ");
      const lastPart = parts[parts.length - 1];
      
      if (parts.length === 1) {
        // Suggest commands
        const matches = commands.filter(cmd => cmd.startsWith(lastPart));
        setSuggestions(matches);
      } else if (parts[0] === "cd" && parts.length === 2) {
        // Suggest directories for cd command
        const matches = directories.filter(dir => dir.startsWith(lastPart));
        setSuggestions(matches);
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  }, [input]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Add to history
    setHistory([...history, trimmedCmd]);
    setHistoryIndex(-1);

    // Add command to output
    setLines(prev => [...prev, { type: "command", content: `$ ${trimmedCmd}` }]);

    // Process command
    const parts = trimmedCmd.split(" ");
    const command = parts[0];

    switch (command) {
      case "ls":
        setLines(prev => [...prev, 
          { type: "output", content: "documents/  projects/  downloads/  config.yaml  README.md  package.json" }
        ]);
        break;
      
      case "pwd":
        setLines(prev => [...prev, { type: "output", content: currentPath }]);
        break;
      
      case "cd":
        if (parts[1]) {
          const newPath = parts[1] === ".." 
            ? currentPath.split("/").slice(0, -1).join("/") || "/"
            : parts[1].startsWith("/") ? parts[1] : `${currentPath}/${parts[1]}`;
          onPathChange(newPath);
          setLines(prev => [...prev, { type: "output", content: `Changed directory to ${newPath}` }]);
        } else {
          setLines(prev => [...prev, { type: "error", content: "cd: missing directory argument" }]);
        }
        break;
      
      case "help":
        setLines(prev => [...prev,
          { type: "output", content: "Available commands:" },
          { type: "output", content: "  ls        - List directory contents" },
          { type: "output", content: "  cd <dir>  - Change directory" },
          { type: "output", content: "  pwd       - Print working directory" },
          { type: "output", content: "  mkdir     - Create directory" },
          { type: "output", content: "  rm        - Remove file/directory" },
          { type: "output", content: "  clear     - Clear terminal" },
        ]);
        break;
      
      case "clear":
        setLines([]);
        break;
      
      default:
        setLines(prev => [...prev, { type: "error", content: `Command not found: ${command}. Type 'help' for available commands.` }]);
    }

    setInput("");
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      const parts = input.split(" ");
      parts[parts.length - 1] = suggestions[0];
      setInput(parts.join(" "));
      setSuggestions([]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  return (
    <div className="h-full bg-terminal-bg border-t border-terminal-border flex flex-col">
      {/* Terminal Header */}
      <div className="border-b border-terminal-border bg-card/20 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">SSH Terminal</span>
          <Badge variant="outline" className="text-xs path-font">
            {currentPath}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Plus className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Minimize2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Output */}
      <div ref={outputRef} className="flex-1 overflow-y-auto p-4 terminal-font text-sm">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "mb-1",
              line.type === "command" && "text-primary font-semibold",
              line.type === "output" && "text-foreground",
              line.type === "error" && "text-destructive"
            )}
          >
            {line.content}
          </div>
        ))}
      </div>

      {/* Autocomplete Suggestions */}
      {suggestions.length > 0 && (
        <div className="border-t border-terminal-border bg-muted/50 px-4 py-2">
          <div className="text-xs text-muted-foreground mb-1">Suggestions (press Tab):</div>
          <div className="flex gap-2 flex-wrap">
            {suggestions.map((suggestion) => (
              <Badge
                key={suggestion}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/20 terminal-font text-xs"
                onClick={() => {
                  const parts = input.split(" ");
                  parts[parts.length - 1] = suggestion;
                  setInput(parts.join(" "));
                  setSuggestions([]);
                  inputRef.current?.focus();
                }}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Terminal Input */}
      <div className="border-t border-terminal-border bg-card/20 p-4">
        <div className="flex items-center gap-2">
          <span className="text-primary terminal-font text-sm">$</span>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent border-none focus-visible:ring-0 terminal-font text-sm"
            autoFocus
          />
          <Button
            size="sm"
            onClick={() => handleCommand(input)}
            className="gap-2"
          >
            <Send className="w-3 h-3" />
            Run
          </Button>
        </div>
      </div>
    </div>
  );
}
