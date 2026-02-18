interface ParsedInput {
  args: string[];
  flags: Record<string, string>;
}

export function parseCommandInput(input: string): ParsedInput {
  const flags: Record<string, string> = {};
  const args: string[] = [];

  const tokens = input.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

  for (const token of tokens) {
    if (token.startsWith('--')) {
      const equalIndex = token.indexOf('=');
      if (equalIndex !== -1) {
        const key = token.slice(2, equalIndex);
        let value = token.slice(equalIndex + 1);
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        flags[key] = value;
      } else {
        flags[token.slice(2)] = 'true';
      }
    } else {
      args.push(token);
    }
  }

  return { args, flags };
}

export function parseHexColor(color: string): { r: number; g: number; b: number } | null {
  let hex = color.replace('#', '');
  
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  if (hex.length !== 6) {
    return null;
  }
  
  const num = parseInt(hex, 16);
  if (isNaN(num)) {
    return null;
  }
  
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}
