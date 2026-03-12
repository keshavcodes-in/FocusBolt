import React from "react";
import { ColorTheme } from "@/lib/theme";
import { getColor } from "@/lib/colorUtils";

interface MusicBarProps {
  currentTrack: { title: string; artist?: string } | null;
  isPlaying: boolean;
  isBuffering: boolean;
  error: string | null;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentTime: number;
  duration: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  currentTheme: ColorTheme;
  onSelectFirstTrack: () => void;
  onSeek: (time: number) => void;
  vertical?: boolean;
}

export function MusicBar({
  currentTrack,
  isPlaying,
  isBuffering,
  error,
  onPlayPause,
  onNext,
  onPrevious,
  currentTime,
  duration,
  isExpanded,
  onToggleExpand,
  currentTheme,
  onSelectFirstTrack,
  onSeek,
  vertical = false,
}: MusicBarProps) {
  const isImageTheme = !!currentTheme.backgroundImage;
  const iconColor = isImageTheme ? "#ffffff" : currentTheme.digitColor;
  const color = getColor(currentTheme, isImageTheme);

  const handlePlayAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentTrack) onSelectFirstTrack();
    else onPlayPause();
  };
  // ── VERTICAL PILL (desktop sidebar) 
  if (vertical) {
    return (
      <div
        onClick={onToggleExpand}
        className="flex flex-col items-center gap-2.5 py-5 px-3 rounded-3xl transition-all duration-200 hover:scale-[1.02]"
        style={{
          backgroundColor: isImageTheme
            ? "rgba(255, 255, 255, 0.12)"
            : `${currentTheme.cardBorder}20`,
          color: isImageTheme ? "#ffffff" : `${currentTheme.digitColor}`,
          border: `1px solid ${currentTheme.cardBorder}`,
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
        }}
      >
        {/* Note icon / playing animation */}
        <div
          className="w-9 h-9 flex items-center justify-center rounded-md"
          style={{
            background: `${currentTheme.background}`,
            color: currentTheme.digitColor,
            border: isImageTheme
              ? `1px solid ${currentTheme.digitColor}`
              : `1px solid ${color}`,
            boxShadow: isImageTheme
              ? "2px 2px 0 0 rgba(255,255,255,0.78)"
              : `2px 2px 0 0 ${color}`,
          }}
        >
          {isPlaying && !isBuffering ? (
            <div
              className="flex items-end justify-center gap-0.5"
              style={{ height: "24px" }}
            >
              
              <span
                className="w-1 h-3 bg-current rounded-full animate-bounce"
                style={{ color: iconColor, animationDuration: "1s" }}
              />
              <span
                className="w-1 h-5 bg-current rounded-full animate-bounce"
                style={{ color: iconColor, animationDuration: "1.2s" }}
              />
              <span
                className="w-1 h-3 bg-current rounded-full animate-bounce"
                style={{ color: iconColor, animationDuration: "0.8s" }}
              />
            
            </div>
          ) : (
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          )}
        </div>

       

        {/* Prev */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 hover:scale-110 active:scale-90"
          style={{
          
            background: "transparent",
            cursor: "pointer",
          }}
          aria-label="Previous"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        {/* Play / Pause */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlayAction(e);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 hover:scale-110 active:scale-90"
          style={{
            backgroundColor: isImageTheme
              ? "rgba(255, 255, 255, 0.25)"
              : currentTheme.cardBorder,
            boxShadow: isImageTheme ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
            border: `1px solid ${isImageTheme ? "rgba(255,255,255,0.22)" : `${color}28`}`,
            cursor: "pointer",
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isBuffering ? (
            <div className="w-4 h-4 border-[1.5px] border-current border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 hover:scale-110 active:scale-90"
          style={{
            background: "transparent",
            cursor: "pointer",
          }}
          aria-label="Next"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>

        {/* Progress — only when track loaded */}
        {currentTrack && duration > 0 && (
          <>
            <div
              className="w-6 h-px rounded-full"
              style={{
                background: isImageTheme
                  ? "rgba(255,255,255,0.12)"
                  : `${currentTheme.cardBorder}60`,
              }}
            />
            <div
              className="relative rounded-full overflow-visible"
              style={{
                width: "2px",
                height: "48px",
                background: isImageTheme
                  ? "rgba(255,255,255,0.35)"
                  : `${currentTheme.digitColor}35`,
              }}
            >
              {/* filled track */}
              <div
                className="absolute top-0 left-0 w-full rounded-full transition-all duration-300 ease-linear"
                style={{
                  height: `${(currentTime / duration) * 100}%`,
                  background: isImageTheme ? "rgba(255,255,255,0.65)" : color,
                }}
              />
              {/* glowing dot */}
              <div
                className="absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-300 ease-linear"
                style={{
                  width: "7px",
                  height: "7px",
                  top: `calc(${(currentTime / duration) * 100}% - 3.5px)`,
                  background: isImageTheme ? "#fff" : color,
                  boxShadow: `0 0 5px 2px ${isImageTheme ? "rgba(255,255,255,0.35)" : `${color}55`}`,
                }}
              />
            </div>
          </>
        )}
      </div>
    );
  }
  // ── END VERTICAL ───

  // ── HORIZONTAL BAR (mobile / tablet)
  return (
    <div className="w-full flex justify-center px-4 pb-6">
      <div
        onClick={onToggleExpand}
        className="relative flex items-center gap-4 px-4 py-3 rounded-2xl border shadow-2xl transition-all duration-500 ease-out hover:scale-[1.02] cursor-pointer max-w-md w-full overflow-hidden"
        style={{
          background: isImageTheme
            ? "linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))"
            : currentTheme.background,
          borderColor: isImageTheme
            ? "rgba(255, 255, 255, 0.3)"
            : `${currentTheme.cardBorder}50`,
          backdropFilter: isImageTheme ? "blur(30px) saturate(160%)" : "none",
        }}
      >
        {/* 1. macOS Style Album Art */}
        <div
          className="relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner group overflow-hidden"
          style={{ background: `${iconColor}15` }}
        >
          {isPlaying && !isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center gap-0.5">
              <span
                className="w-1 h-3 bg-current rounded-full animate-bounce"
                style={{ color: iconColor, animationDuration: "1s" }}
              />
              <span
                className="w-1 h-5 bg-current rounded-full animate-bounce"
                style={{ color: iconColor, animationDuration: "1.2s" }}
              />
              <span
                className="w-1 h-3 bg-current rounded-full animate-bounce"
                style={{ color: iconColor, animationDuration: "0.8s" }}
              />
            </div>
          )}
          {!isPlaying && (
            <svg
              className="w-6 h-6 opacity-60"
              fill="none"
              stroke={iconColor}
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          )}
        </div>

        {/* 2. Track Meta & Error Handling */}
        <div className="flex flex-col min-w-0 flex-1">
          <span
            className="text-sm font-bold truncate leading-tight"
            style={{ color: iconColor }}
          >
            {error ? "Playback Error" : currentTrack?.title || "Not Playing"}
          </span>
          <span
            className="text-[11px] font-medium opacity-60 truncate mt-0.5"
            style={{ color: iconColor }}
          >
            {error
              ? "Try another track"
              : currentTrack?.artist || "Select music to start"}
          </span>
        </div>

        {/* 3. Minimalist macOS Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="p-2 opacity-40 hover:opacity-100 hover:bg-white/10 rounded-lg transition-all"
            style={{ color: iconColor }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            onClick={handlePlayAction}
            className="w-9 h-9 flex items-center justify-center transition-all active:scale-90"
            style={{ color: iconColor }}
          >
            {isBuffering ? (
              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            ) : isPlaying ? (
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg
                className="w-7 h-7 ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="p-2 opacity-40 hover:opacity-100 hover:bg-white/10 rounded-lg transition-all"
            style={{ color: iconColor }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* 4. macOS Style Progress "Edge" */}
        <div
          className="absolute bottom-0 left-0 w-full h-[3px] bg-black/5 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            onSeek(((e.clientX - rect.left) / rect.width) * duration);
          }}
        >
          <div
            className="h-full transition-all duration-300 ease-linear"
            style={{
              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              background: color,
              opacity: 0.8,
            }}
          />
        </div>
      </div>
    </div>
  );
}
