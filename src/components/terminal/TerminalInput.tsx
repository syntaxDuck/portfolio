import React, { Ref, useContext } from 'react'
import { TerminalContext } from '../../context/terminal/TerminalContex'
import { EffectKey, Effects } from '../procedural-effects/types'

interface TerminalInputProps {
  inputRef: Ref<HTMLInputElement | null>,
  onMinimize: () => void,
}

const TerminalInput: React.FC<TerminalInputProps> = ({ inputRef, onMinimize }) => {
  const termCtx = useContext(TerminalContext);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = trimmed.split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    if (!command) return;

    switch (command) {
      case 'help':
        return `Available commands:
  help        - Show this help message
  about       - Learn about Kameron
  projects    - View my projects
  skills      - View my skills
  contact     - Get in touch
  github      - Open GitHub profile
  clear       - Clear terminal
  theme       - Toggle dark/light mode
  effects     - List available hero effects
  effect <n>  - Display hero effect (life, flow, lissajous, boids)
  exit        - Minimize terminal
  whoami      - Display current user`;

      case 'about':
        return `Kameron Comer - Software Engineer
Based in Austin, TX
Specializing in full-stack development with React, TypeScript, and Node.js
Building modern web applications with focus on performance and UX`;

      case 'projects':
        window.location.href = '#projects';
        return 'Navigating to projects section...';

      case 'skills':
        window.location.href = '#skills';
        return 'Navigating to skills section...';

      case 'contact':
        window.location.href = '#contact';
        return 'Navigating to contact section...';

      case 'github':
        window.open('https://github.com/syntaxDuck', '_blank');
        return 'Opening GitHub profile in new tab...';

      case 'clear':
        termCtx.setOutputBuff([]);
        return '';

      case 'theme':
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        return `Theme switched to ${document.documentElement.classList.contains('dark') ? 'dark' : 'light'} mode`;

      case 'whoami':
        return 'visitor@portfolio-os';

      case 'effects':
        return `Available hero effects:
  life      - Conway's Game of Life
  flow      - Flow Field
  lissajous - Lissajous Curves
  boids     - Boids (Flocking simulation)
  
Usage: effect <name>`;

      case 'effect': {
        if (!args[0]) {
          return 'Usage: effect <life|flow|lissajous|boids>';
        }
        const effectKey = args[0] as EffectKey;
        if (!Effects[effectKey]) {
          return `Unknown effect: ${args[0]}. Type "effects" for available options.`;
        }
        termCtx.setCurrentEffect(effectKey);
        return `Loading ${Effects[effectKey].label}...`;
      }

      case 'exit':
        termCtx.setMinimizedEffect(null);
        termCtx.setIsMinimized(!termCtx.isMinimized);
        return 'Terminal minimized. Click the terminal button to restore.';

      default:
        return `Command not found: ${command}. Type "help" for available commands.`;
    }
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (termCtx.inputBuff.trim()) {
      termCtx.appendCmdHistory(termCtx.inputBuff);
      termCtx.setCmdHistoryIdx(-1);
      const result = executeCommand(termCtx.inputBuff);
      if (result) {
        termCtx.appendOutputBuff([`> ${termCtx.inputBuff}`, result]);
      }
      termCtx.setInputBuff('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onMinimize();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = termCtx.cmdHistoryIdx === -1 ? history.length - 1 : Math.max(0, termCtx.cmdHistoryIdx - 1);
        termCtx.setCmdHistoryIdx(newIndex);
        termCtx.setInputBuff(termCtx.cmdHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (termCtx.cmdHistoryIdx !== -1) {
        const newIndex = termCtx.cmdHistoryIdx + 1;
        if (newIndex >= history.length) {
          termCtx.setCmdHistoryIdx(-1);
          termCtx.setInputBuff('');
        } else {
          termCtx.setCmdHistoryIdx(newIndex);
          termCtx.setInputBuff(termCtx.cmdHistory[newIndex]);
        }
      }
    }
  };

  return (<>
    {!termCtx.isBooting && termCtx.isReady && (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-primary dark:text-primary-dark">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={termCtx.inputBuff}
          onChange={(e) => termCtx.setInputBuff(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-text dark:text-text-dark"
          placeholder="Type a command..."
          autoFocus
        />
      </form>
    )}

  </>)
}

export default TerminalInput;
