import React, { useContext } from 'react'
import { TerminalContext } from '../../context/terminal/TerminalContex';

const TerminalHeader: React.FC = () => {

  const termCtx = useContext(TerminalContext);


  return (<>
    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary-dark/10 border-b border-borderMuted">
      <span className="text-sm text-muted dark:text-muted-dark font-mono">portfolio-os</span>
      <button
        onClick={() => termCtx.setIsMinimized(!termCtx.isMinimized)}
        className="ml-auto px-2 py-1 text-xs text-muted hover:text-text dark:hover:text-text-dark transition-colors"
      >
        {termCtx.isMinimized ? "[Fullscreen]" : "[_]"}
      </button>
    </div>
  </>
  );
}

export default TerminalHeader;
