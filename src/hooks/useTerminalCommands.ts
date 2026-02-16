import { useCallback } from 'react'
import { TerminalState } from '../components/terminal/types'
import { EffectKey, Effects } from '../components/procedural-effects/types'

interface UseTerminalCommandsProps {
  state: TerminalState
}

export function useTerminalCommands({ state }: UseTerminalCommandsProps) {
  const executeCommand = useCallback((cmd: string): string | undefined => {
    const trimmed = cmd.trim().toLowerCase()
    const parts = trimmed.split(/\s+/)
    const command = parts[0]
    const args = parts.slice(1)

    if (!command) return

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
  whoami      - Display current user`

      case 'about':
        return `Kameron Comer - Software Engineer
Based in Austin, TX
Specializing in full-stack development with React, TypeScript, and Node.js
Building modern web applications with focus on performance and UX`

      case 'projects':
        window.location.href = '#projects'
        return 'Navigating to projects section...'

      case 'skills':
        window.location.href = '#skills'
        return 'Navigating to skills section...'

      case 'contact':
        window.location.href = '#contact'
        return 'Navigating to contact section...'

      case 'github':
        window.open('https://github.com/syntaxDuck', '_blank')
        return 'Opening GitHub profile in new tab...'

      case 'clear':
        state.setOutputBuff([])
        return ''

      case 'theme':
        document.documentElement.classList.toggle('dark')
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light')
        return `Theme switched to ${document.documentElement.classList.contains('dark') ? 'dark' : 'light'} mode`

      case 'whoami':
        return 'visitor@portfolio-os'

      case 'effects':
        return `Available hero effects:
  life      - Conway's Game of Life
  flow      - Flow Field
  lissajous - Lissajous Curves
  boids     - Boids (Flocking simulation)
  
Usage: effect <name>`

      case 'effect': {
        if (!args[0]) {
          return 'Usage: effect <life|flow|lissajous|boids>'
        }
        const effectKey = args[0] as EffectKey
        if (!Effects[effectKey]) {
          return `Unknown effect: ${args[0]}. Type "effects" for available options.`
        }
        state.setCurrentEffect(effectKey)
        return `Loading ${Effects[effectKey].label}...`
      }

      case 'exit':
        state.setMinimizedEffect(null)
        state.setIsMinimized(!state.isMinimized)
        return 'Terminal minimized. Click the terminal button to restore.'

      default:
        return `Command not found: ${command}. Type "help" for available commands.`
    }
  }, [state])

  const handleSubmit = useCallback((e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (state.inputBuff.trim()) {
      state.appendCmdHistory(state.inputBuff)
      state.setCmdHistoryIdx(-1)
      const result = executeCommand(state.inputBuff)
      if (result) {
        state.appendOutputBuff([`> ${state.inputBuff}`, result])
      }
      state.setInputBuff('')
    }
  }, [state, executeCommand])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, onMinimize: () => void) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onMinimize()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (state.cmdHistory.length > 0) {
        const newIndex = state.cmdHistoryIdx === -1 
          ? state.cmdHistory.length - 1 
          : Math.max(0, state.cmdHistoryIdx - 1)
        state.setCmdHistoryIdx(newIndex)
        state.setInputBuff(state.cmdHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (state.cmdHistoryIdx !== -1) {
        const newIndex = state.cmdHistoryIdx + 1
        if (newIndex >= state.cmdHistory.length) {
          state.setCmdHistoryIdx(-1)
          state.setInputBuff('')
        } else {
          state.setCmdHistoryIdx(newIndex)
          state.setInputBuff(state.cmdHistory[newIndex])
        }
      }
    }
  }, [state])

  return { executeCommand, handleSubmit, handleKeyDown }
}
