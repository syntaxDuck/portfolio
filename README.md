# Portfolio

A personal portfolio website built with React, TypeScript, Vite, and Tailwind CSS. Features an industrial/technical aesthetic with interactive elements including a terminal emulator, GitHub integration, and blog capabilities.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Animation**: Framer Motion
- **Markdown**: React Markdown, React Syntax Highlighter
- **Diagrams**: Mermaid
- **HTTP**: Axios

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Navbar, Footer
│   └── *.tsx        # Feature components
├── context/         # React context providers (Terminal)
├── hooks/           # Custom React hooks
├── pages/           # Route page components
│   ├── Home.tsx
│   ├── Projects.tsx
│   ├── Blog.tsx
│   ├── About.tsx
│   ├── Playground.tsx
│   └── demos/       # Interactive demo pages
├── services/        # API services (GitHub)
├── types/           # TypeScript definitions
└── index.css        # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Runs the development server at http://localhost:3000

### Build

```bash
pnpm build
```

Runs TypeScript check and creates production build

### Preview

```bash
pnpm preview
```

Preview the production build locally

## Features

- **Dark/Light Mode**: Toggle between themes
- **GitHub Integration**: Fetch and display GitHub repositories and activity
- **Blog**: Markdown-based blog posts with syntax highlighting
- **Interactive Terminal**: Terminal emulator component for demos
- **Animated Transitions**: Smooth page transitions with Framer Motion

## Environment Variables

Create a `.env` file (do NOT commit):

```env
VITE_GITHUB_USERNAME=your-username
VITE_LINKEDIN_USERNAME=your-username
```

## Available Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with hero section |
| `/projects` | GitHub projects showcase |
| `/blog` | Blog posts |
| `/blog/:slug` | Single blog post |
| `/about` | About page with experience timeline |
| `/dev/playground` | Playground with various demos |
| `/demo/terminal` | Terminal emulator demo |
| `/demo/github-activity` | GitHub activity visualization |
| `/demo/code-playground` | Interactive code playground |
| `/demo/ascii-art` | ASCII art generator |
| `/demo/achievements` | Achievements showcase |

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
