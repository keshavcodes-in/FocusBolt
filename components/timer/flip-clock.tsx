"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { ColorTheme } from "../../lib/theme";
import { usePomodoro } from "@/components/timer/pomodoro-provider";
import { getColor } from "@/lib/colorUtils";

type Props = {
  seconds: number;
  totalSeconds: number;
  ariaLabel?: string;
  theme: ColorTheme;
  animationDuration?: number;
};

export function FlipClock({
  seconds,
  totalSeconds,
  ariaLabel,
  theme,
  animationDuration = 600,
}: Props) {
  const { remaining, mode } = usePomodoro();
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;

  const isBreak = mode !== "work";

  const progress = useMemo(() => {
    if (!totalSeconds || totalSeconds <= 0) return 0;
    return Math.max(0, Math.min(1, 1 - remaining / totalSeconds));
  }, [remaining, totalSeconds]);

  const accentColor = getColor(theme, !!theme.backgroundImage);
  const show3DigitMinutes = mins >= 100;

  const formatTime = useCallback(
    (time: number, digits: number = 2) =>
      Math.max(0, time).toString().padStart(digits, "0"),
    []
  );

  const minStr = formatTime(mins, show3DigitMinutes ? 3 : 2);
  const secStr = formatTime(secs, 2);

  return (
    <div aria-label={ariaLabel} role="timer" className="flip-clock">
     
      {isBreak && (
        <div className="break-overlay" key={mode}>
          <div
            className="shimmer-sweep"
            style={{
              
              background: `linear-gradient(110deg, transparent 20%, ${accentColor}65 50%, transparent 80%)`,
            }}
          />
          <div
            className="glow-breath"
            style={{
              background: `radial-gradient(circle at center, ${accentColor}40 0%, transparent 85%)`,
            }}
          />
        </div>
      )}
      {/* PROGRESS RING*/}
      <div className="progress-frame">
        <svg width="100%" height="100%" className="progress-svg">
          <rect
            x="2"
            y="2"
            width="calc(100% - 4px)"
            height="calc(100% - 4px)"
            rx="26"
            fill="none"
            stroke={
              theme.backgroundImage
                ? "rgba(255,255,255,0.15)"
                : "rgba(0,0,0,0.05)"
            }
            strokeWidth="3"
          />
          <rect
            className="progress-path"
            x="2"
            y="2"
            width="calc(100% - 4px)"
            height="calc(100% - 4px)"
            rx="26"
            fill="none"
            stroke={accentColor}
            strokeWidth="4"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 - progress * 100}
            style={{
              transition: "stroke-dashoffset 1s linear",
              filter: `drop-shadow(0 0 10px ${accentColor}66)`,
            }}
          />
        </svg>
      </div>

      {show3DigitMinutes && (
        <FlipDigit
          value={minStr[0]}
          theme={theme}
          animationDuration={animationDuration}
        />
      )}
      <FlipDigit
        value={minStr[show3DigitMinutes ? 1 : 0]}
        theme={theme}
        animationDuration={animationDuration}
      />
      <FlipDigit
        value={minStr[show3DigitMinutes ? 2 : 1]}
        theme={theme}
        animationDuration={animationDuration}
      />

      <div className="separator">:</div>

      <FlipDigit
        value={secStr[0]}
        theme={theme}
        animationDuration={animationDuration}
      />
      <FlipDigit
        value={secStr[1]}
        theme={theme}
        animationDuration={animationDuration}
      />

      <style jsx>{`
        .flip-clock {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 40px;
          user-select: none;
          font-family: "SF Pro Display", sans-serif;
          font-weight: 700;
          border-radius: 28px;
          overflow: hidden;
          isolation: isolate;
        }

        .break-overlay {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .shimmer-sweep {
          position: absolute;
          inset: 0;
          width: 400%; 
          animation: sweep 2.5s linear infinite;
          will-change: transform;
        }

        @keyframes sweep {
          0% {
            transform: translateX(-100%) skewX(-25deg);
          }
          100% {
            transform: translateX(50%) skewX(-25deg);
          }
        }

        @keyframes breath {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        .progress-frame {
          position: absolute;
          
          top: 2px;
          bottom: 2px;
          left: 2px;
          right: 2px;
          pointer-events: none;
          z-index: 1;
        }

        .progress-svg {
          overflow: visible;
        }

        .separator {
          font-size: 120px;
          font-weight: 300;
          margin: 0 16px;
          line-height: 0.8;
          color: ${theme.separatorColor};
          z-index: 2;
        }

        @media (max-width: 640px) {
          .flip-clock {
            padding: 24px 12px; 
            gap: 6px;
          }
          .separator {
            font-size: 96px;
            margin: 0 4px;
          }
        }
      `}</style>
    </div>
  );
}

