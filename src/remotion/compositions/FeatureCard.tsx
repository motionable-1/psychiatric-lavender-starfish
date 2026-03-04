import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
} from "remotion";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  startFrame?: number;
  index?: number;
  accentColor?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  startFrame = 0,
  index = 0,
  accentColor = "#3ECF8E",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const staggerDelay = index * 15;
  const f = Math.max(0, frame - startFrame - staggerDelay);

  // Card scale animation
  const scale = spring({
    frame: f,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.6 },
    durationInFrames: 25,
  });

  // Y translation
  const translateY = interpolate(f, [0, 20], [60, 0], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Opacity
  const opacity = interpolate(f, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Icon bounce (after card settles)
  const iconScale = spring({
    frame: Math.max(0, f - 15),
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.4 },
    durationInFrames: 20,
  });

  // Glow pulse
  const glowPulse = interpolate(
    Math.sin(((frame - startFrame) / fps) * 3),
    [-1, 1],
    [0.3, 0.6]
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 24px",
        background: `linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)`,
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
        width: 280,
        boxShadow: `0 0 40px ${accentColor}${Math.round(glowPulse * 255)
          .toString(16)
          .padStart(2, "0")}`,
      }}
    >
      {/* Icon container */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${accentColor}30 0%, ${accentColor}10 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          transform: `scale(${iconScale})`,
          boxShadow: `0 8px 32px ${accentColor}40`,
        }}
      >
        <Img
          src={icon}
          style={{
            width: 40,
            height: 40,
          }}
        />
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#FAFAFA",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        {title}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 14,
          color: "rgba(250, 250, 250, 0.7)",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </div>
  );
};

export default FeatureCard;
