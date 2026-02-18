// Portfolio configuration
// This file contains user-specific settings for the portfolio

type BootLineType = 'info' | 'success' | 'error' | 'input';

interface BootLine {
  text: string;
  delay: number;
  type: BootLineType;
}

export const PortfolioConfig: {
  name: string;
  title: string;
  location: string;
  tagline: string;
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
  terminal: {
    bootMessages: BootLine[];
    asciiBanner: string;
    aboutContent: string[];
  };
} = {
  // Personal Info
  name: 'Kameron Comer',
  title: 'Full-Stack Developer',
  location: 'Austin, TX',
  tagline: 'Full-Stack Developer | Austin, TX',

  // Social Links (usernames, not full URLs)
  social: {
    github: 'syntaxDuck',
    linkedin: 'kameroncomer',
    email: 'hello@example.com',
  },

  // Terminal Config
  terminal: {
    bootMessages: [
      { text: 'PORTFOLIO OS v1.0.0', delay: 0, type: 'info' },
      { text: 'Booting system...', delay: 200, type: 'info' },
      { text: 'Checking memory... OK', delay: 600, type: 'success' },
      { text: 'Loading kernel... OK', delay: 1000, type: 'success' },
      { text: 'Initializing graphics... OK', delay: 1400, type: 'success' },
      { text: 'Mounting filesystem... OK', delay: 1800, type: 'success' },
      { text: 'Loading hero effects module... OK', delay: 2200, type: 'success' },
      { text: 'Brewing coffee... OK', delay: 2400, type: 'success' },
      { text: 'Purging cache... OK', delay: 2600, type: 'success' },
      { text: 'Loading sense of humor... OK', delay: 2800, type: 'success' },
      { text: 'Starting terminal service... OK', delay: 3000, type: 'success' },
      { text: 'Convincing compiler to cooperate... OK', delay: 3400, type: 'success' },
      { text: 'Loading motivation... OK', delay: 3800, type: 'success' },
      { text: 'Initializing will to live... OK', delay: 4200, type: 'success' },
      { text: 'Establishing connection... OK', delay: 4600, type: 'success' },
      { text: '', delay: 5000, type: 'info' },
      { text: 'localhost login: visitor', delay: 5200, type: 'input' },
      { text: 'Password: ********', delay: 5600, type: 'info' },
      { text: '', delay: 6000, type: 'info' },
      { text: 'Welcome to Portfolio OS v1.0.0', delay: 6400, type: 'success' },
      { text: 'Type "help" for available commands.', delay: 6600, type: 'info' },
    ],
    asciiBanner: `██╗  ██╗ █████╗ ███╗   ███╗███████╗██████╗  ██████╗ ███╗   ██╗
██║ ██╔╝██╔══██╗████╗ ████║██╔════╝██╔══██╗██╔═══██╗████╗  ██║
████╔╝ ███████║██╔████╔██║█████╗  ██████╔╝██║   ██║██╔██╗ ██║
██╔═██╗ ██╔══██║██║╚██╔╝██║██╔══╝  ██╔══██╗██║   ██║██║╚██╗██║
██║  ██╗██║  ██║██║ ╚═╝ ██║███████╗██║  ██║╚██████╔╝██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
                                                           
 ██████╗ ██████╗ ███╗   ███╗███████╗██████╗                    
██╔════╝██╔═══██╗████╗ ████║██╔════╝██╔══██╗                  
██║     ██║   ██║██╔████╔██║█████╗  ██████╔╝                  
██║     ██║   ██║██║╚██╔╝██║██╔══╝  ██╔══██╗                  
╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗██║  ██║                  
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝`,
    aboutContent: [
      '',
      'Full-Stack Developer | Austin, TX',
      '',
      'Type "help" for commands or scroll down to explore.',
      '',
      '↓ Scroll to explore',
    ],
  },
};
