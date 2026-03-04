import { Main } from "./compositions/Main";

// Single composition configuration
export const composition = {
  id: "Main",
  component: Main,
  // 90 + 75 + 120 + 100 + 75 + 100 = 560 frames (scene durations)
  // Minus 5 transitions * 20 frames = 100 frames overlap
  // Total: 560 - 100 = 460 frames + 30 frame buffer = 490
  durationInFrames: 490,
  fps: 30,
  width: 1280,
  height: 720,
};
