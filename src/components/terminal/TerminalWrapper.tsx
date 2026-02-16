import React, { useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

import TerminalHeader from './TerminalHeader';
import TerminalInput from './TerminalInput';
import { TerminalContext } from '../../context/terminal/TerminalContex';
import { Effects } from '../procedural-effects/types';
import TerminalOutput from './TerminalOutput';

const TerminalWrapper: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const termCtx = useContext(TerminalContext)


  useEffect(() => {
    if (!termCtx.isMinimized)
      document.body.style.overflow = 'hidden';
    if (termCtx.isMinimized)
      document.body.style.overflow = 'auto';
  }, [termCtx.isMinimized]);

  useEffect(() => {
    if (termCtx.isReady && inputRef.current && !termCtx.isMinimized) {
      inputRef.current.focus();
    }
  }, [termCtx.isReady, termCtx.isMinimized]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [termCtx.outputBuff]);

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const EffectComponent = termCtx.currentEffect ? Effects[termCtx.currentEffect]?.component : null;

  const handleMinimize = () => {
    termCtx.setIsMinimized(!termCtx.isMinimized);
  };

  const termCompound = {
    minimized: "relative overflow-hidden border border-borderMuted dark:border-borderMuted bg-bg-dark dark:bg-bg-dark",
    maximized: "absolute inset-0 bg-bg-dark dark:bg-bg-dark overflow-hidden border border-borderMuted dark:border-borderMuted"
  }

  const termVariants: Variants = {
    minimize: { scale: 0.9 },
    maximize: { height: '100vh', width: '100vw' }
  }

  return (
    <div className="w-full min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          variants={termVariants}
          initial="maximize"
          animate={termCtx.isMinimized ? "minimize" : "maximized"}
          transition={{ duration: 1, ease: 'linear' }}
          className={false ? termCompound.minimized : termCompound.maximized}
        >
          <div className="absolute inset-0 z-0">
            {EffectComponent && (
              <EffectComponent className="w-full h-full opacity-40" />
            )}
          </div>

          <div className="relative z-10 w-full h-full flex flex-col">
            <TerminalHeader />
            <div
              ref={terminalRef}
              onClick={handleTerminalClick}
              className="flex-1 p-4 font-mono text-sm overflow-y-auto"
            >
              <TerminalOutput outputRef={outputRef} />
              <TerminalInput inputRef={inputRef} onMinimize={handleMinimize} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TerminalWrapper;
