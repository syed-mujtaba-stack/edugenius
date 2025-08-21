"use client";
import React, { useEffect, useMemo, useState } from "react";

type Props = {
  words: string[];
  typingSpeed?: number; // ms per char
  deletingSpeed?: number; // ms per char
  pauseBetweenWords?: number; // ms
  className?: string;
};

export default function Typewriter({
  words,
  typingSpeed = 60,
  deletingSpeed = 40,
  pauseBetweenWords = 1200,
  className,
}: Props) {
  const safeWords = useMemo(() => words.filter(Boolean), [words]);
  const [wordIndex, setWordIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (safeWords.length === 0) return;

    if (!deleting && subIndex === safeWords[wordIndex].length) {
      const t = setTimeout(() => setDeleting(true), pauseBetweenWords);
      return () => clearTimeout(t);
    }

    if (deleting && subIndex === 0) {
      setDeleting(false);
      setWordIndex((prev) => (prev + 1) % safeWords.length);
      return;
    }

    const interval = setInterval(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? deletingSpeed : typingSpeed);

    return () => clearInterval(interval);
  }, [deleting, subIndex, wordIndex, safeWords, typingSpeed, deletingSpeed, pauseBetweenWords]);

  const text = safeWords.length ? safeWords[wordIndex].slice(0, subIndex) : "";

  return (
    <span className={className} aria-live="polite" suppressHydrationWarning>
      {text}
      <span className="inline-block w-[1ch] animate-pulse">|</span>
    </span>
  );
}
