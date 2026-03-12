"use client";
import { useState } from "react";
import { ColorTheme } from "@/lib/theme";
import { colorThemes, themeCategories } from "@/config/themes";
import { getColor } from "@/lib/colorUtils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
interface ColorPickerProps {
  currentTheme: ColorTheme;
  onThemeChange: (theme: ColorTheme) => void;
  variant?: "floating" | "header" | "mobile";
}

export function ColorPicker({
  currentTheme,
  onThemeChange,
  variant = "floating",
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(currentTheme.category);

  const getCategoriesForTab = (categoryId: string) => {
    if (categoryId === "light") return ["light", "gradient"];
    if (categoryId === "dark") return ["dark", "pastel-dark"];
    return [categoryId];
  };

  const filteredThemes = colorThemes.filter((theme) =>
    getCategoriesForTab(activeCategory).includes(theme.category)
  );

  // Function to get the right background for preview
  const getPreviewBackground = (theme: ColorTheme) => {
    if (theme.category === "image" && theme.backgroundImage) {
      return `url('${theme.backgroundImage}')`;
    }
    if (theme.category === "gradient") {
      return theme.background;
    }
    return theme.cardBackground;
  };

  // Function to determine if we need glass effect
  const needsGlassEffect = (theme: ColorTheme) => {
    return (
      theme.category === "gradient" && theme.cardBackground.includes("rgba")
    );
  };

  const isImageTheme = Boolean(currentTheme.backgroundImage);
  const color = getColor(currentTheme, isImageTheme);

  // MOBILE VARIANT - Simplified inline theme switcher for mobile menu
 // In ColorPicker component
if (variant === "mobile") {
  return (
    <div className="flex flex-col gap-3">
      {/* Mobile Theme Button - Collapsed State */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center justify-between p-3 rounded-lg transition-all hover:opacity-80 active:scale-98"
        style={{
          background: currentTheme.cardBackground,
          border: `1px solid ${currentTheme.cardBorder}`,
          color: currentTheme.digitColor,
        }}
      >
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" />
            <path d="M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          </svg>
          <span className="font-medium">Theme</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Current theme indicator */}
          <div
            className="w-6 h-6 rounded-full border-2 bg-cover bg-center"
            style={{
              backgroundImage: currentTheme.backgroundImage
                ? `url(${currentTheme.backgroundImage})`
                : undefined,
              backgroundColor: currentTheme.backgroundImage
                ? undefined
                : currentTheme.background,
              borderColor: currentTheme.digitColor,
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <path d="M6 9l6 6l6 -6" />
          </svg>
        </div>
      </button>

      {/* Mobile Expanded Theme Grid */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Category Tabs - Compact Pills */}
            <div
              className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-hide -mx-1 px-1"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {themeCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCategory(category.id);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                    activeCategory === category.id
                      ? "scale-105"
                      : "opacity-60 active:opacity-80"
                  }`}
                  style={{
                    color:
                      activeCategory === category.id
                        ? currentTheme.digitColor
                        : currentTheme.separatorColor,
                    backgroundColor:
                      activeCategory === category.id
                        ? currentTheme.cardBorder
                        : `${currentTheme.cardBorder}30`,
                    border: `1px solid ${
                      activeCategory === category.id
                        ? currentTheme.cardBorder
                        : "transparent"
                    }`,
                  }}
                >
                  <span className="text-xs">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Theme Grid*/}
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredThemes.map((theme) => (
                <motion.button
                  key={theme.id}
                  whileTap={{ scale: 0.92 }}
                  className={`h-20 rounded-lg transition-all duration-200 relative overflow-hidden ${
                    currentTheme.id === theme.id
                      ? "ring-2 ring-offset-1"
                      : "hover:opacity-80"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onThemeChange(theme);
                  }}
                  style={{
                    // Separate background properties to avoid conflict
                    ...(theme.category === "image" && theme.backgroundImage
                      ? {
                          backgroundImage: `url('${theme.backgroundImage}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }
                      : {
                          background: getPreviewBackground(theme),
                        }),
                    border: `2px solid ${
                      currentTheme.id === theme.id
                        ? theme.digitColor
                        : theme.cardBorder
                    }`,
                    ...(currentTheme.id === theme.id && {
                      ringColor: theme.digitColor,
                      ringOffsetColor: currentTheme.background,
                    }),
                    ...(needsGlassEffect(theme) && {
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                    }),
                  }}
                >
                  {/* Gradient overlay for gradient themes */}
                  {theme.category === "gradient" && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: theme.cardBackground,
                        backdropFilter: "blur(5px)",
                        WebkitBackdropFilter: "blur(5px)",
                      }}
                    />
                  )}

                  {/* Content for non-image themes */}
                  {theme.category !== "image" && (
                    <div className="relative z-10 flex flex-col items-center justify-center h-full p-1">
                      <span className="text-lg font-bold" style={{ color: theme.digitColor }}>Aa</span>
                      <span className="text-[9px] font-medium opacity-90 mt-0.5 truncate w-full text-center px-0.5 leading-tight "style={{ color: theme.digitColor }}>
                        {theme.name}
                      </span>
                    </div>
                  )}

                  {/* Image theme */}
                  {theme.category === "image" && (
                    <div className="absolute inset-0 flex items-end justify-center pb-1.5 bg-linear-to-t from-black/60 via-transparent to-transparent">
                      <span className="text-[10px] font-semibold text-white drop-shadow-lg px-1 text-center leading-tight">
                        {theme.name}
                      </span>
                    </div>
                  )}

                  {/* Selected checkmark */}
                  {currentTheme.id === theme.id && (
                    <div
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: theme.digitColor,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={
                          theme.category === "image" ? "#ffffff" : theme.background
                        }
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12l5 5l10 -10" />
                      </svg>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Current theme name indicator */}
            <div
              className="mt-2.5 text-center text-[10px] py-1.5 px-2 rounded-md"
              style={{
                color: currentTheme.separatorColor,
                background: `${currentTheme.cardBorder}20`,
              }}
            >
              Current: <span className="font-medium">{currentTheme.name}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
  // HEADER & FLOATING VARIANTS ( desktop functionality)
  const containerClass =
    variant === "header"
      ? "relative"
      : "color-picker-container fixed bottom-30 right-30 z-100";

  const panelClass =
    variant === "header"
      ? "absolute top-full right-0 mt-2"
      : "fixed bottom-100 right-30";

  return (
    <div className={containerClass}>
      {/* Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 transition-all hover:opacity-80"
        style={{
          background: currentTheme.background,
          borderColor: currentTheme.cardBorder,
          color: currentTheme.digitColor,
        }}
        aria-label="Change theme colors"
        title="Press 'C' to cycle themes"
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
          <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
          <path d="M19 6h1a2 2 0 0 1 2 2a5 5 0 0 1 -5 5l-5 0v2" />
          <path d="M10 15m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
        </svg>
        <span className="hidden sm:inline ml-2">Theme</span>
      </Button>

      {/* Color Picker Panel (Desktop/Header) */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`${panelClass} w-80 max-h-96 rounded-xl shadow-2xl overflow-hidden z-50 transition-all duration-300`}
            style={{
              backgroundColor: currentTheme.background,
              border: `1px solid ${currentTheme.cardBorder}`,
              boxShadow: currentTheme.shadow,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            {/* Category Tabs */}
            <div
              className="flex border-b"
              style={{
                backgroundColor: `${currentTheme.cardBorder}10`,
                borderBottomColor: currentTheme.cardBorder,
              }}
            >
              {themeCategories.map((category) => (
                <button
                  key={category.id}
                  className={`flex-1 p-3 text-xs font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? "border-b-2"
                      : "hover:opacity-80"
                  }`}
                  style={{
                    color:
                      activeCategory === category.id
                        ? currentTheme.digitColor
                        : `${currentTheme.digitColor}90`,
                    backgroundColor:
                      activeCategory === category.id
                        ? currentTheme.background
                        : "transparent",
                    borderBottomColor:
                      activeCategory === category.id
                        ? currentTheme.digitColor
                        : "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm">{category.icon}</span>
                    <span className="hidden sm:block">{category.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Theme Grid */}
            <div className="p-4 grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {filteredThemes.map((theme) => (
                <button
                  key={theme.id}
                  className={`h-16 rounded-lg transition-all duration-200 text-center border-2 hover:scale-105 relative overflow-hidden ${
                    currentTheme.id === theme.id
                      ? "ring-2 ring-offset-2"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => {
                    onThemeChange(theme);
                    setIsOpen(false);
                  }}
                  style={{
                    background: getPreviewBackground(theme),
                    ...(theme.category === "image" &&
                      theme.backgroundImage && {
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }),
                    borderColor:
                      currentTheme.id === theme.id
                        ? theme.digitColor
                        : theme.cardBorder,
                    color: theme.digitColor,
                    ...(currentTheme.id === theme.id && {
                      ringColor: theme.digitColor,
                      ringOffsetColor: currentTheme.background,
                    }),
                    ...(needsGlassEffect(theme) && {
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                    }),
                    cursor: "pointer",
                  }}
                >
                  {/* Glass overlay for gradient themes */}
                  {theme.category === "gradient" && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: theme.cardBackground,
                        backdropFilter: "blur(5px)",
                        WebkitBackdropFilter: "blur(5px)",
                      }}
                    />
                  )}

                  {/* Content - Only show for non-image themes */}
                  {theme.category !== "image" && (
                    <div className="relative z-10">
                      <div className="mb-2">
                        <span className="text-2xl font-bold">Aa</span>
                      </div>
                      <div className="text-xs font-medium opacity-90">
                        {theme.name}
                      </div>
                    </div>
                  )}

                  {/* Image theme label overlay */}
                  {theme.category === "image" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="text-xs font-semibold px-2 py-1 rounded"
                        style={{
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "white",
                        }}
                      >
                        {theme.name}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
