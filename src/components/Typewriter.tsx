import { useEffect, useState, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  cursor?: 'block' | 'underscore';
  onComplete?: () => void;
  className?: string;
}

function Typewriter({
  text,
  speed = 50,
  cursor = 'block',
  onComplete,
  className = '',
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isComplete, onComplete]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const cursorChar = cursor === 'block' ? '█' : '_';

  return (
    <span className={className} key={text}>
      {displayedText}
      <span className="animate-pulse">{showCursor ? cursorChar : ' '}</span>
    </span>
  );
}

export default Typewriter;
