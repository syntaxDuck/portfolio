export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  content: string;
}

function parseFrontmatter(content: string): { data: Record<string, unknown>; content: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!match) {
    return { data: {}, content };
  }

  const [, frontmatter, markdown] = match;
  const data: Record<string, unknown> = {};

  for (const line of frontmatter.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value: unknown = line.slice(colonIndex + 1).trim();

    if (typeof value === 'string') {
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      } else if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else if (/^\d+$/.test(value)) {
        value = parseInt(value, 10);
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Parse YAML array format: ["tag1", "tag2"]
        const arrayContent = value.slice(1, -1);
        value = arrayContent
          .split(',')
          .map(s => s.trim().replace(/^["']|["']$/g, ''))
          .filter(s => s.length > 0);
      }
    }

    data[key] = value;
  }

  return { data, content: markdown };
}

const postFiles = import.meta.glob('../content/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function parsePosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [filepath, content] of Object.entries(postFiles)) {
    const slug = filepath
      .split('/')
      .pop()
      ?.replace('.md', '') || '';

    const { data, content: markdown } = parseFrontmatter(content);

    posts.push({
      slug,
      title: (data.title as string) || 'Untitled',
      date: (data.date as string) || new Date().toISOString().split('T')[0],
      description: (data.description as string) || '',
      tags: (data.tags as string[]) || [],
      content: markdown,
    });
  }

  return posts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export const posts = parsePosts();

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find(post => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return posts;
}
