import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface CodeRunResult {
  output: string;
  error?: string;
}

const CodePlaygroundPage: React.FC = () => {
  const [code, setCode] = useState(`// Welcome to the Code Playground
// Write JavaScript and run it in your browser

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));

// Try some array operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Object manipulation
const user = {
  name: "Kameron",
  skills: ["React", "TypeScript", "Node.js"]
};
console.log(JSON.stringify(user, null, 2));
`);

  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);

    setTimeout(() => {
      const logs: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        },
        error: (...args: any[]) => {
          logs.push(`Error: ${args.join(' ')}`);
        },
        warn: (...args: any[]) => {
          logs.push(`Warning: ${args.join(' ')}`);
        },
      };

      try {
        const fn = new Function('console', code);
        fn(mockConsole);
        setOutput(logs.length > 0 ? logs : ['No output']);
      } catch (error: any) {
        setOutput([`Error: ${error.message}`]);
      }

      setIsRunning(false);
    }, 100);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-primary-dark mb-2">Code Playground</h1>
        <p className="text-muted dark:text-muted-dark">
          Write and run JavaScript in your browser. Press <kbd className="px-2 py-1 bg-bg2 dark:bg-bg2-dark border border-borderMuted rounded-sm text-sm">⌘+Enter</kbd> to run
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
        <div className="flex flex-col border border-borderMuted bg-bg2 dark:bg-bg2-dark">
          <div className="flex items-center justify-between px-4 py-2 bg-primary/10 dark:bg-primary-dark/10 border-b border-borderMuted">
            <span className="text-sm font-medium">Editor</span>
            <div className="flex items-center gap-2">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="px-3 py-1 bg-primary dark:bg-primary-dark text-bg dark:text-bg-dark text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isRunning ? 'Running...' : 'Run'}
              </button>
            </div>
          </div>
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-4 bg-transparent border-none outline-none font-mono text-sm text-text dark:text-text-dark resize-none"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col border border-borderMuted bg-bg2 dark:bg-bg2-dark">
          <div className="flex items-center justify-between px-4 py-2 bg-primary/10 dark:bg-primary-dark/10 border-b border-borderMuted">
            <span className="text-sm font-medium">Output</span>
            <button
              onClick={clearOutput}
              className="px-3 py-1 text-sm text-muted hover:text-text transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 p-4 overflow-auto font-mono text-sm">
            {output.length === 0 ? (
              <span className="text-muted dark:text-muted-dark">Output will appear here...</span>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-1"
              >
                {output.map((line, i) => (
                  <div
                    key={i}
                    className={`${
                      line.startsWith('Error:')
                        ? 'text-danger'
                        : line.startsWith('Warning:')
                        ? 'text-warning'
                        : 'text-text dark:text-text-dark'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {['console.log()', 'function', 'const', '=>'].map((snippet) => (
          <button
            key={snippet}
            onClick={() => {
              setCode(prev => prev + (prev.endsWith('\n') || prev === '' ? '' : '\n') + snippet);
              editorRef.current?.focus();
            }}
            className="px-3 py-2 text-xs bg-bg2 dark:bg-bg2-dark border border-borderMuted hover:border-primary dark:hover:border-primary-dark transition-colors text-left"
          >
            {snippet}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CodePlaygroundPage;
