import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import mermaid from 'mermaid';
import { useGithubRepos } from '../hooks';
import { fetchGithubReadme } from '../services/github';
import Modal from './ui/Modal';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
});

interface GithubProjectsProps {
  username?: string;
}

type ViewMode = 'grid' | 'carousel';

const REPO_BLACKLIST = ['syntaxDuck'];

const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Scala: '#c22d40',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Dart: '#00B4AB',
  Lua: '#000080',
};

const getLanguageColor = (language: string | null): string => {
  if (!language) return '#666666';
  return languageColors[language] || '#666666';
};

const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
};

const MermaidDiagram = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.render(`mermaid-${Date.now()}`, chart).then(({ svg }) => {
        ref.current!.innerHTML = svg;
      });
    }
  }, [chart]);

  return <div ref={ref} className="my-4 flex justify-center" />;
};

const isMermaidChart = (code: string): boolean => {
  const trimmed = code.trim();
  return (
    trimmed.startsWith('graph ') ||
    trimmed.startsWith('flowchart ') ||
    trimmed.startsWith('sequenceDiagram') ||
    trimmed.startsWith('classDiagram') ||
    trimmed.startsWith('stateDiagram') ||
    trimmed.startsWith('erDiagram') ||
    trimmed.startsWith('pie') ||
    trimmed.startsWith('gantt') ||
    trimmed.startsWith('gitGraph')
  );
};

