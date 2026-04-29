import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  [key: string]: any;
}

const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  ...props
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    let interval: any;
    let currentIteration = 0;

    const decrypt = () => {
      interval = setInterval(() => {
        setDisplayText((prevText) =>
          text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (currentIteration >= maxIterations) return char;

              if (sequential) {
                if (currentIteration > index) return char;
              }

              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join('')
        );

        currentIteration++;

        if (currentIteration > maxIterations) {
          clearInterval(interval);
        }
      }, speed);
    };

    if (isRevealing || isHovering) {
      decrypt();
    } else {
      setDisplayText(text);
    }

    return () => clearInterval(interval);
  }, [text, speed, maxIterations, isHovering, isRevealing, sequential, characters]);

  return (
    <motion.span
      className={parentClassName}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onViewportEnter={() => setIsRevealing(true)}
      {...props}
    >
      <span className={`${className} inline-block min-w-max`}>{displayText}</span>
    </motion.span>
  );
};

export default DecryptedText;
