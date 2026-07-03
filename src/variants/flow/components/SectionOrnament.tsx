import { useId, type ReactNode } from "react";

export type OrnamentVariant =
  | "diagonal"
  | "chevron"
  | "vertical"
  | "diamond"
  | "ladder";

type SectionOrnamentProps = {
  variant?: OrnamentVariant;
  index?: number;
  side?: "left" | "right";
  className?: string;
};

type OrnamentWrapProps = {
  children: ReactNode;
  variant?: OrnamentVariant;
  index?: number;
  className?: string;
};

const VARIANTS: OrnamentVariant[] = [
  "diagonal",
  "chevron",
  "vertical",
  "diamond",
  "ladder",
];

const STROKE_MAIN = "color-mix(in srgb, var(--color-paper) 72%, var(--color-accent) 28%)";
const STROKE_SOFT = "color-mix(in srgb, var(--color-paper) 48%, transparent)";
const STROKE_ACCENT = "color-mix(in srgb, var(--color-paper) 55%, var(--color-accent) 45%)";

function pickVariant(index: number): OrnamentVariant {
  return VARIANTS[index % VARIANTS.length];
}

function pickSide(index: number): "left" | "right" {
  return index % 2 === 0 ? "right" : "left";
}

type PatternProps = {
  id: string;
  variant: OrnamentVariant;
};

function OrnamentPattern({ id, variant }: PatternProps) {
  switch (variant) {
    case "diagonal":
      return (
        <pattern
          id={id}
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-38)"
        >
          <line x1="0" y1="0" x2="0" y2="14" stroke={STROKE_MAIN} strokeWidth="0.9" opacity="0.85" />
          <line x1="7" y1="0" x2="7" y2="14" stroke={STROKE_SOFT} strokeWidth="0.65" opacity="0.55" />
        </pattern>
      );

    case "chevron":
      return (
        <pattern id={id} width="24" height="16" patternUnits="userSpaceOnUse">
          <path
            d="M0 8 L6 2 L12 8 L18 2 L24 8"
            fill="none"
            stroke={STROKE_MAIN}
            strokeWidth="1"
            opacity="0.8"
          />
          <path
            d="M0 14 L6 8 L12 14 L18 8 L24 14"
            fill="none"
            stroke={STROKE_SOFT}
            strokeWidth="0.65"
            opacity="0.5"
          />
        </pattern>
      );

    case "vertical":
      return (
        <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
          <line x1="2" y1="0" x2="2" y2="10" stroke={STROKE_MAIN} strokeWidth="0.75" opacity="0.75" />
          <line x1="7" y1="0" x2="7" y2="10" stroke={STROKE_SOFT} strokeWidth="0.5" opacity="0.45" />
        </pattern>
      );

    case "diamond":
      return (
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M10 0 L20 10 L10 20 L0 10 Z"
            fill="none"
            stroke={STROKE_MAIN}
            strokeWidth="0.75"
            opacity="0.65"
          />
          <path
            d="M10 5 L15 10 L10 15 L5 10 Z"
            fill="none"
            stroke={STROKE_SOFT}
            strokeWidth="0.55"
            opacity="0.4"
          />
        </pattern>
      );

    case "ladder":
      return (
        <pattern id={id} width="18" height="18" patternUnits="userSpaceOnUse">
          <line x1="0" y1="6" x2="18" y2="6" stroke={STROKE_MAIN} strokeWidth="0.7" opacity="0.7" />
          <line x1="0" y1="12" x2="18" y2="12" stroke={STROKE_SOFT} strokeWidth="0.55" opacity="0.45" />
          <line x1="6" y1="0" x2="6" y2="18" stroke={STROKE_ACCENT} strokeWidth="0.65" opacity="0.6" />
          <line x1="12" y1="0" x2="12" y2="18" stroke={STROKE_SOFT} strokeWidth="0.45" opacity="0.38" />
        </pattern>
      );
  }
}

