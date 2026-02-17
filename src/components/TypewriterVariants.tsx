import { useEffect, useState } from 'react';
import Typewriter from './Typewriter';

interface TerminalPromptProps {
  lines: string[];
  speed?: number;
  delayBetween?: number;
  className?: string;
}

export function TerminalPrompt({
  lines,
  speed = 50,
  delayBetween = 300,
  className = '',
}: TerminalPromptProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [allComplete, setAllComplete] = useState(false);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const handleLineComplete = () => {
    if (currentLine < lines.length - 1) {
      setTimeout(() => {
        setCurrentLine((prev) => prev + 1);
      }, delayBetween);
    } else {
      setAllComplete(true);
    }
  };

  return (
    <div className={`font-mono ${className}`}>
      {lines.map((line, index) => (
        <div key={index} className="mb-1">
          {index <= currentLine ? (
            <>
              <span className="text-primary dark:text-primary-dark">› </span>
              {index === currentLine && !allComplete ? (
                <Typewriter
                  text={line}
                  speed={speed}
                  onComplete={handleLineComplete}
                />
              ) : (
                <span>
                  {line}
                  {index === currentLine && (
                    <span className="animate-pulse">
                      {showCursor ? '█' : ' '}
                    </span>
                  )}
                </span>
              )}
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}

interface TypewriterWithDeleteProps {
  variations: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function TypewriterWithDelete({
  variations,
  speed = 50,
  deleteSpeed = 30,
  pauseDuration = 2000,
  className = '',
}: TypewriterWithDeleteProps) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const currentWord = variations[currentIndex];

    if (!isDeleting) {
      if (currentText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deleteSpeed);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % variations.length);
        }, 0);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentText, isDeleting, variations, speed, deleteSpeed, pauseDuration, currentIndex]);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">{showCursor ? '█' : ' '}</span>
    </span>
  );
}

interface StaggeredLinesProps {
  lines: string[];
  speed?: number;
  delayBetween?: number;
  className?: string;
}

export function StaggeredLines({
  lines,
  speed = 40,
  delayBetween = 500,
  className = '',
}: StaggeredLinesProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];

    if (currentText.length < currentLine.length) {
      const timeout = setTimeout(() => {
        setCurrentText(currentLine.slice(0, currentText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => [...prev, currentLineIndex]);
        setCurrentText('');
        setCurrentLineIndex((prev) => prev + 1);
      }, delayBetween);
      return () => clearTimeout(timeout);
    }
  }, [currentText, currentLineIndex, lines, speed, delayBetween]);

  return (
    <div className={`${className}`}>
      {visibleLines.map((lineIndex) => (
        <div key={lineIndex} className="mb-1">
          {lines[lineIndex]}
        </div>
      ))}
      {currentLineIndex < lines.length && (
        <div className="mb-1">
          {currentText}
          <span className="animate-pulse">{showCursor ? '█' : ' '}</span>
        </div>
      )}
    </div>
  );
}

interface InfiniteTypewriterProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function InfiniteTypewriter({
  texts,
  speed = 50,
  deleteSpeed = 30,
  pauseDuration = 2000,
  className = '',
}: InfiniteTypewriterProps) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const currentText_ = texts[currentIndex];

    if (!isDeleting) {
      if (currentText.length < currentText_.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText_.slice(0, currentText.length + 1));
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deleteSpeed);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }, 0);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentText, isDeleting, texts, speed, deleteSpeed, pauseDuration, currentIndex]);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">{showCursor ? '█' : ' '}</span>
    </span>
  );
}
