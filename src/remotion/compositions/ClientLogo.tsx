import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface ClientLogoProps {
  name: string;
  startFrame?: number;
  index?: number;
}

// Minimalist client logo representations
const LogoSVG: Record<string, React.FC<{ color: string }>> = {
  Mozilla: ({ color }) => (
    <svg viewBox="0 0 120 32" fill={color} style={{ height: 32 }}>
      <text
        x="0"
        y="26"
        fontFamily="system-ui, sans-serif"
        fontWeight="900"
        fontSize="28"
        letterSpacing="-1"
      >
        Mozilla
      </text>
    </svg>
  ),
  GitHub: ({ color }) => (
    <svg viewBox="0 0 98 32" fill={color} style={{ height: 32 }}>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 7.069 4.585 13.067 10.942 15.182.8.147 1.092-.347 1.092-.77 0-.381-.015-1.642-.022-2.979-4.452.968-5.391-1.886-5.391-1.886-.728-1.849-1.776-2.341-1.776-2.341-1.452-.993.11-.973.11-.973 1.606.113 2.451 1.649 2.451 1.649 1.427 2.446 3.743 1.739 4.656 1.33.145-1.034.559-1.739 1.015-2.139-3.552-.404-7.286-1.776-7.286-7.906 0-1.747.623-3.175 1.647-4.293-.165-.404-.714-2.032.157-4.234 0 0 1.343-.43 4.4 1.64 1.276-.355 2.645-.532 4.005-.539 1.359.006 2.729.184 4.008.539 3.054-2.07 4.395-1.64 4.395-1.64.873 2.202.324 3.83.159 4.234 1.025 1.118 1.645 2.546 1.645 4.293 0 6.146-3.741 7.498-7.303 7.893.574.497 1.086 1.47 1.086 2.963 0 2.141-.019 3.864-.019 4.391 0 .426.288.924 1.099.768C27.421 29.063 32 23.066 32 16 32 7.163 24.837 0 16 0z" transform="scale(1)" />
      <text
        x="40"
        y="24"
        fontFamily="system-ui, sans-serif"
        fontWeight="700"
        fontSize="22"
        letterSpacing="-0.5"
      >
        GitHub
      </text>
    </svg>
  ),
  "1Password": ({ color }) => (
    <svg viewBox="0 0 140 32" fill={color} style={{ height: 32 }}>
      <text
        x="0"
        y="26"
        fontFamily="system-ui, sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="-0.5"
      >
        1Password
      </text>
    </svg>
  ),
};

export const ClientLogo: React.FC<ClientLogoProps> = ({
  name,
  startFrame = 0,
  index = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const staggerDelay = index * 18;
  const f = Math.max(0, frame - startFrame - staggerDelay);

  // Scale spring
  const scale = spring({
    frame: f,
    fps,
    config: { damping: 15, stiffness: 150, mass: 0.5 },
    durationInFrames: 25,
  });

  // Opacity
  const opacity = interpolate(f, [0, 12], [0, 0.8], {
    extrapolateRight: "clamp",
  });

  // Subtle float
  const floatY = interpolate(
    Math.sin(((frame - startFrame) / fps) * 1.5 + index),
    [-1, 1],
    [-3, 3]
  );

  const Logo = LogoSVG[name];

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${floatY}px)`,
        padding: "16px 32px",
      }}
    >
      {Logo && <Logo color="#FAFAFA" />}
    </div>
  );
};

export default ClientLogo;