function PatternPanel({
  patternId,
  variant,
  side,
  opacity = "opacity-[0.13] md:opacity-[0.16]",
}: {
  patternId: string;
  variant: OrnamentVariant;
  side: "left" | "right";
  opacity?: string;
}) {
  const sideClass =
    side === "right"
      ? "right-0 [mask-image:linear-gradient(to_left,black_38%,transparent_82%)]"
      : "left-0 [mask-image:linear-gradient(to_right,black_38%,transparent_82%)]";

  return (
    <svg
      className={`absolute top-0 h-full w-[min(62%,34rem)] ${opacity} ${sideClass}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <OrnamentPattern id={patternId} variant={variant} />
        <linearGradient id={`${patternId}-fade`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="50%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0.55" />
        </linearGradient>
        <mask id={`${patternId}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${patternId}-fade)`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} mask={`url(#${patternId}-mask)`} />
    </svg>
  );
}

function CornerAccent({ side }: { side: "left" | "right" }) {
  const mirror = side === "left" ? "scale-x-[-1]" : "";
  return (
    <svg
      viewBox="0 0 120 120"
      className={`absolute top-6 h-32 w-32 opacity-[0.28] md:top-10 md:h-40 md:w-40 md:opacity-[0.34] ${mirror} ${
        side === "right" ? "right-4 md:right-10" : "left-4 md:left-10"
      }`}
      aria-hidden
    >
      <path
        d="M0 0 H120 V8 H8 V120 H0 Z"
        fill="none"
        stroke={STROKE_MAIN}
        strokeWidth="1.2"
      />
      <path
        d="M16 16 H104 V22 H22 V104 H16 Z"
        fill="none"
        stroke={STROKE_ACCENT}
        strokeWidth="0.75"
        opacity="0.75"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={24 + i * 10}
          y1="0"
          x2={24 + i * 10}
          y2={42 - i * 5}
          stroke={STROKE_SOFT}
          strokeWidth="0.65"
          opacity={0.55 - i * 0.07}
        />
      ))}
    </svg>
  );
}

function EdgeStripes({ side }: { side: "left" | "right" }) {
  return (
    <svg
      className={`absolute bottom-0 h-28 w-48 opacity-[0.18] md:h-36 md:w-64 md:opacity-[0.22] ${
        side === "right" ? "left-2 md:left-10" : "right-2 md:right-10"
      }`}
      viewBox="0 0 160 96"
      preserveAspectRatio="none"
      aria-hidden
    >
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line
          key={i}
          x1={i * 24}
          y1="96"
          x2={i * 24 + 52}
          y2="0"
          stroke={STROKE_MAIN}
          strokeWidth="0.85"
          opacity={0.45 + (i % 2) * 0.2}
        />
      ))}
    </svg>
  );
}

