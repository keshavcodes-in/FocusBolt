"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SettingsSheet } from "@/components/settings/settings-sheet";
import { TodoList } from "@/components/todo/TodoList";
import { FocusToggleIcon } from "@/components/timer/focus-mode-toggle";
import { SessionQuote } from "@/components/timer/quote";
import { MusicBar } from "../components/music/MusicBar";
import { ExpandedPlayer } from "@/components/music/ExpandedPlayer";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { samplePlaylists } from "@/data/playlists";
import { FlipClock } from "@/components/timer/flip-clock";
import { usePomodoro } from "@/components/timer/pomodoro-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PomodoroInfoModal } from "@/components/infoPomodoro/PomodoroInfoModal";
import { NotificationPrompt } from "@/components/ui/NotificationPrompt";
import { ensurePermission } from "@/lib/notifications";
import { cn } from "@/lib/utils";
import { RegisterSW } from "@/components/register-sw";
import { LoaderThree } from "@/components/ui/loader";
import { DailyFocusCounter } from "@/components/timer/daily-focus-counter";
import { ColorPicker } from "@/components/themeColor/ColorPicker";
import { colorThemes } from "@/config/themes";
import { ColorTheme } from "@/lib/theme";
import { getColor } from "@/lib/colorUtils";

function AppBody() {
  const {
    viewMode,
    setViewMode,
    mode,
    switchMode,
    isRunning,
    remaining,
    start,
    pause,
    reset,
    skip,
    settingsOpen,
    setSettingsOpen,
    focusMode,
    setFocusMode,
    setNotifications,
    dailyMinutes,
    hasStartedToday,
    durations,
    notifications,
  } = usePomodoro();
  // Calculate the total seconds for the CURRENT mode from your provider
  const currentTotalSeconds = durations[mode];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;

      setIsMobile(mobile);
      setIsTablet(tablet);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Separate effect to handle focus mode on mobile
  useEffect(() => {
    if (isMobile && focusMode) {
      setFocusMode(false);
    }
  }, [isMobile, focusMode, setFocusMode]);

  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(() => {
    if (typeof window === "undefined") return colorThemes[0]; // gun metal/dark grey by default
    const saved = localStorage.getItem("focusBoltTheme");
    if (saved) {
      const savedTheme = colorThemes.find((t) => t.id === saved);
      if (savedTheme) return savedTheme;
    }
    return colorThemes[0];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("focusBoltTheme", currentTheme.id);
    }
  }, [currentTheme]);

  const isImageTheme = Boolean(currentTheme.backgroundImage);
  const color = getColor(currentTheme, isImageTheme);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement.style;

    if (currentTheme.backgroundImage && currentTheme.backgroundOverlay) {
      root.setProperty(
        "--theme-background",
        `linear-gradient(${currentTheme.backgroundOverlay}, ${currentTheme.backgroundOverlay}), url('${currentTheme.backgroundImage}')`,
      );
      root.setProperty("--theme-background-size", "cover");
      root.setProperty("--theme-background-position", "center");
      root.setProperty("--theme-background-attachment", "fixed");
    } else {
      root.setProperty("--theme-background", currentTheme.background);
      root.setProperty("--theme-background-size", "auto");
      root.setProperty("--theme-background-position", "initial");
      root.setProperty("--theme-background-attachment", "initial");
    }

    root.setProperty("--theme-card-background", currentTheme.cardBackground);
    root.setProperty("--theme-card-border", currentTheme.cardBorder);
    root.setProperty("--theme-digit-color", currentTheme.digitColor);
    root.setProperty("--theme-separator-color", currentTheme.separatorColor);
    root.setProperty("--theme-shadow", currentTheme.shadow);
  }, [currentTheme]);

  const tabs = useMemo(
    () => [
      { value: "work", label: "Work" },
      { value: "short", label: "Short Break" },
      { value: "long", label: "Long Break" },
    ],
    [],
  );

  const [showPomodoroInfo, setShowPomodoroInfo] = React.useState(false);

  const modeLabel = useCallback((mode: "work" | "short" | "long") => {
    switch (mode) {
      case "work":
        return "Work";
      case "short":
        return "Short Break";
      case "long":
        return "Long Break";
    }
  }, []);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (isRunning) pause();
          else start();
          break;
        default:
          switch (e.key.toLowerCase()) {
            case "f":
              if (!isMobile) {
                e.preventDefault();
                const target = document.getElementById(
                  "pomodoro-focus-section",
                );
                if (!target) return;

                // Check actual fullscreen state
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                  setFocusMode(false);
                } else {
                  target.requestFullscreen();
                  setFocusMode(true);
                }
              }
              break;
            case "c": {
              const currentIndex = colorThemes.findIndex(
                (t) => t.id === currentTheme.id,
              );
              const nextIndex = (currentIndex + 1) % colorThemes.length;
              setCurrentTheme(colorThemes[nextIndex]);
              break;
            }
          }
      }
    },
    [
      isRunning,
      pause,
      start,
      setFocusMode,
      currentTheme,
      isMobile,
      isTablet,
      focusMode,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  const [isExpanded, setIsExpanded] = useState(false);
  const audioPlayer = useAudioPlayer();

  const handleToggleExpand = () => setIsExpanded(!isExpanded);

  const handleSelectTrack = (track: any) => {
    const playlist = samplePlaylists.find((p) =>
      p.tracks.some((t) => t.id === track.id),
    );
    if (playlist) {
      audioPlayer.playTrack(track, playlist.tracks);
    }
  };

  const [todoOpen, setTodoOpen] = React.useState(false);
  const [showNotifPrompt, setShowNotifPrompt] = React.useState(false);

  const handleAcceptNotifications = async () => {
    setShowNotifPrompt(false);
    const granted = await ensurePermission();
    if (granted) {
      setNotifications(true);
    } else {
      alert(
        "Notifications are blocked. Please enable them in browser settings.",
      );
    }
  };
  const handleDismissNotifications = () => {
    setShowNotifPrompt(false);
  };
  const handleClose = () => {
    setShowNotifPrompt(false);
  };

  const musicBarProps = {
    currentTrack: audioPlayer.currentTrack,
    isPlaying: audioPlayer.isPlaying,
    isBuffering: audioPlayer.isBuffering,
    error: audioPlayer.error,
    onPlayPause: audioPlayer.togglePlayPause,
    onNext: audioPlayer.playNext,
    onPrevious: audioPlayer.playPrevious,
    currentTime: audioPlayer.currentTime,
    duration: audioPlayer.duration,
    onSeek: audioPlayer.seek,
    isExpanded: isExpanded,
    onToggleExpand: handleToggleExpand,
    currentTheme: currentTheme,
    onSelectFirstTrack: () => {
      if (samplePlaylists.length > 0 && samplePlaylists[0].tracks.length > 0) {
        handleSelectTrack(samplePlaylists[0].tracks[0]);
      }
    },
  };

  return (
    <main
      className="min-h-dvh  overflow-x-hidden text-foreground transition-all duration-500 ease-in-out relative"
      style={{
        ...(currentTheme.backgroundImage && {
          backgroundColor: "#2a2f36",
          backgroundImage: currentTheme.backgroundOverlay
            ? `linear-gradient(${currentTheme.backgroundOverlay}, ${currentTheme.backgroundOverlay}), url('${currentTheme.backgroundImage}')`
            : `url('${currentTheme.backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }),
        ...(!currentTheme.backgroundImage && {
          background: currentTheme.background,
        }),
        color: currentTheme.digitColor,
      }}
    >
      <RegisterSW />

      <div className="flex flex-col min-h-dvh">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <div
            className={cn(
              "mx-auto w-full max-w-4xl px-3 sm:px-6 md:px-8",
              focusMode && "max-w-3xl",
            )}
          >
            {/* FLOATING NOTIFICATION BELL */}
            <div
              className="fixed z-10"
              style={{
                top: isMobile ? "60px" : "16px",
                right: isMobile ? "16px" : "20px",
              }}
            >
              <button
                onClick={() => {
                  if (notifications) {
                    setNotifications(false);
                  } else {
                    setShowNotifPrompt(true);
                  }
                }}
                aria-label={
                  notifications
                    ? "Disable notifications"
                    : "Enable notifications"
                }
                title={
                  notifications
                    ? "Notifications on — click to disable"
                    : "Enable notifications"
                }
                className="flex items-center justify-center rounded-md transition-all duration-200 hover:opacity-80 active:scale-95"
                style={{
                  width: isMobile ? 36 : 40,
                  height: isMobile ? 36 : 40,
                  background: `${currentTheme.background}`,
                  color: currentTheme.digitColor,
                  border: isImageTheme
                    ? `1px solid ${currentTheme.digitColor}`
                    : `1px solid ${color}`,
                  boxShadow: isImageTheme
                    ? "2px 2px 0 0 rgba(255,255,255,0.78)"
                    : `2px 2px 0 0 ${color}`,
                  cursor: "pointer",
                }}
              >
                {notifications ? (
                  /* Bell ON */

                  <svg
                    width={isMobile ? 20 : 21}
                    height={isMobile ? 20 : 21}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.35419 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21M18 8C18 6.4087 17.3679 4.88258 16.2427 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.8826 2.63214 7.75738 3.75736C6.63216 4.88258 6.00002 6.4087 6.00002 8C6.00002 11.0902 5.22049 13.206 4.34968 14.6054C3.61515 15.7859 3.24788 16.3761 3.26134 16.5408C3.27626 16.7231 3.31488 16.7926 3.46179 16.9016C3.59448 17 4.19261 17 5.38887 17H18.6112C19.8074 17 20.4056 17 20.5382 16.9016C20.6852 16.7926 20.7238 16.7231 20.7387 16.5408C20.7522 16.3761 20.3849 15.7859 19.6504 14.6054C18.7795 13.206 18 11.0902 18 8Z" />
                  </svg>
                ) : (
                  /* Bell OFF / crossed */
                  <motion.div
                    animate={
                      !notifications
                        ? { rotate: [0, -12, 8, -4, 0] }
                        : { rotate: 0 }
                    }
                    transition={
                      !notifications
                        ? {
                            duration: 0.35,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 1.5,
                          }
                        : { duration: 0.2 }
                    }
                  >
                    {notifications ? (
                      <svg
                        width={isMobile ? 20 : 21}
                        height={isMobile ? 20 : 21}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.35419 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21M18 8C18 6.4087 17.3679 4.88258 16.2427 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.8826 2.63214 7.75738 3.75736C6.63216 4.88258 6.00002 6.4087 6.00002 8C6.00002 11.0902 5.22049 13.206 4.34968 14.6054C3.61515 15.7859 3.24788 16.3761 3.26134 16.5408C3.27626 16.7231 3.31488 16.7926 3.46179 16.9016C3.59448 17 4.19261 17 5.38887 17H18.6112C19.8074 17 20.4056 17 20.5382 16.9016C20.6852 16.7926 20.7238 16.7231 20.7387 16.5408C20.7522 16.3761 20.3849 15.7859 19.6504 14.6054C18.7795 13.206 18 11.0902 18 8Z" />
                      </svg>
                    ) : (
                      <svg
                        width={isMobile ? 20 : 21}
                        height={isMobile ? 20 : 21}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8.63306 3.03371C9.61959 2.3649 10.791 2 12 2C13.5913 2 15.1174 2.63214 16.2426 3.75736C17.3679 4.88258 18 6.4087 18 8C18 10.1008 18.2702 11.7512 18.6484 13.0324M6.25867 6.25724C6.08866 6.81726 6 7.40406 6 8C6 11.0902 5.22047 13.206 4.34966 14.6054C3.61513 15.7859 3.24786 16.3761 3.26132 16.5408C3.27624 16.7231 3.31486 16.7926 3.46178 16.9016C3.59446 17 4.19259 17 5.38885 17H17M9.35418 21C10.0593 21.6224 10.9856 22 12 22C13.0144 22 13.9407 21.6224 14.6458 21M21 21L3 3" />
                      </svg>
                    )}
                  </motion.div>
                )}
              </button>
            </div>
            {/* HEADER */}

            <header className="flex items-center justify-between gap-2 py-1 sm:py-2 md:py-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  fill="none"
                  stroke={color}
                  className="w-8 h-8  shrink-0"
                  aria-hidden="true"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M13 2l.018 .001l.016 .001l.083 .005l.011 .002h.011l.038 .009l.052 .008l.016 .006l.011 .001l.029 .011l.052 .014l.019 .009l.015 .004l.028 .014l.04 .017l.021 .012l.022 .01l.023 .015l.031 .017l.034 .024l.018 .011l.013 .012l.024 .017l.038 .034l.022 .017l.008 .01l.014 .012l.036 .041l.026 .027l.006 .009c.12 .147 .196 .322 .218 .513l.001 .012l.002 .041l.004 .064v6h5a1 1 0 0 1 .868 1.497l-.06 .091l-8 11c-.568 .783 -1.808 .38 -1.808 -.588v-6h-5a1 1 0 0 1 -.868 -1.497l.06 -.091l8 -11l.01 -.013l.018 -.024l.033 -.038l.018 -.022l.009 -.008l.013 -.014l.04 -.036l.028 -.026l.008 -.006a1 1 0 0 1 .402 -.199l.011 -.001l.027 -.005l.074 -.013l.011 -.001l.041 -.002z" />
                </svg>

                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <h1
                    className="text-xl md:text-2xl  font-semibold transition-colors duration-300 tracking-tight"
                    style={{
                      color: isImageTheme
                        ? currentTheme.background
                        : currentTheme.digitColor,
                      textShadow: isImageTheme
                        ? "0 2px 4px rgba(0,0,0,0.1)"
                        : "none",
                    }}
                  >
                    Focus Bolt
                  </h1>

                  {/* Vertical line separator */}
                  <span
                    className="hidden sm:inline-block w-0.5 h-6"
                    style={{
                      backgroundColor: color,
                    }}
                  />

                  <span
                    className="text-md  md:text-lg font-semibold transition-colors duration-300 tracking-tight"
                    style={{
                      color: isImageTheme
                        ? currentTheme.background
                        : currentTheme.digitColor,
                      opacity: 0.9,
                    }}
                  >
                    Work Sessions with Breaks
                  </span>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setTodoOpen(true)}
                  className="hover:opacity-80 transition-opacity"
                  style={{
                    background: currentTheme.background,
                    color: currentTheme.digitColor,
                    border: `1px solid ${currentTheme.cardBorder}`,
                    cursor: "pointer",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isImageTheme ? "currentColor" : color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />
                    <path d="M9 12l2 2l4 -4" />
                  </svg>
                  Tasks
                </Button>
                <ColorPicker
                  currentTheme={currentTheme}
                  onThemeChange={setCurrentTheme}
                  variant="header"
                />
                <Button
                  variant="outline"
                  onClick={() => setSettingsOpen(true)}
                  className="hover:opacity-80 transition-opacity"
                  style={{
                    background: currentTheme.background,
                    color: currentTheme.digitColor,
                    border: `1px solid ${currentTheme.cardBorder}`,
                    cursor: "pointer",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isImageTheme ? "currentColor" : color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                  </svg>
                  Settings
                </Button>
              </div>

              {/* Mobile/Tablet Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg transition-opacity hover:opacity-80"
                style={{
                  background: isImageTheme
                    ? "rgba(255,255,255,0.15)"
                    : currentTheme.cardBackground,
                  border: `1px solid ${currentTheme.cardBorder}`,
                }}
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {mobileMenuOpen ? (
                    <>
                      <path d="M18 6l-12 12" />
                      <path d="M6 6l12 12" />
                    </>
                  ) : (
                    <>
                      <path d="M4 6h16" />
                      <path d="M4 12h16" />
                      <path d="M4 18h16" />
                    </>
                  )}
                </svg>
              </button>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-35 md:hidden"
                  />

                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="fixed right-0 top-0 h-full w-64 z-36 md:hidden shadow-2xl overflow-y-auto"
                    style={{
                      background: currentTheme.background,
                      borderLeft: `1px solid ${currentTheme.cardBorder}`,
                    }}
                  >
                    <div className="flex flex-col min-h-full p-6 gap-4">
                      <div className="flex items-center justify-between mb-4">
                        <h2
                          className="text-lg font-semibold"
                          style={{ color: currentTheme.digitColor }}
                        >
                          Menu
                        </h2>
                        <button
                          onClick={() => setMobileMenuOpen(false)}
                          className="p-2 hover:opacity-70 transition-opacity"
                          aria-label="Close menu"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={currentTheme.digitColor}
                            strokeWidth="2"
                          >
                            <path d="M18 6l-12 12" />
                            <path d="M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setTodoOpen(true);
                          }}
                          className="flex items-center gap-3 p-3 rounded-lg transition-opacity hover:opacity-80"
                          style={{
                            background: currentTheme.cardBackground,
                            border: `1px solid ${currentTheme.cardBorder}`,
                            color: currentTheme.digitColor,
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M9 11l3 3l8 -8" />
                            <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
                          </svg>
                          <span className="font-medium">Tasks</span>
                        </button>

                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setSettingsOpen(true);
                          }}
                          className="flex items-center gap-3 p-3 rounded-lg transition-opacity hover:opacity-80"
                          style={{
                            background: currentTheme.cardBackground,
                            border: `1px solid ${currentTheme.cardBorder}`,
                            color: currentTheme.digitColor,
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                            <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                          </svg>
                          <span className="font-medium">Settings</span>
                        </button>
                      </div>

                      <div className="w-full">
                        <ColorPicker
                          currentTheme={currentTheme}
                          onThemeChange={(theme) => {
                            setCurrentTheme(theme);
                          }}
                          variant="mobile"
                        />
                      </div>
                      <div
                        className="mt-auto p-3 rounded-lg text-xs"
                        style={{
                          background: `${currentTheme.cardBorder}20`,
                          color: currentTheme.separatorColor,
                        }}
                      >
                        <p className="opacity-80">
                          💡 Focus Mode is available on tablet and desktop
                          devices only.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* MAIN CONTENT */}
            <section className="flex-1 pb-2">
              <Card
                id="pomodoro-focus-section"
                className={cn(
                  "relative transition-all duration-300",
                  focusMode && "fullscreen-mode",
                )}
                style={{
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                }}
              >
                <CardHeader
                  className={cn(
                    " transition-all duration-300",
                    focusMode ? "card-header" : "",
                  )}
                >
                  <div className="flex flex-col gap-4">
                    {/* TOP ROW: Title on left, Stats & Actions on right */}
                    <div className="flex items-center justify-between w-full">
                      {/* LEFT: Section Title */}

                      <div
                        onClick={() => setShowPomodoroInfo(true)}
                        className="group cursor-pointer flex items-center gap-2 opacity-80 hover:opacity-100 transition-all"
                      >
                        <span
                          className="text-lg"
                          style={{ color: currentTheme.digitColor }}
                        >
                          ❐
                        </span>
                        <CardTitle
                          className="text-sm font-bold tracking-widest uppercase"
                          style={{
                            color: isImageTheme
                              ? "#ffffff"
                              : currentTheme.digitColor,
                            textShadow: isImageTheme
                              ? "0 2px 10px rgba(0,0,0,0.3)"
                              : "none",
                          }}
                        >
                          Pomodoro
                        </CardTitle>
                      </div>

                      {/* RIGHT: Focus Counter (Moved here for balance) */}
                      <div className="flex items-center gap-3">
                        {hasStartedToday && dailyMinutes > 0 && (
                          <div className="hidden sm:block">
                            {" "}
                            {/* Hidden on tiny screens to prevent crowding */}
                            <DailyFocusCounter
                              minutes={dailyMinutes}
                              currentTheme={currentTheme}
                              isMobile={isMobile}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BOTTOM ROW: Centered Tabs */}
                    <div className="flex justify-center w-full">
                      <div
                        className="flex rounded-xl p-1.5 transition-all duration-500 w-full sm:w-auto mt-2"
                        style={{
                          backgroundColor: isImageTheme
                            ? "rgba(255, 255, 255, 0.12)"
                            : `${currentTheme.cardBorder}20`,
                          backdropFilter: "blur(12px)",
                          WebkitBackdropFilter: "blur(12px)",
                          border: `1px solid ${
                            isImageTheme
                              ? "rgba(255, 255, 255, 0.2)"
                              : `${currentTheme.cardBorder}40`
                          }`,
                          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        {tabs.map((tab) => (
                          <button
                            key={tab.value}
                            onClick={() => {
                              setViewMode(tab.value as any);
                              switchMode(tab.value as any);
                            }}
                            className={`${
                              viewMode === tab.value ? "" : "hover:opacity-70"
                            } relative rounded-lg px-4 sm:px-10 py-2 text-sm font-semibold transition-all flex-1 sm:flex-none`}
                            style={{
                              color: isImageTheme
                                ? "#ffffff"
                                : viewMode === tab.value
                                  ? currentTheme.digitColor
                                  : `${currentTheme.digitColor}90`,
                              WebkitTapHighlightColor: "transparent",
                            }}
                          >
                            {viewMode === tab.value && (
                              <motion.span
                                layoutId="activeTabBubble"
                                className="absolute inset-0 z-0"
                                style={{
                                  borderRadius: 8,
                                  backgroundColor: isImageTheme
                                    ? "rgba(255, 255, 255, 0.25)"
                                    : currentTheme.cardBorder,
                                  boxShadow: isImageTheme
                                    ? "0 2px 10px rgba(0,0,0,0.1)"
                                    : "none",
                                }}
                                transition={{
                                  type: "spring",
                                  bounce: 0.2,
                                  duration: 0.6,
                                }}
                              />
                            )}
                            <span className="relative z-10 whitespace-nowrap">
                              {tab.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <PomodoroInfoModal
                    isOpen={showPomodoroInfo}
                    onClose={() => setShowPomodoroInfo(false)}
                    currentTheme={currentTheme}
                  />
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-1 px-2 sm:px-4 md:px-6 relative">
                  {/* RESET BUTTON */}
                  {!focusMode && (
                    <button
                      onClick={reset}
                      aria-label="Reset"
                      className="absolute p-1.5 sm:p-2 rounded-full focus:outline-none z-30 hover:opacity-80 transition-opacity"
                      style={{
                        top: isTablet ? "60px" : isMobile ? "27px" : "0px",
                        right: isTablet ? "10px" : isMobile ? "1px" : "50px",
                        background: isImageTheme
                          ? "rgba(255,255,255,0.82)"
                          : currentTheme.background,
                        color: currentTheme.digitColor,
                        border: `1px solid ${currentTheme.cardBorder}`,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                        width: isMobile ? 36 : 40,
                        height: isMobile ? 36 : 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      title="Reset"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sm:w-5 sm:h-5"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                        <path d="M20 4v5h-5" />
                      </svg>
                    </button>
                  )}

                  {/* FLIP CLOCK */}
                  <div className="relative w-screen  flex items-center justify-center">
                    <div className=" relative z-10 scale-[0.6] min-[640px]:scale-[0.95] min-[768px]:scale-100 min-[1024px]:scale-110">
                      <FlipClock
                        seconds={remaining}
                        totalSeconds={currentTotalSeconds}
                        theme={currentTheme}
                        ariaLabel={`${modeLabel(mode)} time remaining`}
                      />
                    </div>
                  </div>

                  {/* QUOTE */}
                  <div
                    className=" hidden sm:block transition-colors duration-300 text-center px-2 sm:px-4 mt-0 -mb-3"
                    style={{ color: currentTheme.separatorColor, opacity: 0.8 }}
                  >
                    <SessionQuote currentTheme={currentTheme} />
                  </div>

                  {/* CONTROL BUTTONS */}
                  <div
                    className={cn(
                      "flex items-center justify-center gap-4",
                      isTablet ? "mt-6" : "-mt-2",
                    )}
                  >
                    {isRunning ? (
                      <Button
                        size="xl"
                        onClick={pause}
                        className="relative px-6 transition-all duration-200 hover:opacity-80"
                        title="Press Space to pause timer"
                        style={{
                          background: `${currentTheme.background}`,
                          color: currentTheme.digitColor,
                          border: isImageTheme
                            ? `1px solid ${currentTheme.digitColor}`
                            : `1px solid ${color}`,
                          boxShadow: isImageTheme
                            ? "4px 4px 0 0 rgba(255,255,255,0.78)"
                            : `4px 4px 0 0 ${color}`,
                        }}
                      >
                        <svg
                          className="inline"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          style={{ width: "18px", height: "18px" }}
                        >
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                        Pause
                      </Button>
                    ) : (
                      <Button
                        size="xl"
                        onClick={start}
                        className="relative px-6 transition-all duration-200 hover:opacity-80"
                        title="Press Space to start timer"
                        style={{
                          background: `${currentTheme.background}`,
                          color: currentTheme.digitColor,
                          border: isImageTheme
                            ? `1px solid ${currentTheme.digitColor}`
                            : `1px solid ${color}`,
                          boxShadow: isImageTheme
                            ? "4px 4px 0 0 rgba(255,255,255,0.78)"
                            : `4px 4px 0 0 ${color}`,
                        }}
                      >
                        <svg
                          className=" inline"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          style={{ width: "20px", height: "20px" }}
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Start
                      </Button>
                    )}

                    {/* focus toggle */}
                    <div className="">
                      <FocusToggleIcon currentTheme={currentTheme} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ExpandedPlayer
                isExpanded={isExpanded}
                currentTheme={currentTheme}
                playlists={samplePlaylists}
                currentTrack={audioPlayer.currentTrack}
                onSelectTrack={handleSelectTrack}
                onClose={() => setIsExpanded(false)}
              />
            </section>
          </div>
        </div>

        {/* MUSIC BAR - STICKY BOTTOM */}
        {/* STICKY BOTTOM — mobile/tablet */}
        <div
          className="sticky bottom-7 left-0 right-0 z-30 w-full lg:hidden"
          style={{ marginTop: "auto" }}
        >
          <div
            className={cn(
              "mx-auto w-full max-w-4xl px-3 sm:px-6 md:px-8",
              focusMode && "max-w-3xl",
            )}
          >
            <MusicBar {...musicBarProps} />
          </div>
        </div>

        {/* PILL — desktop only */}
        <div className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-30">
          <MusicBar {...musicBarProps} vertical={true} />
        </div>
        <footer
          className="  text-center"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <p
            className="text-sm font-light backdrop-blur-sm py-2 px-4 rounded-full inline-block transition-colors duration-300 opacity-80"
            style={{
              color: isImageTheme
                ? currentTheme.background
                : currentTheme.digitColor,
            }}
          >
            Made with ❤️ by{" "}
            <a
              href="https://github.com/keshavcodes-in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-opacity duration-200 underline"
            >
              Keshav
            </a>
          </p>
        </footer>
      </div>

      {/* MODALS */}
      {todoOpen && (
        <>
          <div
            className="fixed inset-0 z-40 backdrop-blur-[2px]"
            style={{
              backgroundColor: isImageTheme
                ? "rgba(0, 0, 0, 0.35)"
                : "rgba(0, 0, 0, 0.25)",
            }}
            onClick={() => setTodoOpen(false)}
          />
          <TodoList
            open={todoOpen}
            onOpenChange={setTodoOpen}
            currentTheme={currentTheme}
          />
        </>
      )}

      {settingsOpen && (
        <SettingsSheet
          currentTheme={currentTheme}
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
        />
      )}

      {showNotifPrompt && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(24,24,24,0.35)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              zIndex: 1000,
            }}
          />
          <NotificationPrompt
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2000,
              maxWidth: "90vw",
              width: "360px",
            }}
            currentTheme={currentTheme}
            onAccept={handleAcceptNotifications}
            onDismiss={handleDismissNotifications}
            onClose={handleClose}
          />
        </>
      )}
    </main>
  );
}

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <LoaderThree />
      </div>
    );
  }

  return <AppBody />;
}
