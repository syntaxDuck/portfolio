import React, { useEffect, useState, useRef } from 'react'
import { EffectKey, selectRandomEffect } from '../../components/procedural-effects/types'
import { BootLine, bootSequence, defaultTerminalState, TerminalState, aboutContent } from '../../components/terminal/types'
import { TerminalContext } from './TerminalContext'


interface TerminalContextProvider {
  children?: React.ReactNode
}

const TerminalContextProvider: React.FC<TerminalContextProvider> = ({ children }) => {
  const [bootLines, setBootLines] = useState<BootLine[]>(defaultTerminalState.bootLines)
  const [isMinimized, setIsMinimized] = useState<boolean>(defaultTerminalState.isMinimized)
  const [isBooting, setIsBooting] = useState<boolean>(defaultTerminalState.isBooting)
  const [isReady, setIsReady] = useState<boolean>(defaultTerminalState.isReady)
  const [outputBuff, setOutputBuff] = useState<string[]>(defaultTerminalState.outputBuff)
  const [inputBuff, setInputBuff] = useState<string>(defaultTerminalState.inputBuff)
  const [cmdHistory, setCmdHistory] = useState<string[]>(defaultTerminalState.cmdHistory)
  const [cmdHistoryIdx, setCmdHistoryIdx] = useState<number>(defaultTerminalState.cmdHistoryIdx)
  const [currentEffect, setCurrentEffect] = useState<EffectKey | null>(defaultTerminalState.currentEffect);
  const [minimizedEffect, setMinimizedEffect] = useState<EffectKey | null>(defaultTerminalState.minimizedEffect);

  const bootStartedRef = useRef(false);

  const appendBootLines = (lines: BootLine[]) => setBootLines(prev => [...prev, ...lines])
  const appendOutputBuf = (strs: string[]) => setOutputBuff(prev => [...prev, ...strs])
  const handleInputBuf = (val: string) => setInputBuff(val)
  const handleAppendCmdHistory = (cmd: string) => setCmdHistory(prev => [...prev, cmd]);
  const handleCmdHistoryIdx = (val: number) => setCmdHistoryIdx(val)
  const handleUpdateCurrentEffect = (val: EffectKey | null) => setCurrentEffect(val)
  const handleUpdateMinimizedEffect = (val: EffectKey | null) => setMinimizedEffect(prev => val ? val : prev || selectRandomEffect())

  const rebootTerminal = () => {
    bootStartedRef.current = false;
    setBootLines([]);
    setOutputBuff([]);
    setIsBooting(true);
    setIsReady(false);
    setIsMinimized(false);
    setInputBuff('');
    setCmdHistory([]);
    setCmdHistoryIdx(0);
  }

  useEffect(() => {
    if (!isBooting || bootStartedRef.current) return;
    bootStartedRef.current = true;
    
    let mounted = true;
    const totalDuration = bootSequence[bootSequence.length - 1]?.delay ?? 6500;

    bootSequence.forEach((line) => {
      setTimeout(() => {
        if (mounted) {
          setBootLines(prev => [...prev, line]);
        }
      }, line.delay);
    });

    setTimeout(() => {
      if (mounted) {
        setIsBooting(false);
        setIsReady(true);
        setIsMinimized(true);
        setOutputBuff(aboutContent);
      }
    }, totalDuration + 500);

    return () => { mounted = false; };
  }, [isBooting]);

  const terminalState: TerminalState = {
    bootLines: bootLines,
    isMinimized: isMinimized,
    isBooting: isBooting,
    isReady: isReady,
    outputBuff: outputBuff,
    inputBuff: inputBuff,
    cmdHistory: cmdHistory,
    cmdHistoryIdx: cmdHistoryIdx,
    currentEffect: currentEffect,
    minimizedEffect: minimizedEffect,
    appendBootLines: appendBootLines,
    setIsMinimized: setIsMinimized,
    setIsBooting: setIsBooting,
    setIsReady: setIsReady,
    appendOutputBuff: appendOutputBuf,
    setOutputBuff: setOutputBuff,
    setInputBuff: handleInputBuf,
    appendCmdHistory: handleAppendCmdHistory,
    setCmdHistoryIdx: handleCmdHistoryIdx,
    setCurrentEffect: handleUpdateCurrentEffect,
    setMinimizedEffect: handleUpdateMinimizedEffect,
    rebootTerminal: rebootTerminal,
  }


  return (<TerminalContext.Provider value={terminalState}>{children}</TerminalContext.Provider>);
}



export default TerminalContextProvider;


