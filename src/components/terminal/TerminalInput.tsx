import React, { Ref, useContext } from 'react'
import { TerminalContext } from '../../context/terminal/TerminalContext'
import { useTerminalCommands } from '../../hooks/useTerminalCommands'

interface TerminalInputProps {
  inputRef: Ref<HTMLInputElement | null>,
  onMinimize: () => void,
}

const TerminalInput: React.FC<TerminalInputProps> = ({ inputRef, onMinimize }) => {
  const termCtx = useContext(TerminalContext)
  const { handleSubmit, handleKeyDown } = useTerminalCommands({ state: termCtx })

  return (
    <>
      {!termCtx.isBooting && termCtx.isReady && (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-primary dark:text-primary-dark">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={termCtx.inputBuff}
            onChange={(e) => termCtx.setInputBuff(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, onMinimize)}
            className="flex-1 bg-transparent border-none outline-none text-text dark:text-text-dark"
            placeholder="Type a command..."
            autoFocus
          />
        </form>
      )}
    </>
  )
}

export default TerminalInput
