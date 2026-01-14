"use client";
import { useEffect, useState } from "react";
import { usePomodoro } from "@/components/timer/pomodoro-provider";
import { ColorTheme } from "@/lib/theme";
import { getColor } from "@/lib/colorUtils";
import { getThemeStyles } from "@/lib/themeStyles";

interface Props {
  currentTheme: ColorTheme;
  style?: React.CSSProperties;
}

export default function ProgressBar({ currentTheme, style }: Props) {
  const { remaining, mode } = usePomodoro();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const total = mode === "work" ? 25 * 60 : mode === "short" ? 5 * 60 : 15 * 60;
    setProgress(remaining > 0 ? Math.max(1 - remaining / total, 0) : 0);
  }, [remaining, mode]);

  const themeStyles = getThemeStyles(currentTheme);
  const isImage = themeStyles.isImage;
  
  // Refined Color Palette
  const baseColor = getColor(currentTheme, isImage);
  const glowColor = isImage ? "rgba(255, 255, 255, 0.8)" : `${baseColor}CC`;
  const trackBackground = isImage ? "rgba(255, 255, 255, 0.1)" : themeStyles.container.background;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "0px", 
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(100%, 420px)", 
        height: "12px", 
        zIndex: 10,
        ...style,
      }}
    >
      {/* The Track (Background) */}
      <div
        style={{
          height: "100%",
          background: trackBackground,
          backdropFilter: isImage ? "blur(8px)" : "none",
          WebkitBackdropFilter: isImage ? "blur(8px)" : "none",
          borderRadius: "100px", // Fully pill-shaped for a modern look
          border: isImage ? "1px solid rgba(255,255,255,0.2)" : `2px solid ${currentTheme.cardBorder}`,
          overflow: "hidden",
          boxShadow: isImage ? "0 4px 15px rgba(0,0,0,0.1)" : "none",
        }}
      >
        {/* The Progress Fill */}
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: isImage 
              ? "linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,1))" 
              : `linear-gradient(90deg, ${baseColor}, ${adjustColor(baseColor, 30)})`,
            borderRadius: "100px",
            position: "relative",
            transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)", // Bouncy, motivating transition
            boxShadow: `0 0 15px ${glowColor}`,
          }}
        >
          {/* Motivating Shimmer Sparkle */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
              animation: "shimmer 3s infinite linear",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

// Helper to keep the gradient tasteful
function adjustColor(color: string, amount: number): string {
  const hex = color.replace("#", "");
  const num = parseInt(hex.length === 3 ? hex.split('').map(s => s + s).join('') : hex, 16);
  const R = Math.min(255, Math.max(0, (num >> 16) + amount));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return "#" + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
}