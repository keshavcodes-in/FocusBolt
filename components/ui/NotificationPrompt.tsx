import React, { CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import { ColorTheme } from "@/lib/theme";
import { getColor } from "@/lib/colorUtils";
interface NotificationPromptProps {
  currentTheme: ColorTheme;
  onAccept: () => void;
  onDismiss: () => void;
  onClose: () => void;
  style?: CSSProperties;
}

// SVG as React component
function NotificationBellIcon({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill={color}
      style={{
        flexShrink: 0,
        marginTop: 4,
        marginRight: 12,
        verticalAlign: 'middle',
        display: "block"
      }}
      aria-hidden="true"
      className="icon icon-tabler icons-tabler-filled icon-tabler-bell-ringing"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M17.451 2.344a1 1 0 0 1 1.41 -.099a12.05 12.05 0 0 1 3.048 4.064a1 1 0 1 1 -1.818 .836a10.05 10.05 0 0 0 -2.54 -3.39a1 1 0 0 1 -.1 -1.41z" />
      <path d="M5.136 2.245a1 1 0 0 1 1.312 1.51a10.05 10.05 0 0 0 -2.54 3.39a1 1 0 1 1 -1.817 -.835a12.05 12.05 0 0 1 3.045 -4.065z" />
      <path d="M14.235 19c.865 0 1.322 1.024 .745 1.668a3.992 3.992 0 0 1 -2.98 1.332a3.992 3.992 0 0 1 -2.98 -1.332c-.552 -.616 -.158 -1.579 .634 -1.661l.11 -.006h4.471z" />
      <path d="M12 2c1.358 0 2.506 .903 2.875 2.141l.046 .171l.008 .043a8.013 8.013 0 0 1 4.024 6.069l.028 .287l.019 .289v2.931l.021 .136a3 3 0 0 0 1.143 1.847l.167 .117l.162 .099c.86 .487 .56 1.766 -.377 1.864l-.116 .006h-16c-1.028 0 -1.387 -1.364 -.493 -1.87a3 3 0 0 0 1.472 -2.063l.021 -.143l.001 -2.97a8 8 0 0 1 3.821 -6.454l.248 -.146l.01 -.043a3.003 3.003 0 0 1 2.562 -2.29l.182 -.017l.176 -.004z" />
    </svg>
  );
}

export function NotificationPrompt({
  currentTheme,
  onAccept,
  onDismiss,
  onClose,
  style,
}: NotificationPromptProps) {
 const isImageTheme = Boolean(currentTheme.backgroundImage);
   const color = getColor(currentTheme, isImageTheme);
    const bellIconColor = isImageTheme ? currentTheme.digitColor : color;

  return (
  
    <div
      role="alert"
      
      aria-live="polite"
      style={{
       
        background: currentTheme.background,
        color: currentTheme.digitColor,
        border: `1.5px solid ${currentTheme.cardBorder}`,
        borderRadius: 18,
      
        padding: "20px clamp(20px, 5vw, 38px)",
        boxShadow: `0 8px 32px ${currentTheme.cardBorder}22`,
     
        maxWidth: 440,
        width: "90vw",
        fontSize: "clamp(14px, 2vw, 16px)",
        fontWeight: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 16,
        position: "relative",
        ...style,
      }}
    >
      {/* Cross button in top-right */}
      <button
        aria-label="Close notification"
        onClick={onClose}
        style={{
          position: "absolute",
          right: 14,
          top: 10,
          background: "transparent",
          border: "none",
          color: currentTheme.digitColor,
          fontSize: 20,
          cursor: "pointer",
          lineHeight: 1,
          padding: 0,
          margin: 0,
        }}
      >
        &times;
      </button>

      {/* Row for icon and text */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 0,
        marginBottom: 10,
      }}>
        <NotificationBellIcon color={bellIconColor} />
        <span
          style={{
            lineHeight: 1.5,
            textAlign: "left",
            wordBreak: "break-word",
            flex: 1,
            marginTop: 2, 
          }}
        >
          Enable notifications to get alerts when sessions end.
        </span>
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <Button
          size="sm"
          onClick={onDismiss}
          style={{
            background: `${currentTheme.background}`,
            color: currentTheme.digitColor,
            cursor: "pointer",
          }}
        >
          No Thanks
        </Button>
        <Button
          size="sm"
          onClick={onAccept}
          variant="outline"
          style={{
            background: `${currentTheme.background}`,
            paddingBottom:3,
            color: currentTheme.digitColor,
            border: isImageTheme
              ? `2px solid ${currentTheme.digitColor} `
              : `1px solid ${color}`,
            boxShadow: isImageTheme
              ? " "
              : `4px 4px 0 0 ${color}`,
            cursor: "pointer",
          }}
        >
          Enable
        </Button>
      </div>
    </div>
   
  );
}
