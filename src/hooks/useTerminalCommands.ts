import { useCallback } from 'react'
import { TerminalState } from '../components/terminal/types'
import { EffectKey, Effects } from '../components/procedural-effects/types'
import { PortfolioConfig } from '../config/portfolio'
import { parseCommandInput, parseHexColor } from '../utils/commandParser'

const DONUT_FLAGS = `
  --speedA    Rotation speed around tube (0-0.1)
  --speedB    Rotation speed around torus (0-0.1)
  --color     Hex color (e.g., #ff0000 or ff0000)
  --thetaStep Detail level around tube (0.01-0.2)
  --phiStep   Detail level around torus (0.01-0.1)
  --fontSizeMin Minimum font size (5-20)
  --fontSizeMax Maximum font size (5-30)`

const CUBE_FLAGS = `
  --speedX    X-axis rotation speed (0-0.1)
  --speedY    Y-axis rotation speed (0-0.1)
  --speedZ    Z-axis rotation speed (0-0.1)
  --k1        Perspective scale (1000-10000)
  --k2        Depth offset (1-20)
  --centerX   X offset (-200 to 200)
  --centerY   Y offset (-200 to 200)
  --color     Hex color (e.g., #ff0000 or ff0000)`

interface UseTerminalCommandsProps {
  state: TerminalState
}

export function useTerminalCommands({ state }: UseTerminalCommandsProps) {
  const executeCommand = useCallback((cmd: string): string | undefined => {
    const { args, flags } = parseCommandInput(cmd.trim().toLowerCase())
    const command = args[0]

    if (!command) return

    switch (command) {
      case 'help':
        return `Available commands:
  help        - Show this help message
  about       - Learn about ${PortfolioConfig.name.split(' ')[0]}
  projects    - View my projects
  skills      - View my skills
  contact     - Get in touch
  github      - Open GitHub profile
  clear       - Clear terminal
  theme       - Toggle dark/light mode
  effects     - List available hero effects
  effect      - Display hero effect (life, flow, lissajous, boids, donut, cube)
  exit        - Minimize terminal
  whoami      - Display current user`

      case 'about':
        return `${PortfolioConfig.name} - ${PortfolioConfig.title}
Based in ${PortfolioConfig.location}
${PortfolioConfig.tagline}
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
        window.open(`https://github.com/${PortfolioConfig.social.github}`, '_blank')
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
  donut     - 3D Donut (ASCII)
  cube      - 3D Cube (Wireframe)
  
Usage: effect <name> [--flag=value]
Type "effect help" for available flags`

      case 'effect': {
        if (!args[1]) {
          return `Usage: effect <name> [--flag=value]
Type "effect help" for available flags

Available effects: life, flow, lissajous, boids, donut, cube`
        }

        // Handle "effect help" or "effect donut help"
        if (args[1] === 'help' || args[2] === 'help') {
          const effectName = args[1] === 'help' ? args[2] : args[1];
          if (!effectName) {
            return `Usage: effect <name> [--flag=value]
Available effects: life, flow, lissajous, boids, donut, cube`;
          }
          
          if (effectName === 'donut') {
            return `Donut effect flags:${DONUT_FLAGS}`;
          } else if (effectName === 'cube') {
            return `Cube effect flags:${CUBE_FLAGS}`;
          }
          return `No configurable flags for ${effectName}`;
        }

        const effectKey = args[1] as EffectKey
        if (!Effects[effectKey]) {
          return `Unknown effect: ${args[1]}. Type "effects" for available options.`
        }

        const config: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(flags)) {
          if (key === 'color' && value) {
            const color = parseHexColor(value);
            if (color) {
              config.color = color;
            }
          } else if (['speedA', 'speedB', 'speedX', 'speedY', 'speedZ', 'thetaStep', 'phiStep', 'fontSizeMin', 'fontSizeMax', 'k1', 'k2', 'centerX', 'centerY'].includes(key)) {
            const num = parseFloat(value);
            if (!isNaN(num)) {
              config[key] = num;
            }
          }
        }

        state.setCurrentEffect(effectKey);
        state.setEffectConfig(config);
        
        const flagCount = Object.keys(flags).length;
        if (flagCount > 0) {
          return `Loading ${Effects[effectKey].label} with ${flagCount} custom parameter(s)...`;
        }
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