function HorizontalBand({ position }: { position: "top" | "bottom" }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-x-0 h-16 opacity-[0.14] md:h-20 md:opacity-[0.18] ${
        position === "top" ? "top-0" : "bottom-0"
      }`}
      viewBox="0 0 400 64"
      preserveAspectRatio="none"
      aria-hidden
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <line
          key={i}
          x1={i * 42}
          y1={position === "top" ? "0" : "64"}
          x2={i * 42 + 28}
          y2={position === "top" ? "64" : "0"}
          stroke={STROKE_SOFT}
          strokeWidth="0.7"
          opacity={0.35 + (i % 3) * 0.12}
        />
      ))}
    </svg>
  );
}

export function SectionOrnament({
  variant,
  index = 0,
  side,
  className = "",
}: SectionOrnamentProps) {
  const uid = useId();
  const base = uid.replace(/:/g, "");
  const resolvedVariant = variant ?? pickVariant(index);
  const resolvedSide = side ?? pickSide(index);
  const oppositeSide = resolvedSide === "right" ? "left" : "right";

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <PatternPanel
        patternId={`${base}-main`}
        variant={resolvedVariant}
        side={resolvedSide}
      />
      <PatternPanel
        patternId={`${base}-alt`}
        variant={VARIANTS[(VARIANTS.indexOf(resolvedVariant) + 2) % VARIANTS.length]}
        side={oppositeSide}
        opacity="opacity-[0.08] md:opacity-[0.1]"
      />

      <HorizontalBand position="top" />
      <HorizontalBand position="bottom" />
      <CornerAccent side={resolvedSide} />
      <CornerAccent side={oppositeSide} />
      <EdgeStripes side={resolvedSide} />
    </div>
  );
}

function FrameCorner({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const posClass = {
    tl: "left-0 top-0",
    tr: "right-0 top-0 scale-x-[-1]",
    bl: "bottom-0 left-0 scale-y-[-1]",
    br: "bottom-0 right-0 scale-x-[-1] scale-y-[-1]",
  }[position];

  return (
    <svg
      viewBox="0 0 72 72"
      className={`absolute h-14 w-14 opacity-[0.42] md:h-[4.5rem] md:w-[4.5rem] md:opacity-[0.5] ${posClass}`}
      aria-hidden
    >
      <path
        d="M0 0 H72 V6 H6 V72 H0 Z"
        fill="none"
        stroke={STROKE_MAIN}
        strokeWidth="1.1"
      />
      <path
        d="M10 10 H62 V14 H14 V62 H10 Z"
        fill="none"
        stroke={STROKE_ACCENT}
        strokeWidth="0.65"
        opacity="0.8"
      />
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={18 + i * 8}
          y1="0"
          x2={18 + i * 8}
          y2={22 - i * 4}
          stroke={STROKE_SOFT}
          strokeWidth="0.55"
          opacity={0.65 - i * 0.12}
        />
      ))}
    </svg>
  );
}

function FrameEdgeStripes({ edge }: { edge: "top" | "bottom" | "left" | "right" }) {
  const isHorizontal = edge === "top" || edge === "bottom";
  const posClass = {
    top: "left-8 right-8 top-0 h-3 md:left-12 md:right-12",
    bottom: "bottom-0 left-8 right-8 h-3 md:left-12 md:right-12",
    left: "bottom-8 left-0 top-8 w-3 md:bottom-12 md:top-12",
    right: "bottom-8 right-0 top-8 w-3 md:bottom-12 md:top-12",
  }[edge];

  return (
    <svg
      className={`absolute opacity-[0.32] md:opacity-[0.38] ${posClass}`}
      viewBox={isHorizontal ? "0 0 200 12" : "0 0 12 200"}
      preserveAspectRatio="none"
      aria-hidden
    >
      {isHorizontal
        ? [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <line
              key={i}
              x1={i * 24}
              y1="0"
              x2={i * 24 + 14}
              y2="12"
              stroke={STROKE_MAIN}
              strokeWidth="0.75"
              opacity={0.5 + (i % 2) * 0.25}
            />
          ))
        : [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <line
              key={i}
              x1="0"
              y1={i * 24}
              x2="12"
              y2={i * 24 + 14}
              stroke={STROKE_MAIN}
              strokeWidth="0.75"
              opacity={0.5 + (i % 2) * 0.25}
            />
          ))}
    </svg>
  );
}

/** Обрамление вокруг блока с фото или текстом */
export function OrnamentWrap({
  children,
  variant,
  index = 0,
  className = "",
}: OrnamentWrapProps) {
  const uid = useId();
  const base = uid.replace(/:/g, "");
  const resolvedVariant = variant ?? pickVariant(index);

  return (
    <div className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute -inset-3 md:-inset-5"
        aria-hidden
      >
        <FrameCorner position="tl" />
        <FrameCorner position="tr" />
        <FrameCorner position="bl" />
        <FrameCorner position="br" />
        <FrameEdgeStripes edge="top" />
        <FrameEdgeStripes edge="bottom" />
        <FrameEdgeStripes edge="left" />
        <FrameEdgeStripes edge="right" />

        <svg
          className="absolute inset-0 opacity-[0.1] md:opacity-[0.13]"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <OrnamentPattern id={`${base}-wrap`} variant={resolvedVariant} />
          </defs>
          <rect width="100%" height="100%" fill={`url(#${base}-wrap)`} />
        </svg>
      </div>
      {children}
    </div>
  );
}
