import { Main } from "./compositions/Main";

// Single composition configuration
export const composition = {
  id: "Main",
  component: Main,
  // 150 + 120 + 180 + 150 + 120 + 150 = 870 frames (scene durations)
  // Minus 5 transitions * 20 frames = 100 frames overlap
  // Total: 870 - 100 = 770 frames + 30 frame buffer = 800
  durationInFrames: 800,
  fps: 30,
  width: 1280,
  height: 720,
};
