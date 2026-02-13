# Agent Guidelines for Portfolio Project

## Build, Lint, and Test Commands

```bash
# Development
npm run dev              # Start Vite dev server (port 3000, auto-increments if in use)

# Build
npm run build            # TypeScript check (tsc -b) + Vite production build
npm run preview          # Preview production build locally

# Linting
npm run lint             # Run ESLint on entire project
npm run lint -- --fix   # Auto-fix linting issues
```

### Running Single Tests
This project uses Vite's built-in testing. No test framework is currently configured. When adding tests:

```bash
# If using Vitest
npm run test -- run <file>     # Run single test file

# If using Jest
npm test -- <file>             # Run single test file
```

---

## Code Style Guidelines

### General Principles
- Use TypeScript for all new code (`.ts`/`.tsx` files)
- Prefer functional components with hooks over class components
- Keep components small and focused (single responsibility)
- Use meaningful, descriptive names

### File Organization
```
src/
├── components/       # React components
├── pages/           # Route page components
├── hooks/           # Custom React hooks
├── services/        # API/services
├── types/           # TypeScript type definitions
└── index.css       # Global styles (Tailwind)
```

### Imports

**Order (top to bottom):**
1. React imports (`import React from 'react'`)
2. External libraries (`import { motion } from 'framer-motion'`)
3. Internal modules (`import useTheme from '../hooks/useTheme'`)
4. Type imports (`import { GithubRepo } from '../types'`)

```typescript
// Correct
import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { GithubRepo } from '../types';

// Components can omit React import in .tsx (JSX transform)
```

### TypeScript Conventions

**Interfaces over Types for object shapes:**
```typescript
// Preferred
interface ProjectProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

// Type for unions/primitives
type Theme = 'light' | 'dark';
```

**Use explicit return types for hooks:**
```typescript
function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');
  // ...
  return { theme, toggleTheme };
}
```

**Use `FC` for typed components (optional but consistent):**
```typescript
const ThemeToggle: React.FC = () => { ... };
// or shorthand (preferred in this codebase)
function ThemeToggle() { ... }
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ThemeToggle`, `ProjectCard` |
| Hooks | camelCase, `use` prefix | `useTheme`, `useGithubRepos` |
| Interfaces | PascalCase | `GithubRepo`, `CommitWeek` |
| Files | kebab-case | `use-theme.ts`, `project-card.tsx` |
| CSS Classes | kebab-case (Tailwind) | `bg-bg2-dark`, `text-primary` |

### React Component Patterns

**Component structure:**
```typescript
import React from 'react';
import { motion } from 'framer-motion';

interface ComponentNameProps {
  // props
}

const ComponentName: React.FC<ComponentNameProps> = ({ prop1, prop2 }) => {
  // hooks first
  const [state, setState] = useState<string>('');

  // handlers
  const handleClick = () => { ... };

  // render
  return (
    <motion.div>
      {/* JSX */}
    </motion.div>
  );
};

export default ComponentName;
```

**Custom hooks:** Return an object, not an array (for named destructuring):
```typescript
// Preferred
return { theme, toggleTheme };

// Avoid (unless tuple is needed)
return [theme, setTheme];
```

### Tailwind CSS Guidelines

**Color palette:** Use custom colors defined in `tailwind.config.cjs`:
- Backgrounds: `bg`, `bg2`, `bg3`
- Text: `text`, `text-dark`, `muted`, `muted-dark`
- Accent: `primary`, `primary-dark`, `secondary`, `secondary-dark`

**Dark mode:** Use the `-dark` suffix for dark mode variants:
```jsx
// Correct
className="bg-bg dark:bg-bg-dark"
className="text-primary dark:text-primary-dark"

// Wrong (uses light color in dark mode)
className="bg-bg dark:bg-bg"
```

**Gradients:** Use predefined gradient utilities:
- `bg-gradient-primary` / `bg-gradient-primary-dark`
- `bg-gradient-accent` / `bg-gradient-accent-dark`
- `bg-gradient-bg` / `bg-gradient-bg-dark`

**Consistent patterns:**
- Primary buttons: `bg-gradient-primary dark:bg-gradient-primary-dark`
- Secondary buttons: `border-primary dark:border-primary-dark`
- Cards: `bg-bg2 dark:bg-bg2-dark border border-borderMuted`

### Design Aesthetic: Industrial & Technical

This portfolio should have an **industrial, technical look** inspired by sites like opencode.ai. Key principles:

**Straight lines everywhere:**
- Use sharp borders and edges - avoid rounded corners (`rounded-none` or `rounded-sm` max)
- Use `border` utilities with clear, defined edges
- Grid-based layouts with visible structure
- Geometric shapes, no excessive curves

**Technical/terminal aesthetic:**
- Monospace fonts for code and technical elements
- High contrast between elements
- Visible structural lines (`border`, `divide-y`, `grid`)
- Minimal decoration, functional over decorative
- Terminal/console inspired color schemes

**Examples:**
```jsx
// Instead of rounded cards
className="border border-borderMuted"  // sharp edges

// Instead of soft shadows
className="border-b border-border"  // visible lines

// Grid layouts with clear separation
className="grid divide-x divide-borderMuted"

// Minimal, functional buttons
className="border border-primary px-4 py-2"
```

**Avoid:**
- Excessive `rounded-lg`, `rounded-xl`, `rounded-full`
- Soft, diffused shadows
- Gradients on everything (use sparingly for emphasis)
- Decorative animations (keep functional)

**Embrace:**
- Sharp corners (`rounded-sm` or `rounded-none`)
- Clear borders and dividers
- Grid/flexbox layouts with visible structure
- Terminal-inspired aesthetics
- Minimal, functional design

### Error Handling

**API errors:** Display user-friendly messages, log details to console:
```typescript
if (error) {
  return (
    <div className="text-center py-12 text-danger">
      {error}
    </div>
  );
}
```

**Try/catch with error boundaries:**
```typescript
try {
  const data = await fetchData();
} catch (err) {
  console.error('Failed to fetch:', err);
  // Handle gracefully
}
```

**Type safety:** Never use `any`. Use `unknown` when type is uncertain, then narrow:
```typescript
// Avoid
function handler(data: any) { ... }

// Prefer
function handler(data: unknown) {
  if (isRepo(data)) { ... }
}
```

### Formatting

- Use 2 spaces for indentation
- No semicolons at end of statements
- Use single quotes for strings in JSX, double quotes elsewhere
- Trailing commas in objects/arrays
- Maximum line length: 100 characters (soft limit)

### Git Conventions

- Commit messages: Present tense, imperative mood
- Example: `"Add dark mode toggle"` not `"Added dark mode toggle"`
- Branch naming: `feature/description` or `fix/description`
- Run `npm run lint` before committing
- Run `npm run build` to verify type checking passes

---

## Environment Variables

Create a `.env` file (do NOT commit):
```
VITE_GITHUB_USERNAME=your-username
VITE_LINKEDIN_USERNAME=your-username
```

Access in code:
```typescript
import.meta.env.VITE_GITHUB_USERNAME
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Start dev | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Add component | Create `src/components/Name.tsx` |
| Add hook | Create `src/hooks/useName.ts` |
| Add type | Add to `src/types/index.ts` |
