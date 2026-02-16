import { createContext } from "react";
import { TerminalState, defaultTerminalState } from "../../components/terminal/types";

export const TerminalContext = createContext<TerminalState>(defaultTerminalState);