// FlipDigit 
function FlipDigit({
  value,
  theme,
  animationDuration = 600,
}: {
  value: string;
  theme: ColorTheme;
  animationDuration: number;
}) {
  const [currentValue, setCurrentValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const prevValue = useRef(value);
  const timeouts = useRef<NodeJS.Timeout[]>([]);
  const isAnimating = useRef(false);

  const clearAllTimeouts = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  }, []);

  const executeFlip = useCallback(
    (newValue: string) => {
      if (newValue === prevValue.current) return;
      if (isAnimating.current) {
        clearAllTimeouts();
        setCurrentValue(newValue);
        prevValue.current = newValue;
        setIsFlipping(false);
        isAnimating.current = false;
        return;
      }
      isAnimating.current = true;
      setIsFlipping(true);
      timeouts.current.push(
        setTimeout(() => setCurrentValue(newValue), animationDuration / 2)
      );
      timeouts.current.push(
        setTimeout(() => {
          setIsFlipping(false);
          prevValue.current = newValue;
          isAnimating.current = false;
        }, animationDuration)
      );
    },
    [animationDuration, clearAllTimeouts]
  );

  useEffect(() => {
    executeFlip(value);
  }, [value, executeFlip]);

  useEffect(() => {
    setCurrentValue(value);
    prevValue.current = value;
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      isAnimating.current = false;
    };
  }, [clearAllTimeouts]);

  return (
    <div className="flip-digit-container">
      <div className="digit-half top-base">
        <div className="digit-content">
          <span className="digit-text">{currentValue}</span>
        </div>
      </div>
      <div className="digit-half bottom-base">
        <div className="digit-content">
          <span className="digit-text">{currentValue}</span>
        </div>
      </div>
      {isFlipping && (
        <div className="flip-overlay">
          <div className="flip-card top-card">
            <div className="digit-content">
              <span className="digit-text">{prevValue.current}</span>
            </div>
          </div>
          <div className="flip-card bottom-card">
            <div className="digit-content">
              <span className="digit-text">{value}</span>
            </div>
          </div>
        </div>
      )}
      <div className="divider" />
      <style jsx>{`
        .flip-digit-container {
          position: relative;
          width: 100px;
          height: 140px;
          perspective: 1000px;
          flex-shrink: 0;
          z-index: 2;
        }
        .digit-half {
          position: absolute;
          width: 100%;
          height: 50%;
          overflow: hidden;
          background: ${theme.cardBackground};
          border: 1px solid ${theme.cardBorder};
        }
        .top-base {
          top: 0;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
        }
        .bottom-base {
          bottom: 0;
          border-top: none;
          border-radius: 0 0 8px 8px;
        }
        .flip-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .flip-card {
          position: absolute;
          width: 100%;
          height: 50%;
          overflow: hidden;
          backface-visibility: hidden;
          background: ${theme.cardBackground};
          border: 1px solid ${theme.cardBorder};
        }
        .top-card {
          top: 0;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          transform-origin: center bottom;
          animation: topFlipDown ${animationDuration / 2}ms ease-in forwards;
          z-index: 20;
        }
        .bottom-card {
          bottom: 0;
          border-top: none;
          border-radius: 0 0 8px 8px;
          transform-origin: center top;
          transform: rotateX(90deg);
          animation: bottomFlipUp ${animationDuration / 2}ms ease-out
            ${animationDuration / 2}ms forwards;
          z-index: 10;
        }
        .digit-content {
          position: absolute;
          width: 100%;
          height: 200%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .top-base .digit-content,
        .top-card .digit-content {
          top: 0;
        }
        .bottom-base .digit-content,
        .bottom-card .digit-content {
          top: -100%;
        }
        .digit-text {
          font-size: 100px;
          font-weight: 700;
          line-height: 1;
          color: ${theme.digitColor};
        }
        .divider {
          position: absolute;
          top: 50%;
          left: -2px;
          right: -2px;
          height: 3px;
          background: rgba(0, 0, 0, 0.15);
          transform: translateY(-50%);
          z-index: 25;
        }
        @keyframes topFlipDown {
          from {
            transform: rotateX(0deg);
          }
          to {
            transform: rotateX(-90deg);
          }
        }
        @keyframes bottomFlipUp {
          from {
            transform: rotateX(90deg);
          }
          to {
            transform: rotateX(0deg);
          }
        }
        @media (max-width: 640px) {
          .flip-digit-container {
            width: 130px;
            height: 185px;
          }
          .digit-text {
            font-size: 130px;
          }
        }
      `}</style>
    </div>
  );
}
