import { useRef, useEffect } from "react";
import { Terminal as TerminalIcon } from "lucide-react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { executeSSHCommand } from "@/lib/ssh";

interface TerminalProps {
  currentPath: string;
  onPathChange?: (path: string) => void;
  connection: {
    host: string;
    port: number;
    username: string;
    password?: string;
    privateKey?: string;
    passphrase?: string;
  };
}

export function Terminal({ currentPath, onPathChange, connection }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const currentLineRef = useRef<string>("");

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: '"Cascadia Code", Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: "#0a0a0a",
        foreground: "#e0e0e0",
        cursor: "#3b82f6",
        selectionBackground: "#3b82f620",
        black: "#000000",
        brightBlack: "#808080",
        red: "#ef4444",
        brightRed: "#f87171",
        green: "#10b981",
        brightGreen: "#34d399",
        yellow: "#f59e0b",
        brightYellow: "#fbbf24",
        blue: "#3b82f6",
        brightBlue: "#60a5fa",
        magenta: "#a855f7",
        brightMagenta: "#c084fc",
        cyan: "#06b6d4",
        brightCyan: "#22d3ee",
        white: "#e0e0e0",
        brightWhite: "#ffffff",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    term.writeln("\x1b[1;34m╔══════════════════════════════════════╗\x1b[0m");
    term.writeln("\x1b[1;34m║       SSH Terminal Ready             ║\x1b[0m");
    term.writeln("\x1b[1;34m╚══════════════════════════════════════╝\x1b[0m");
    term.writeln(`\x1b[1;32mConnected to:\x1b[0m ${connection.host}:${connection.port}`);
    term.writeln("");
    term.write(`\x1b[1;32m${connection.username}@${connection.host}\x1b[0m:\x1b[1;34m${currentPath}\x1b[0m$ `);

    term.onData((data) => {
      if (data === "\r") {
        // Enter key
        term.writeln("");
        const command = currentLineRef.current.trim();
        if (command) {
          executeCommand(command);
        } else {
          term.write(`\x1b[1;32m${connection.username}@${connection.host}\x1b[0m:\x1b[1;34m${currentPath}\x1b[0m$ `);
        }
        currentLineRef.current = "";
      } else if (data === "\x7f") {
        // Backspace
        if (currentLineRef.current.length > 0) {
          currentLineRef.current = currentLineRef.current.slice(0, -1);
          term.write("\b \b");
        }
      } else if (data >= String.fromCharCode(0x20) && data <= String.fromCharCode(0x7e)) {
        // Printable characters
        currentLineRef.current += data;
        term.write(data);
      }
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();
    };
  }, []);

  const executeCommand = async (command: string) => {
    const term = xtermRef.current;
    if (!term) return;

    try {
      const fullCommand = `cd ${currentPath} && ${command}`;
      const result = await executeSSHCommand(connection, fullCommand);

      if (result.stdout) {
        term.writeln(result.stdout);
      }
      if (result.stderr) {
        term.writeln(`\x1b[1;31m${result.stderr}\x1b[0m`);
      }

      // Update path if cd command
      if (command.startsWith("cd ")) {
        const newPath = command.substring(3).trim();
        if (newPath) {
          const absolutePath = newPath.startsWith("/")
            ? newPath
            : newPath === ".."
            ? currentPath.split("/").slice(0, -1).join("/") || "/"
            : `${currentPath}/${newPath}`.replace(/\/+/g, "/");
          onPathChange?.(absolutePath);
        }
      }
    } catch (error: any) {
      term.writeln(`\x1b[1;31mError: ${error.message}\x1b[0m`);
    }

    term.write(`\x1b[1;32m${connection.username}@${connection.host}\x1b[0m:\x1b[1;34m${currentPath}\x1b[0m$ `);
  };

  return (
    <div className="h-full bg-terminal-bg border-t border-terminal-border flex flex-col">
      {/* Terminal Header */}
      <div className="border-b border-terminal-border bg-card/20 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">SSH Terminal</span>
          <span className="text-xs text-muted-foreground path-font">
            {connection.username}@{connection.host}:{currentPath}
          </span>
        </div>
      </div>

      {/* xterm.js Terminal */}
      <div ref={terminalRef} className="flex-1 p-2 overflow-hidden" />
    </div>
  );
}
