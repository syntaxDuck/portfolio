import React, { useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

import TerminalHeader from './TerminalHeader';
import TerminalInput from './TerminalInput';
import { TerminalContext } from '../../context/terminal/TerminalContext';
import { Effects } from '../procedural-effects/types';
import TerminalOutput from './TerminalOutput';
import { useBodyScroll } from '../../hooks/useBodyScroll';

const TerminalWrapper: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const termCtx = useContext(TerminalContext)

  useBodyScroll(!termCtx.isMinimized)

  useEffect(() => {
    if (termCtx.isReady && inputRef.current && !termCtx.isMinimized) {
      inputRef.current.focus();
    }
  }, [termCtx.isReady, termCtx.isMinimized]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [termCtx.outputBuff, termCtx.inputBuff]);

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const EffectComponent = termCtx.currentEffect ? Effects[termCtx.currentEffect]?.component : null;

  const handleMinimize = () => {
    termCtx.setIsMinimized(!termCtx.isMinimized);
  };

  const termVariants: Variants = {
    minimize: { scale: 0.95 },
    maximize: { height: '100%', width: '100%' }
  }

  return (
    <div className="w-full h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          variants={termVariants}
          initial="maximize"
          animate={termCtx.isMinimized ? "minimize" : "maximized"}
          transition={{ duration: 1, ease: 'linear' }}
          className={`absolute inset-0 bg-bg-dark dark:bg-bg-dark overflow-hidden border border-borderMuted dark:border-borderMuted ${termCtx.isMinimized ? 'h-[60vh]' : 'h-screen'}`}
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
              className="flex-1 p-2 md:p-4 font-mono text-sm overflow-y-auto"
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
