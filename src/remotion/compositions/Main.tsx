import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { SupabaseLogo } from "./SupabaseLogo";
import { FeatureCard } from "./FeatureCard";
import { ClientLogo } from "./ClientLogo";
import {
  FadeInWords,
  BlurReveal,
  FadeInChars,
} from "../library/components/text/TextAnimation";
import { Glow } from "../library/components/effects/Glow";
import { Counter } from "../library/components/text/Counter";
import { blurDissolve } from "../library/components/layout/transitions/presentations";

const { fontFamily } = loadFont();

// Brand colors
const COLORS = {
  primary: "#3ECF8E",
  dark: "#121212",
  darkAlt: "#1a1a1a",
  text: "#FAFAFA",
  textMuted: "rgba(250, 250, 250, 0.6)",
  accent: "#006239",
};

// Animated background with floating elements
const AnimatedBackground: React.FC<{ variant?: "dark" | "gradient" }> = ({
  variant = "dark",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  return (
    <AbsoluteFill
      style={{
        background:
          variant === "gradient"
            ? `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.accent}30 50%, ${COLORS.dark} 100%)`
            : COLORS.dark,
      }}
    >
      {/* Animated grid */}
      <div
        style={{
          position: "absolute",
          inset: -100,
          backgroundImage: `
            linear-gradient(rgba(62, 207, 142, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(62, 207, 142, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translateY(${(time * 20) % 60}px)`,
        }}
      />

      {/* Floating orbs */}
      {[0, 1, 2].map((i) => {
        const x = interpolate(
          Math.sin(time * 0.3 + i * 2),
          [-1, 1],
          [10 + i * 30, 30 + i * 30]
        );
        const y = interpolate(
          Math.cos(time * 0.4 + i * 1.5),
          [-1, 1],
          [20 + i * 20, 40 + i * 20]
        );
        const scale = interpolate(
          Math.sin(time * 0.5 + i),
          [-1, 1],
          [0.8, 1.2]
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: 300 + i * 100,
              height: 300 + i * 100,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${COLORS.primary}${15 - i * 4} 0%, transparent 70%)`,
              transform: `scale(${scale})`,
              filter: "blur(60px)",
            }}
          />
        );
      })}

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 1: Intro with logo
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Tagline reveal
  const taglineOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AnimatedBackground variant="gradient" />

      {/* Logo */}
      <Glow color={COLORS.primary} intensity={30} pulsate pulseDuration={3}>
        <SupabaseLogo size={140} color={COLORS.primary} startFrame={5} />
      </Glow>

      {/* Brand name */}
      <div style={{ marginTop: 24 }}>
        <FadeInChars
          startFrom={30}
          stagger={0.06}
          duration={0.6}
          className="text-6xl font-bold tracking-tight"
          style={{ color: COLORS.text }}
        >
          supabase
        </FadeInChars>
      </div>

      {/* Tagline */}
      <div style={{ marginTop: 20, opacity: taglineOpacity }}>
        <FadeInWords
          startFrom={60}
          stagger={0.12}
          className="text-2xl font-medium"
          style={{ color: COLORS.textMuted }}
        >
          Build in a weekend. Scale to millions.
        </FadeInWords>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Problem/Hook
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
      }}
    >
      <AnimatedBackground />

      <div className="text-center max-w-4xl">
        <FadeInWords
          startFrom={10}
          stagger={0.15}
          className="text-5xl font-bold leading-tight text-balance"
          style={{ color: COLORS.text }}
        >
          Stop wrestling with infrastructure
        </FadeInWords>

        <div style={{ marginTop: 32 }}>
          <BlurReveal
            startFrom={50}
            stagger={0.05}
            className="text-2xl"
            style={{ color: COLORS.textMuted }}
          >
            Start building what matters
          </BlurReveal>
        </div>

        {/* Animated line */}
        <div
          style={{
            marginTop: 48,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.primary}, transparent)`,
            width: interpolate(frame, [70, 100], [0, 400], {
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }),
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Features showcase
const FeaturesScene: React.FC = () => {
  const features = [
    {
      icon: "https://api.iconify.design/solar/database-bold.svg?color=%233ECF8E&width=40",
      title: "Instant Postgres",
      description: "Dedicated database in seconds, not hours",
    },
    {
      icon: "https://api.iconify.design/solar/shield-keyhole-bold.svg?color=%233ECF8E&width=40",
      title: "Built-in Auth",
      description: "Secure authentication out of the box",
    },
    {
      icon: "https://api.iconify.design/solar/bolt-bold.svg?color=%233ECF8E&width=40",
      title: "Realtime APIs",
      description: "Live subscriptions & edge functions",
    },
  ];

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
      }}
    >
      <AnimatedBackground />

      {/* Section title */}
      <div style={{ marginBottom: 48 }}>
        <FadeInWords
          startFrom={10}
          stagger={0.12}
          className="text-4xl font-bold"
          style={{ color: COLORS.text }}
        >
          Everything you need
        </FadeInWords>
      </div>

      {/* Feature cards */}
      <div
        style={{
          display: "flex",
          gap: 32,
          justifyContent: "center",
        }}
      >
        {features.map((feature, i) => (
          <FeatureCard
            key={i}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            startFrame={40}
            index={i}
            accentColor={COLORS.primary}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Stats scene
const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: 1000000, suffix: "+", label: "Developers" },
    { value: 500000, suffix: "+", label: "Databases" },
    { value: 99.99, suffix: "%", label: "Uptime", decimals: 2 },
  ];

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
      }}
    >
      <AnimatedBackground variant="gradient" />

      <div style={{ marginBottom: 48 }}>
        <FadeInWords
          startFrom={10}
          stagger={0.12}
          className="text-4xl font-bold"
          style={{ color: COLORS.text }}
        >
          Trusted at scale
        </FadeInWords>
      </div>

      <div
        style={{
          display: "flex",
          gap: 80,
          justifyContent: "center",
        }}
      >
        {stats.map((stat, i) => {
          const staggerDelay = i * 15;
          const opacity = interpolate(
            frame,
            [30 + staggerDelay, 50 + staggerDelay],
            [0, 1],
            { extrapolateRight: "clamp" }
          );
          const scale = spring({
            frame: Math.max(0, frame - 30 - staggerDelay),
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `scale(${scale})`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  color: COLORS.primary,
                  lineHeight: 1,
                }}
              >
                <Counter
                  from={0}
                  to={stat.value}
                  duration={2}
                  delay={0.5 + i * 0.3}
                  decimals={stat.decimals || 0}
                  suffix={stat.suffix}
                  abbreviate={stat.value >= 10000}
                  ease="smooth"
                />
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: COLORS.textMuted,
                  marginTop: 8,
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Enterprise clients
const ClientsScene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
      }}
    >
      <AnimatedBackground />

      <div style={{ marginBottom: 48 }}>
        <FadeInWords
          startFrom={10}
          stagger={0.12}
          className="text-3xl font-semibold"
          style={{ color: COLORS.textMuted }}
        >
          Trusted by industry leaders
        </FadeInWords>
      </div>

      <div
        style={{
          display: "flex",
          gap: 48,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {["Mozilla", "GitHub", "1Password"].map((name, i) => (
          <ClientLogo key={name} name={name} startFrame={40} index={i} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: CTA / Closing
const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Button animation
  const buttonScale = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  const buttonGlow = interpolate(
    Math.sin((frame / fps) * 4),
    [-1, 1],
    [20, 40]
  );

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
      }}
    >
      <AnimatedBackground variant="gradient" />

      {/* Logo */}
      <Glow color={COLORS.primary} intensity={25} pulsate>
        <SupabaseLogo size={100} color={COLORS.primary} startFrame={5} />
      </Glow>

      <div style={{ marginTop: 32 }}>
        <FadeInWords
          startFrom={25}
          stagger={0.12}
          className="text-5xl font-bold text-center text-balance"
          style={{ color: COLORS.text }}
        >
          Start building today
        </FadeInWords>
      </div>

      <div style={{ marginTop: 16 }}>
        <BlurReveal
          startFrom={55}
          stagger={0.04}
          className="text-xl"
          style={{ color: COLORS.textMuted }}
        >
          Free tier • No credit card required
        </BlurReveal>
      </div>

      {/* CTA Button */}
      <div
        style={{
          marginTop: 40,
          transform: `scale(${buttonScale})`,
          opacity: interpolate(frame, [75, 90], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            padding: "16px 48px",
            background: COLORS.primary,
            borderRadius: 12,
            fontSize: 20,
            fontWeight: 700,
            color: COLORS.dark,
            boxShadow: `0 0 ${buttonGlow}px ${COLORS.primary}80`,
          }}
        >
          supabase.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main composition
export const Main: React.FC = () => {
  // Scene durations in frames (slowed down for better pacing)
  const INTRO_DURATION = 150; // 5s - logo + name + tagline needs time
  const PROBLEM_DURATION = 120; // 4s - headline + subhead + line animation
  const FEATURES_DURATION = 180; // 6s - title + 3 cards with stagger
  const STATS_DURATION = 150; // 5s - title + counters need time to animate
  const CLIENTS_DURATION = 120; // 4s - title + 3 logos with stagger
  const CLOSING_DURATION = 150; // 5s - logo + text + button reveal

  const TRANSITION_DURATION = 20;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={INTRO_DURATION}>
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={blurDissolve()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        <TransitionSeries.Sequence durationInFrames={PROBLEM_DURATION}>
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={blurDissolve()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        <TransitionSeries.Sequence durationInFrames={FEATURES_DURATION}>
          <FeaturesScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={blurDissolve()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        <TransitionSeries.Sequence durationInFrames={STATS_DURATION}>
          <StatsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={blurDissolve()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        <TransitionSeries.Sequence durationInFrames={CLIENTS_DURATION}>
          <ClientsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={blurDissolve()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        <TransitionSeries.Sequence durationInFrames={CLOSING_DURATION}>
          <ClosingScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
