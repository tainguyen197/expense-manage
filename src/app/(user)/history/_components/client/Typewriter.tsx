import React, { useState, useEffect } from "react";

interface TypewriterProps {
  texts: string[];
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({ texts, className = "" }) => {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (typing) {
      if (displayedText.length < texts[index].length) {
        timer = setTimeout(() => {
          setDisplayedText(texts[index].substring(0, displayedText.length + 1));
        }, 100);
      } else {
        timer = setTimeout(() => {
          setTyping(false);
        }, 500);
      }
    } else {
      timer = setTimeout(() => {
        setDisplayedText("");
        setTyping(true);
        setIndex((prev) => (prev + 1) % texts.length);
      }, 50);
    }
    return () => clearTimeout(timer);
  }, [displayedText, typing, index, texts]);

  return <span className={className}>✨ {displayedText}</span>;
};

export default Typewriter;
