"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  animateOnMount?: boolean;
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export default function AnimatedText({
  text,
  className,
  delay = 0,
  animateOnMount = true,
}: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (char === " " || char === "\n") return char;
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsAnimating(false);
      }

      iteration += 1 / 3;
    }, 30);
  }, [text]);

  useEffect(() => {
    if (animateOnMount) {
      const timeout = setTimeout(startAnimation, delay);
      return () => clearTimeout(timeout);
    }
  }, [animateOnMount, delay, startAnimation]);

  return (
    <span className={className}>
      {displayText || (animateOnMount ? "" : text)}
    </span>
  );
}
