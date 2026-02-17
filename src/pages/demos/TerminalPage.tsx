import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TerminalPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([
    '> Welcome to the command palette. Type "help" for available commands.',
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const commands: Record<string, (args: string[]) => string> = {
    help: () => {
      return `Available commands:
  help        - Show this help message
  about       - Learn about Kameron
  projects    - View my projects
  blog        - Read my blog
  contact     - Get in touch
  github      - Open GitHub profile
  clear       - Clear terminal
  theme       - Toggle dark/light mode
  whoami      - Display current user`;
    },
    about: () => {
      return `Kameron Comer - Software Engineer
Based in Austin, TX
Specializing in full-stack development with React, TypeScript, and Node.js`;
    },
    projects: () => {
      return `Opening projects page... [redirect to /projects]`;
    },
    blog: () => {
      return `Opening blog... [redirect to /blog]`;
    },
    contact: () => {
      return `Opening contact form... [redirect to /#contact]`;
    },
    github: () => {
      window.open('https://github.com/syntaxDuck', '_blank');
      return 'Opening GitHub profile in new tab...';
    },
    clear: () => {
      setOutput([]);
      return '';
    },
    whoami: () => {
      return 'visitor@portfolio';
    },
    theme: () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
      return `Theme switched to ${document.documentElement.classList.contains('dark') ? 'dark' : 'light'} mode`;
    },
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = trimmed.split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    if (!command) return;

    if (command === 'clear') {
      setOutput([]);
      return;
    }

    const handler = commands[command];
    if (handler) {
      const result = handler(args);
      if (result) {
        setOutput(prev => [...prev, `> ${cmd}`, result]);
      }
    } else {
      setOutput(prev => [...prev, `> ${cmd}`, `Command not found: ${command}. Type "help" for available commands.`]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setHistory(prev => [...prev, input]);
      setHistoryIndex(-1);
      executeCommand(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-primary-dark mb-2">Command Palette</h1>
        <p className="text-muted dark:text-muted-dark">
          Press <kbd className="px-2 py-1 bg-bg2 dark:bg-bg2-dark border border-borderMuted rounded-sm text-sm">⌘K</kbd> or <kbd className="px-2 py-1 bg-bg2 dark:bg-bg2-dark border border-borderMuted rounded-sm text-sm">Ctrl+K</kbd> to open the terminal palette
        </p>
      </div>

      <div className="bg-bg2 dark:bg-bg2-dark border border-borderMuted rounded-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary-dark/10 border-b border-borderMuted">
          <div className="w-3 h-3 rounded-full bg-danger" />
          <div className="w-3 h-3 rounded-full bg-warning" />
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="ml-2 text-sm text-muted dark:text-muted-dark">terminal</span>
        </div>
        
        <div 
          className="p-4 min-h-[300px] font-mono text-sm"
        >
          <div ref={outputRef} className="space-y-1 mb-2">
            {output.map((line, i) => (
              <div key={i} className="text-text dark:text-text-dark whitespace-pre-wrap">{line}</div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-primary dark:text-primary-dark">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-text dark:text-text-dark"
              placeholder="Type a command..."
            />
          </form>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-bg-dark/80 backdrop-blur-sm" />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="relative w-full max-w-lg bg-bg2 dark:bg-bg2-dark border border-borderMuted shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-borderMuted">
                <span className="text-primary dark:text-primary-dark">{'>'}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onSubmit={handleSubmit}
                  className="flex-1 bg-transparent border-none outline-none text-text dark:text-text-dark placeholder-muted"
                  placeholder="Type a command..."
                  autoFocus
                />
                <kbd className="px-2 py-1 text-xs bg-bg dark:bg-bg-dark border border-borderMuted rounded-sm text-muted">ESC</kbd>
              </div>
              <div className="p-4 max-h-64 overflow-y-auto">
                <div className="text-sm text-muted dark:text-muted-dark mb-2">Available commands:</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(commands).map((cmd) => (
                    <button
                      key={cmd}
                      onClick={() => { setInput(cmd); inputRef.current?.focus(); }}
                      className="px-3 py-2 text-left text-sm bg-bg dark:bg-bg-dark border border-borderMuted hover:border-primary dark:hover:border-primary-dark transition-colors"
                    >
                      <span className="text-primary dark:text-primary-dark">{cmd}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TerminalPage;
