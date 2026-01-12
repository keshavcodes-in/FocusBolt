"use client";

import { useEffect, useRef, useState } from "react";

type Quote = {
  text: string;
};

const STORAGE_KEY = "focusbolt_custom_quote";
const DEFAULT_QUOTE: Quote = {
  text: "Believe you can and you're halfway there",
};

const MAX_CHARS = 80;

export function SessionQuote({ currentTheme }: { currentTheme: any }) {
  const [quote, setQuote] = useState<Quote>(DEFAULT_QUOTE);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(DEFAULT_QUOTE.text);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const isImageTheme = currentTheme.backgroundImage;

  // load saved quote (if any)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.text === "string") {
        setQuote(parsed);
        setDraft(parsed.text);
      }
    } catch {
      // ignore
    }
  }, []);

  // auto-focus when editing
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  function handleStartEdit() {
    setDraft(quote.text);
    setError(null);
    setIsEditing(true);
  }

  function saveDraft() {
    const text = draft.trim();

    if (!text) {
      setError("Quote cannot be empty.");
      return;
    }

    const newQuote: Quote = { text };

    setIsVisible(false);
    setTimeout(() => {
      setQuote(newQuote);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newQuote));
      }
      setIsVisible(true);
      setIsEditing(false);
      setError(null);
    }, 150);
  }

  function handleBlur() {
    if (!isEditing) return;
    saveDraft();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveDraft();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setDraft(quote.text);
      setError(null);
    }
  }

return (
  <div
    className="group mt-2 mb-4 w-full max-w-lg mx-auto py-2 px-10 text-center transition-all duration-500 relative min-h-[60px] flex items-center justify-center"
    style={{
      
      color: isImageTheme ? "#ffffff" : currentTheme.digitColor,
      
    
      background: isImageTheme ? "transparent" : `${currentTheme.background}`,
      border: isImageTheme ? "none" : "none", 
      
      
      backdropFilter: isImageTheme ? "none" : "none",
    }}
  >
    <button
      type="button"
      onClick={handleStartEdit}
      className="absolute top-0 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
      aria-label="Edit quote"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: isImageTheme ? "rgba(255,255,255,0.6)" : currentTheme.digitColor }}>
        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
      </svg>
    </button>

    <div className={`transition-opacity duration-300 w-full ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="mx-auto w-full flex flex-col items-center">
        {isEditing ? (
          <input
            ref={inputRef}
            className="w-full bg-transparent border-b border-white/30 text-lg md:text-xl font-medium italic text-center outline-none"
            value={draft}
            maxLength={MAX_CHARS}
            style={{ color: isImageTheme ? "#ffffff" : currentTheme.digitColor }}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <p 
            className="text-lg md:text-xl font-semibold italic leading-relaxed px-5"
            style={{ 
            
              textShadow: isImageTheme 
                ? "0px 2px 12px rgba(0, 0, 0, 0.9), 0px 1px 3px rgba(0, 0, 0, 1)" 
                : "none" 
            }}
          >
            &ldquo;{quote.text}&rdquo;
          </p>
        )}
      </div>
    </div>
  </div>
);
}
