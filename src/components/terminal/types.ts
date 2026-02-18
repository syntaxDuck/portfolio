import { EffectKey } from "../procedural-effects/types";
import { PortfolioConfig } from "../../config/portfolio";

export interface BootLine {
  text: string;
  delay: number;
  type: 'info' | 'success' | 'error' | 'input';
}

export const bootSequence: BootLine[] = PortfolioConfig.terminal.bootMessages;

export const asciiBanner = PortfolioConfig.terminal.asciiBanner;

export const aboutContent: string[] = PortfolioConfig.terminal.aboutContent;

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
  effectConfig: {},
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
  setEffectConfig: () => { },
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
  effectConfig: Record<string, unknown>;
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
  setEffectConfig: (config: Record<string, unknown>) => void,
  rebootTerminal: () => void,
}
