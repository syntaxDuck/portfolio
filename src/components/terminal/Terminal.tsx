import React from "react";
import TerminalContextProvider from "../../context/terminal/TerminalContextProvider";
import TerminalWrapper from "./TerminalWrapper";


const Terminal: React.FC = () => {

  return (<TerminalContextProvider><TerminalWrapper /></TerminalContextProvider>)
}

export default Terminal;
