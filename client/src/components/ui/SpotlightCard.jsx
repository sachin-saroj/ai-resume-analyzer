import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(194, 120, 56, 0.14)",
  ...props
}) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative overflow-hidden group", className)}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Radial Mask */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-[inherit] z-10 hidden sm:block"
        style={{
          opacity,
          background: `radial-gradient(550px circle at ${position.x}px ${position.y}px, var(--spotlight-color, ${spotlightColor}), transparent 75%)`,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
