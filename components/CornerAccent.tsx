"use client";
import React from "react";

interface CornerAccentProps {
  position: "tl" | "tr" | "bl" | "br";
  color?: string;
  size?: number;
  className?: string;
}

export function CornerAccent({
  position,
  color = "#C9A96E",
  size = 40,
  className = "",
}: CornerAccentProps) {
  const transforms: Record<string, string> = {
    tl: "none",
    tr: "scaleX(-1)",
    bl: "scaleY(-1)",
    br: "scale(-1, -1)",
  };

  const positions: Record<string, React.CSSProperties> = {
    tl: { top: 10, left: 10 },
    tr: { top: 10, right: 10 },
    bl: { bottom: 10, left: 10 },
    br: { bottom: 10, right: 10 },
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        transform: transforms[position],
        ...positions[position],
        pointerEvents: "none",
      }}
      className={className}
    >
      {/* Outer L-bracket */}
      <path
        d="M4 4 L4 20 M4 4 L20 4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* Inner L-bracket */}
      <path
        d="M8 8 L8 17 M8 8 L17 8"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Diamond dot */}
      <rect
        x="5.5"
        y="5.5"
        width="3"
        height="3"
        transform="rotate(45 7 7)"
        fill={color}
        opacity="0.5"
      />
      {/* Bottom bar accent */}
      <path
        d="M4 24 L12 24"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}
