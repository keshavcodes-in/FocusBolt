import { ColorTheme } from "../lib/theme";

export const colorThemes: ColorTheme[] = [
  // Light themes
  {
    id: "pure-white",
    name: "Pure White",
    background: "#ffffff",
    cardBackground: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
    cardBorder: "#e9ecef",
    digitColor: "#212529",
    separatorColor: "#6c757d",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    category: "light",
  },
 {
  id: "light-gray",
  name: "Light Gray",
  background: "#f5f7fa",
  cardBackground: "linear-gradient(135deg, #ffffff 0%, #e8ecf1 100%)",
  cardBorder: "#c5cdd6",
  digitColor: "#2d3748",
  separatorColor: "#4a5568",
  shadow: "0 12px 40px rgba(45, 55, 72, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)",
  category: "light",
}
,

  // Dark themes
  {
    id: "pure-black",
    name: "Pure Black",
    background: "#000000",
    cardBackground: "linear-gradient(180deg, #1a1a1a 0%, #0d1117 100%)",
    cardBorder: "#30363d",
    digitColor: "#ffffff",
    separatorColor: "#8b949e",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
    category: "dark",
  },
  {
    id: "dark-gray",
    name: "Dark Gray",
    background: "#2a2f36",
    cardBackground: "linear-gradient(180deg, #2f3440 0%, #23282f 100%)",
    cardBorder: "#3d424a",
    digitColor: "#e6edf3",
    separatorColor: "#8b949e",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    category: "dark",
  },

  // Vibrant  light gradients

  {
    id: "serene-breeze",
    name: "Serene Breeze",
    background: "#f6f9fc", // gentle blue-white
    cardBackground: "linear-gradient(180deg, #ffffff 0%, #eaf0f6 100%)", // Soft blue gradient
    cardBorder: "#d2e3ea", // Pale blue border
    digitColor: "#27384a", // Deep navy for readability
    separatorColor: "#90a4ae", // Muted slate blue
    shadow: "0 8px 32px rgba(39, 56, 74, 0.08)", // Soft shadow
    category: "light",
  },
  {
    id: "warm-glow",
    name: "Warm Glow",
    background: "#fff8f0", // Soft warm cream background
    cardBackground: "linear-gradient(180deg, #fffdfa 0%, #ffeeda 100%)", // Warm gradient with soft peach undertones
    cardBorder: "#f5c9a0", // Warm muted orange border
    digitColor: "#7a4a00", // Rich dark amber text for strong contrast and readability
    separatorColor: "#d9a762", // Warm golden separator for subtle division
    shadow: "0 8px 32px rgba(250, 176, 100, 0.15)", // Warm golden shadow for depth
    category: "light",
  },

  // Dark pastels
  {
    id: "dark-blue",
    name: "Dark Blue",
    background: "#0a1929",
    cardBackground: "linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)",
    cardBorder: "#3b82f6",
    digitColor: "#dbeafe",
    separatorColor: "#93c5fd",
    shadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
    category: "pastel-dark",
  },

  {
    id: "dark-emerald",
    name: "Dark Emerald",
    background: "#022c22",
    cardBackground: "linear-gradient(180deg, #065f46 0%, #059669 100%)",
    cardBorder: "#10b981",
    digitColor: "#d1fae5",
    separatorColor: "#6ee7b7",
    shadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
    category: "pastel-dark",
  },
  //images
  {
    id: "mountains bg",
    name: "Mountains bg",
    background: "#ffffff",
    backgroundImage:
      "https://ik.imagekit.io/jzry83ljs/macos-sierra-mountains.jpg",
    backgroundOverlay: "rgba(255, 255, 255, 0.05)", // White overlay for light theme
    cardBackground: "rgba(255, 255, 255, 0.9)",
    cardBorder: "rgba(0, 0, 0, 0.1)",
    digitColor: "#1f2937",
    separatorColor: "#6b7280",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    category: "image",
  },

  {
    id: "Aesthetic Bg",
    name: "Aesthetic Bg",
    background: "#ffffff",
    backgroundImage:
      "https://ik.imagekit.io/jzry83ljs/aesthetic.png?updatedAt=1759218914879",
    backgroundOverlay: "rgba(255, 255, 255, 0.05)", // White overlay for light theme
    cardBackground: "rgba(255, 255, 255, 0.9)",
    cardBorder: "rgba(0, 0, 0, 0.1)",
    digitColor: "#1f2937",
    separatorColor: "#6b7280",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    category: "image",
  },
  {
    id: "Black space",
    name: "Black space",
    background: "#ffffff",
    backgroundImage:
      "https://ik.imagekit.io/jzry83ljs/black_space.jpg?updatedAt=1759218909200",
    backgroundOverlay: "rgba(255, 255, 255, 0.05)",
    cardBackground: "rgba(255, 255, 255, 0.9)",
    cardBorder: "rgba(0, 0, 0, 0.1)",
    digitColor: "#1f2937",
    separatorColor: "#6b7280",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    category: "image",
  },
  {
    id: "Dark Mountains",
    name: "Dark Mountains",
    background: "#ffffff",
    backgroundImage:
      "https://ik.imagekit.io/jzry83ljs/mountain-dark.jpg",
    backgroundOverlay: "rgba(255, 255, 255, 0.05)",
    cardBackground: "rgba(255, 255, 255, 0.9)",
    cardBorder: "rgba(0, 0, 0, 0.1)",
    digitColor: "#1f2937",
    separatorColor: "#6b7280",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    category: "image",
  },
  
];

export const themeCategories = [
  { id: "light", name: "Light", icon: "☀️" },
  { id: "dark", name: "Dark", icon: "🌙" },
  { id: "image", name: "Images", icon: "🖼️" },
] as const;
