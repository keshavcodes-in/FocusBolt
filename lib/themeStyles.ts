
export function getThemeStyles(currentTheme: any) {
  const isImage = Boolean(currentTheme.backgroundImage);

  return {
    isImage,
    // THE BOX: Use for Settings Sheet, Task Card, Player Card, Modals
    container: {
      background: isImage ? "rgba(255, 255, 255, 0.85)" : currentTheme.background,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: isImage ? "1px solid rgba(255, 255, 255, 0.5)" : `1px solid ${currentTheme.cardBorder}80`,
    },
    // THE ITEMS: Use for Todo rows, Music playlist items, Setting toggles
    item: {
      background: isImage ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.05)",
      border: isImage ? "1px solid rgba(0, 0, 0, 0.05)" : `1px solid ${currentTheme.separatorColor}30`,
      borderRadius: "12px",
    },
    // THE TEXT: Primary (Titles), Secondary (Descriptions)
    text: {
      primary: isImage ? "#1a1a1a" : currentTheme.digitColor,
      secondary: isImage ? "rgba(0, 0, 0, 0.6)" : currentTheme.separatorColor,
      accent: currentTheme.digitColor, 
    }
  };
}