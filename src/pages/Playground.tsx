import { useState } from 'react';
import Typewriter from '../components/Typewriter';
import { TerminalPrompt, TypewriterWithDelete, StaggeredLines, InfiniteTypewriter } from '../components/TypewriterVariants';

type Speed = 'slow' | 'normal' | 'fast';

const speedMap = {
  slow: 100,
  normal: 50,
  fast: 20,
};

function Playground() {
  const [selectedSpeed, setSelectedSpeed] = useState<Speed>('normal');
  const [selectedCursor, setSelectedCursor] = useState<'block' | 'underscore'>('block');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary dark:text-primary-dark mb-8 border-l-4 border-primary dark:border-primary-dark pl-4">
        Typing Animation Playground
      </h1>

      {/* Controls */}
      <div className="mb-8 p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted">
        <h2 className="text-lg font-semibold mb-4">Controls</h2>
        <div className="flex flex-wrap gap-6">
          <div>
            <span className="block text-sm mb-2">Speed:</span>
            <div className="flex gap-2">
              {(['slow', 'normal', 'fast'] as Speed[]).map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSelectedSpeed(speed)}
                  className={`px-3 py-1 text-sm border ${
                    selectedSpeed === speed
                      ? 'border-primary dark:border-primary-dark bg-primary/10 dark:bg-primary-dark/10'
                      : 'border-borderMuted dark:border-borderMuted'
                  }`}
                >
                  {speed.charAt(0).toUpperCase() + speed.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-sm mb-2">Cursor:</span>
            <div className="flex gap-2">
              {(['block', 'underscore'] as const).map((cursor) => (
                <button
                  key={cursor}
                  onClick={() => setSelectedCursor(cursor)}
                  className={`px-3 py-1 text-sm border ${
                    selectedCursor === cursor
                      ? 'border-primary dark:border-primary-dark bg-primary/10 dark:bg-primary-dark/10'
                      : 'border-borderMuted dark:border-borderMuted'
                  }`}
                >
                  {cursor === 'block' ? '█' : '_'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Basic Typewriter */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-l-4 border-primary dark:border-primary-dark pl-4">
          Basic Typewriter
        </h2>
        <div className="p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted">
          <Typewriter
            text="Hi, I'm Kameron Comer"
            speed={speedMap[selectedSpeed]}
            cursor={selectedCursor}
            className="text-xl"
          />
        </div>
      </section>

      {/* Terminal Prompt */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-l-4 border-primary dark:border-primary-dark pl-4">
          Terminal Prompt
        </h2>
        <div className="p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted">
          <TerminalPrompt
            lines={[
              'Initializing...',
              'Loading modules...',
              'Connecting to database...',
              'System ready.',
            ]}
            speed={speedMap[selectedSpeed]}
          />
        </div>
      </section>

      {/* With Delete Effect */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-l-4 border-primary dark:border-primary-dark pl-4">
          With Delete Effect
        </h2>
        <div className="p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted">
          <TypewriterWithDelete
            variations={[
              'Building awesome...',
              'Creating amazing...',
              'Developing cool...',
              'Coding fantastic...',
            ]}
            speed={speedMap[selectedSpeed]}
            pauseDuration={1500}
          />
        </div>
      </section>

      {/* Staggered Lines */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-l-4 border-primary dark:border-primary-dark pl-4">
          Staggered Lines
        </h2>
        <div className="p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted">
          <StaggeredLines
            lines={[
              'const developer = "Kameron Comer";',
              'const skills = ["React", "Node", "TypeScript"];',
              'const location = "San Francisco, CA";',
              'console.log("Hello, World!");',
            ]}
            speed={speedMap[selectedSpeed]}
          />
        </div>
      </section>

      {/* Infinite Loop */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-l-4 border-primary dark:border-primary-dark pl-4">
          Infinite Loop
        </h2>
        <div className="p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted">
          <InfiniteTypewriter
            texts={[
              'Welcome to my portfolio',
              'Check out my projects',
              'Read my blog posts',
              'Get in touch',
            ]}
            speed={speedMap[selectedSpeed]}
            pauseDuration={2000}
          />
        </div>
      </section>

      {/* Code Style */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-l-4 border-primary dark:border-primary-dark pl-4">
          Code Style
        </h2>
        <div className="p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted">
          <Typewriter
            text='const name = "Kameron Comer";'
            speed={speedMap[selectedSpeed]}
            cursor={selectedCursor}
            className="text-lg"
          />
        </div>
      </section>

      {/* Speed Comparison */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-l-4 border-primary dark:border-primary-dark pl-4">
          Speed Comparison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted">
            <span className="text-sm text-muted dark:text-muted-dark mb-2 block">Slow (100ms)</span>
            <Typewriter text="Fast typist" speed={100} cursor={selectedCursor} />
          </div>
          <div className="p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted">
            <span className="text-sm text-muted dark:text-muted-dark mb-2 block">Normal (50ms)</span>
            <Typewriter text="Fast typist" speed={50} cursor={selectedCursor} />
          </div>
          <div className="p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted">
            <span className="text-sm text-muted dark:text-muted-dark mb-2 block">Fast (20ms)</span>
            <Typewriter text="Fast typist" speed={20} cursor={selectedCursor} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Playground;
