import React from "react";
import { ColorTheme } from "@/lib/theme";
import { color } from "motion/react";
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
}: MusicBarProps) {
  const isImageTheme = !!currentTheme.backgroundImage;
  const iconColor = isImageTheme ? "#ffffff" : currentTheme.digitColor;
  const color = getColor(currentTheme, isImageTheme);
  const handlePlayAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentTrack) onSelectFirstTrack();
    else onPlayPause();
  };

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
                style={{
                  color: iconColor,
                  animationDuration: "1s",
                }}
              ></span>
              <span
                className="w-1 h-5 bg-current rounded-full animate-bounce"
                style={{
                  color: iconColor,
                  animationDuration: "1.2s",
                }}
              ></span>
              <span
                className="w-1 h-3 bg-current rounded-full animate-bounce"
                style={{
                  color: iconColor,
                  animationDuration: "0.8s",
                }}
              ></span>
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