const GithubProjects: React.FC<GithubProjectsProps> = ({ username }) => {
  const { repos: fetchedRepos, loading, error } = useGithubRepos({ username });
  const githubUsername = username || import.meta.env.VITE_GITHUB_USERNAME || '';
  const repos = fetchedRepos.filter(repo => !REPO_BLACKLIST.includes(repo.name));
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const [selectedRepo, setSelectedRepo] = useState<typeof repos[0] | null>(null);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [loadingReadme, setLoadingReadme] = useState(false);
  const [readmeError, setReadmeError] = useState<string | null>(null);

  const totalSlides = useMemo(
    () => Math.max(1, Math.ceil(repos.length / visibleCount)),
    [repos.length, visibleCount]
  );

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-scroll
  useEffect(() => {
    if (viewMode !== 'carousel' || !isAutoPlaying || isPaused || repos.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [viewMode, isAutoPlaying, isPaused, repos.length, totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    if (viewMode !== 'carousel') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleNext, handlePrev]);

  useEffect(() => {
    const handleResize = () => {
      const count = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
      setVisibleCount(viewMode === 'carousel' ? count : 6);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Reset current slide when visibleCount changes
  useEffect(() => {
    setCurrent(0);
  }, [visibleCount]);

  // Fetch README when repo is selected
  useEffect(() => {
    if (!selectedRepo) {
      setReadmeContent(null);
      setReadmeError(null);
      return;
    }

    const fetchReadme = async () => {
      setLoadingReadme(true);
      setReadmeError(null);
      try {
        const content = await fetchGithubReadme(githubUsername, selectedRepo.name);
        if (content) {
          setReadmeContent(content);
        } else {
          setReadmeError('No README found for this project.');
        }
      } catch {
        setReadmeError('Failed to load README.');
      } finally {
        setLoadingReadme(false);
      }
    };

    fetchReadme();
  }, [selectedRepo, githubUsername]);

  const handleOpenModal = (repo: typeof repos[0]) => {
    setSelectedRepo(repo);
  };

  const handleCloseModal = () => {
    setSelectedRepo(null);
    setReadmeContent(null);
    setReadmeError(null);
  };

  const getCarouselRepos = () => {
    const start = current * visibleCount;
    return repos.slice(start, start + visibleCount);
  };

  const carouselRepos = getCarouselRepos();

  const cardVariants = {
    center: { opacity: 1, scale: 1 },
  };

  if (loading) return (
    <div className="text-center py-12 text-muted dark:text-muted-dark">
      Loading GitHub projects...
    </div>
  );

  if (error) return (
    <div className="text-center py-12 text-danger dark:text-danger">
      {error}
    </div>
  );

  const renderProjectCard = (repo: typeof repos[0], key: string | number) => {
    return (
      <motion.div
        key={key}
        variants={cardVariants}
        className="bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted p-4 flex flex-col justify-between hover:border-primary dark:hover:border-primary-dark transition-colors group cursor-pointer"
        onClick={() => handleOpenModal(repo)}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm md:text-base font-semibold text-primary dark:text-primary-dark truncate group-hover:text-primary/80 dark:group-hover:text-primary-dark/80 transition-colors">
              {repo.name}
            </h3>
            {repo.language && (
              <div className="flex items-center gap-1.5 text-xs text-muted dark:text-muted-dark">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                />
                <span className="font-mono">{repo.language}</span>
              </div>
            )}
          </div>
          <p className="text-xs md:text-sm text-muted dark:text-muted-dark mb-3 line-clamp-2">
            {repo.description || 'No description provided.'}
          </p>
          
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {repo.topics.slice(0, 4).map((topic) => (
                <span 
                  key={topic}
                  className="text-[10px] px-1.5 py-0.5 bg-bg dark:bg-bg-dark border border-borderMuted dark:border-borderMuted text-muted dark:text-muted-dark font-mono"
                >
                  {topic}
                </span>
              ))}
              {repo.topics.length > 4 && (
                <span className="text-[10px] text-muted dark:text-muted-dark">
                  +{repo.topics.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 text-xs text-muted dark:text-muted-dark font-mono pt-2 border-t border-borderMuted dark:border-borderMuted">
          <span>★ {repo.stargazers_count}</span>
          <span>⑂ {repo.forks_count}</span>
          <span className="ml-auto">{getRelativeTime(repo.updated_at)}</span>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-primary-dark border-l-4 border-primary dark:border-primary-dark pl-4">
          Projects
        </h2>
        <div className="flex gap-1 bg-bg dark:bg-bg-dark border border-borderMuted dark:border-borderMuted p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 text-xs font-mono transition-colors ${
              viewMode === 'grid' 
                ? 'bg-primary dark:bg-primary-dark text-white dark:text-bg-dark' 
                : 'text-muted dark:text-muted-dark hover:text-text dark:hover:text-text-dark'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('carousel')}
            className={`px-3 py-1 text-xs font-mono transition-colors ${
              viewMode === 'carousel' 
                ? 'bg-primary dark:bg-primary-dark text-white dark:text-bg-dark' 
                : 'text-muted dark:text-muted-dark hover:text-text dark:hover:text-text-dark'
            }`}
          >
            Carousel
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo) => renderProjectCard(repo, repo.id))}
        </div>
      ) : (
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative flex items-center justify-center gap-2 md:gap-4 min-h-[280px]">
            <button
              onClick={handlePrev}
              className="z-20 w-10 h-10 bg-gradient-primary dark:bg-gradient-primary-dark text-white dark:text-bg-dark text-lg flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
              aria-label="Previous project"
            >
              ←
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex gap-2 md:gap-4 justify-center items-stretch flex-1 max-w-5xl"
              >
                {carouselRepos.map((repo, idx) => renderProjectCard(repo, `${repo.id}-${current}-${idx}`))}
              </motion.div>
            </AnimatePresence>

            <button
              onClick={handleNext}
              className="z-20 w-10 h-10 bg-gradient-primary dark:bg-gradient-primary-dark text-white dark:text-bg-dark text-lg flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
              aria-label="Next project"
            >
              →
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 transition-colors ${
                  idx === current 
                    ? 'bg-primary dark:bg-primary-dark' 
                    : 'bg-borderMuted dark:bg-borderMuted hover:bg-muted dark:hover:bg-muted-dark'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-[10px] text-muted dark:text-muted-dark hover:text-text dark:hover:text-text-dark font-mono transition-colors"
            >
              {isAutoPlaying ? '■ Auto' : '▶ Auto'}
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!selectedRepo}
        onClose={handleCloseModal}
        title={selectedRepo?.name || ''}
      >
        {selectedRepo && (
          <div>
            <a
              href={selectedRepo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-4 text-sm text-primary dark:text-primary-dark hover:underline font-mono"
            >
              → View on GitHub
            </a>

            {loadingReadme && (
              <div className="text-center py-8 text-muted dark:text-muted-dark font-mono">
                Loading README...
              </div>
            )}

            {readmeError && (
              <div className="text-center py-8 text-muted dark:text-muted-dark font-mono">
                {readmeError}
              </div>
            )}

            {readmeContent && (
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const match = /language-(\w+)/.exec(className || '');
                    const code = String(children).replace(/\n$/, '');
                    const inline = !match;

                    if (!inline && isMermaidChart(code)) {
                      return <MermaidDiagram chart={code} />;
                    }

                    return !inline ? (
                      <SyntaxHighlighter
                        language={match?.[1]}
                        PreTag="div"
                        className="!rounded-none !border !border-borderMuted !bg-bg dark:!bg-bg-dark text-sm"
                        style={{}}
                      >
                        {code}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="!bg-bg dark:!bg-bg-dark !px-1 !py-0.5 !border !border-borderMuted" {...props}>
                        {children}
                      </code>
                    );
                  },

                  img({ src, alt, ...props }) {
                    if (!src || src.startsWith('http')) {
                      return <img src={src} alt={alt} {...props} className="max-w-full my-4" />;
                    }

                    const cleanPath = src.replace(/^\.\//, '');
                    const branch = selectedRepo?.default_branch || 'main';
                    const rawUrl = `https://raw.githubusercontent.com/${githubUsername}/${selectedRepo?.name}/${branch}/${cleanPath}`;

                    return <img src={rawUrl} alt={alt} {...props} className="max-w-full my-4" />;
                  },

                  p({ children }) {
                    return <p className="mb-4">{children}</p>;
                  },

                  h1({ children }) {
                    return <h1 className="text-2xl font-bold mb-4 pb-2 border-b border-borderMuted">{children}</h1>;
                  },

                  h2({ children }) {
                    return <h2 className="text-xl font-bold mb-3 pb-2 border-b border-borderMuted">{children}</h2>;
                  },

                  h3({ children }) {
                    return <h3 className="text-lg font-bold mb-2">{children}</h3>;
                  },

                  ul({ children }) {
                    return <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>;
                  },

                  ol({ children }) {
                    return <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>;
                  },

                  li({ children }) {
                    return <li className="mb-1">{children}</li>;
                  },

                  a({ href, children }) {
                    return <a href={href} className="text-primary dark:text-primary-dark underline hover:no-underline">{children}</a>;
                  },

                  blockquote({ children }) {
                    return <blockquote className="border-l-4 border-borderMuted pl-4 my-4 italic text-muted dark:text-muted-dark">{children}</blockquote>;
                  },

                  table({ children }) {
                    return <table className="w-full border-collapse border border-borderMuted my-4">{children}</table>;
                  },

                  th({ children }) {
                    return <th className="border border-borderMuted px-2 py-1 bg-bg dark:bg-bg-dark">{children}</th>;
                  },

                  td({ children }) {
                    return <td className="border border-borderMuted px-2 py-1">{children}</td>;
                  },
                }}
              >
                {readmeContent}
              </ReactMarkdown>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
};

export default GithubProjects;
