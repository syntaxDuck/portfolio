---
title: Building a Type-Safe React Application
date: 2024-02-01
description: How to use TypeScript effectively in React projects
slug: typescript-react
tags: ["typescript", "react", "type-safety"]
---

# Building a Type-Safe React Application

TypeScript has become essential for building maintainable React applications. Here's what I've learned about type safety.

## Why TypeScript?

- **Catch errors early** - Before runtime
- **Better IDE support** - Autocomplete and refactoring
- **Self-documenting code** - Types as documentation
- **Confidence** - Refactor without fear

## Basic Types in React

### Component Props

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### State Types

```typescript
// Simple state
const [count, setCount] = useState<number>(0);

// Complex state
interface User {
  id: string;
  name: string;
  email: string;
}

const [user, setUser] = useState<User | null>(null);

// With reducer
type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    case 'reset': return 0;
    default: return state;
  }
}
```

## Advanced Patterns

### Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
<List 
  items={['apple', 'banana', 'cherry']} 
  item => <span>{item}</span>
/>
```

### Custom Hooks with Types

```typescript
function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
}
```

## Best Practices

1. **Avoid `any`** - Use `unknown` and narrow types
2. **Use interfaces** for object shapes
3. **Be explicit** with return types on hooks
4. **Use utility types** - `Partial`, `Required`, `Pick`, `Omit`
5. **Enable strict mode** in tsconfig.json

## Conclusion

TypeScript + React is a powerful combination. The initial learning curve is worth the long-term benefits of maintainable, type-safe code.
