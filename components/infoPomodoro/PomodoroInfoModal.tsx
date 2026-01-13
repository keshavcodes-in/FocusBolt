"use client";
import React from "react";
import { ColorTheme } from "@/lib/theme";
import { getThemeStyles } from "@/lib/themeStyles"; 

interface PomodoroInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ColorTheme;
}

export function PomodoroInfoModal({
  isOpen,
  onClose,
  currentTheme,
}: PomodoroInfoModalProps) {
  if (!isOpen) return null;

  // centralized helper
  const theme = getThemeStyles(currentTheme);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          className="rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full animate-in zoom-in-95"
          style={theme.container}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between px-6 py-4 border-b" 
            style={{ borderBottomColor: theme.item.border.split('1px solid ')[1] || "rgba(0,0,0,0.1)" }}
          >
            <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>
              What is Pomodoro?
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
              style={{ color: theme.text.accent, cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 text-md leading-relaxed">
            <p style={{ color: theme.text.primary }}>
              The Pomodoro Technique is a time-management method that breaks
              work into focused intervals— usually <strong>25 minutes</strong>.
            </p>
            <p className="font-semibold" style={{ color: theme.text.secondary }}>
              Why it works:
            </p>
            <ul className="list-disc pl-5 space-y-2" style={{ color: theme.text.secondary }}>
              <li>Keeps your brain fresh and focused</li>
              <li>Reduces burnout by balancing work and rest</li>
              <li>Boosts motivation with small wins</li>
            </ul>
          </div>

          {/* Footer */}
          <div 
            className="flex justify-end px-6 py-4 border-t" 
            style={{ borderTopColor: theme.item.border.split('1px solid ')[1] || "rgba(0,0,0,0.1)" }}
          >
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl font-semibold transition-all hover:brightness-90 active:scale-95 shadow-sm"
              style={{
                backgroundColor: theme.text.accent,
                color: currentTheme.background, 
                cursor: "pointer",
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes zoom-in-95 {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-in {
          animation-fill-mode: both;
          animation-duration: 300ms;
        }
        .zoom-in-95 {
          animation-name: zoom-in-95;
        }
      `}</style>
    </>
  );
}