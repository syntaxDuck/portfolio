import React, { Ref, useContext } from "react"
import { motion } from "framer-motion"
import { TerminalContext } from "../../context/terminal/TerminalContext"
import { asciiBanner, getLineColor } from "./types"

interface TerminalOutputProps {
  outputRef: Ref<HTMLDivElement | null>
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ outputRef }) => {
  const termCtx = useContext(TerminalContext);

  return (
    <>
      {
        termCtx.isBooting ? (
          <div className="space-y-1">
            {termCtx.bootLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={getLineColor(line.type)}
              >
                {line.text || '\u00A0'}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="text-primary dark:text-primary-dark"
            >
              _
            </motion.div>
          </div>
        ) : (
          <div ref={outputRef} className="space-y-1 mb-2">
            <div className="text-white whitespace-pre">{asciiBanner}</div>
            {termCtx.outputBuff.map((line, i) => (
              <div key={i} className="text-white whitespace-pre-wrap">{line}</div>
            ))}
          </div>
        )
      }
    </>
  )
}

export default TerminalOutput
