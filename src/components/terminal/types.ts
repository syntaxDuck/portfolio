import { EffectKey } from "../procedural-effects/types";

export interface BootLine {
  text: string;
  delay: number;
  type: 'info' | 'success' | 'error' | 'input';
}

export const bootSequence: BootLine[] = [
  { text: 'PORTFOLIO OS v1.0.0', delay: 0, type: 'info' },
  { text: 'Booting system...', delay: 200, type: 'info' },
  { text: 'Checking memory... OK', delay: 600, type: 'success' },
  { text: 'Loading kernel... OK', delay: 1000, type: 'success' },
  { text: 'Initializing graphics... OK', delay: 1400, type: 'success' },
  { text: 'Mounting filesystem... OK', delay: 1800, type: 'success' },
  { text: 'Loading hero effects module... OK', delay: 2200, type: 'success' },
  { text: 'Brewing coffee... OK', delay: 2400, type: 'success' },
  { text: 'Purging cache... OK', delay: 2600, type: 'success' },
  { text: 'Loading sense of humor... OK', delay: 2800, type: 'success' },
  { text: 'Starting terminal service... OK', delay: 3000, type: 'success' },
  { text: 'Convincing compiler to cooperate... OK', delay: 3400, type: 'success' },
  { text: 'Loading motivation... OK', delay: 3800, type: 'success' },
  { text: 'Initializing will to live... OK', delay: 4200, type: 'success' },
  { text: 'Establishing connection... OK', delay: 4600, type: 'success' },
  { text: '', delay: 5000, type: 'info' },
  { text: 'localhost login: visitor', delay: 5200, type: 'input' },
  { text: 'Password: ********', delay: 5600, type: 'info' },
  { text: '', delay: 6000, type: 'info' },
  { text: 'Welcome to Portfolio OS v1.0.0', delay: 6400, type: 'success' },
  { text: 'Type "help" for available commands.', delay: 6600, type: 'info' },
];

export const asciiBanner = `██╗  ██╗ █████╗ ███╗   ███╗███████╗██████╗  ██████╗ ███╗   ██╗
██║ ██╔╝██╔══██╗████╗ ████║██╔════╝██╔══██╗██╔═══██╗████╗  ██║
█████╔╝ ███████║██╔████╔██║█████╗  ██████╔╝██║   ██║██╔██╗ ██║
██╔═██╗ ██╔══██║██║╚██╔╝██║██╔══╝  ██╔══██╗██║   ██║██║╚██╗██║
██║  ██╗██║  ██║██║ ╚═╝ ██║███████╗██║  ██║╚██████╔╝██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
                                                          
 ██████╗ ██████╗ ███╗   ███╗███████╗██████╗                   
██╔════╝██╔═══██╗████╗ ████║██╔════╝██╔══██╗                  
██║     ██║   ██║██╔████╔██║█████╗  ██████╔╝                  
██║     ██║   ██║██║╚██╔╝██║██╔══╝  ██╔══██╗                  
╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗██║  ██║                  
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝`;

export const aboutContent: string[] = [
  '',
  'Full-Stack Developer | Austin, TX',
  '',
  'Type "help" for commands or scroll down to explore.',
  '',
  '↓ Scroll to explore',
];

export const defaultTerminalState: TerminalState = {
  bootLines: [],
  isMinimized: false,
  isBooting: true,
  isReady: false,
  outputBuff: [],
  inputBuff: "",
  cmdHistory: [],
  cmdHistoryIdx: 0,
  currentEffect: null,
  minimizedEffect: null,
  appendBootLines: () => { },
  setIsMinimized: () => { },
  setIsBooting: () => { },
  setIsReady: () => { },
  appendOutputBuff: () => { },
  setOutputBuff: () => { },
  setInputBuff: () => { },
  appendCmdHistory: () => { },
  setCmdHistoryIdx: () => { },
  setCurrentEffect: () => { },
  setMinimizedEffect: () => { },
  rebootTerminal: () => { },
}

export type BootLineType = 'info' | 'success' | 'error' | 'input';

export function getLineColor(type: BootLineType): string {
  switch (type) {
    case 'success': return 'text-success';
    case 'error': return 'text-danger';
    case 'input': return 'text-primary dark:text-primary-dark';
    default: return 'text-text dark:text-text-dark';
  }
}

export interface TerminalState {
  bootLines: BootLine[];
  isMinimized: boolean;
  isBooting: boolean;
  isReady: boolean;
  outputBuff: string[];
  inputBuff: string;
  cmdHistory: string[];
  cmdHistoryIdx: number;
  currentEffect: EffectKey | null;
  minimizedEffect: EffectKey | null;
  appendBootLines: (lines: BootLine[]) => void
  setIsMinimized: (val: boolean) => void;
  setIsBooting: (val: boolean) => void;
  setIsReady: (val: boolean) => void;
  appendOutputBuff: (strs: string[]) => void;
  setOutputBuff: (val: string[]) => void;
  setInputBuff: (val: string) => void;
  appendCmdHistory: (val: string) => void;
  setCmdHistoryIdx: (val: number) => void;
  setCurrentEffect: (val: EffectKey | null) => void,
  setMinimizedEffect: (val: EffectKey | null) => void,
  rebootTerminal: () => void,
}
