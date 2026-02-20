"use client";

import * as React from "react";

type Pt = { x: number; y: number };

type Slot = {
  /** Four corners in order: top-left, top-right, bottom-right, bottom-left */
  pts: [Pt, Pt, Pt, Pt];
  /** Corner radius in px */
  r: number;
  /** Rotation degrees around the slot center */
  rot: number;
  /** Optional label for debug */
  label?: string;
};

type Props = {
  slot1Src: string;
  slot2Src: string;
  slot3Src: string;

  className?: string;

  backgroundColor?: string;
  accentColor?: string;

  alt?: {
    slot1?: string;
    slot2?: string;
    slot3?: string;
  };

  /** Turn on outlines + corner dots + labels */
  debug?: boolean;

  /** Optional override for slots (if you want to tune from caller) */
  slots?: Partial<{
    slot1: Partial<Slot>;
    slot2: Partial<Slot>;
    slot3: Partial<Slot>;
  }>;

  /** Optional override for dot pattern position and styling */
  dots?: Partial<{
    x: number;
    y: number;
    cols: number;
    rows: number;
    size: number;
    gap: number;
    opacity: number;
  }>;

  /** Variant layout - different arrangements of the three slots */
  variant?: 'default' | 'variant1' | 'variant2' | 'variant3' | 'variant4';
};

/**
 * Build a rounded-corner path for a convex quad (4 points).
 * Uses SVG arc commands. Assumes pts are ordered TL, TR, BR, BL and convex.
 */
function roundedQuadPath(pts: [Pt, Pt, Pt, Pt], radius: number) {
  const r = Math.max(0, radius);

  const sub = (a: Pt, b: Pt) => ({ x: a.x - b.x, y: a.y - b.y });
  const add = (a: Pt, b: Pt) => ({ x: a.x + b.x, y: a.y + b.y });
  const mul = (a: Pt, s: number) => ({ x: a.x * s, y: a.y * s });
  const len = (v: Pt) => Math.hypot(v.x, v.y);
  const norm = (v: Pt) => {
    const l = len(v) || 1;
    return { x: v.x / l, y: v.y / l };
  };

  const n = 4;
  const entry: Pt[] = [];
  const exit: Pt[] = [];
  const rr: number[] = [];

  for (let i = 0; i < n; i++) {
    const pPrev = pts[(i + n - 1) % n];
    const p = pts[i];
    const pNext = pts[(i + 1) % n];

    const vIn = norm(sub(pPrev, p));
    const vOut = norm(sub(pNext, p));

    const dIn = len(sub(pPrev, p));
    const dOut = len(sub(pNext, p));

    // Clamp per-corner radius so we don't overshoot short edges
    const rCorner = Math.min(r, dIn * 0.45, dOut * 0.45);
    rr[i] = rCorner;

    entry[i] = add(p, mul(vIn, rCorner));
    exit[i] = add(p, mul(vOut, rCorner));
  }

  let d = `M ${exit[0].x} ${exit[0].y}`;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    d += ` L ${entry[j].x} ${entry[j].y}`;
    // Arc around the corner to its exit point.
    // Using per-corner radius (rr[j]) gives more stable rounding on varied quads.
    d += ` A ${rr[j]} ${rr[j]} 0 0 1 ${exit[j].x} ${exit[j].y}`;
  }

  d += " Z";
  return d;
}

function bboxCenter(pts: [Pt, Pt, Pt, Pt]) {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs);
  const minY = Math.min(...ys),
    maxY = Math.max(...ys);
  return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
}

function bboxRect(pts: [Pt, Pt, Pt, Pt]) {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs);
  const minY = Math.min(...ys),
    maxY = Math.max(...ys);
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/** Rotate point p by deg degrees around center (cx, cy) */
function rotatePoint(p: Pt, deg: number, cx: number, cy: number): Pt {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = p.x - cx;
  const dy = p.y - cy;
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  };
}

// Variant configurations - different layouts with parallel edges where slots meet
const VARIANTS = {
  default: {
    slot1: {
      label: "1",
      pts: [
        { x: 155, y: -40 },
        { x: 1095, y: 60 },
        { x: 1030, y: 640 },
        { x: 85, y: 620 },
      ],
      r: 90,
      rot: -6.2,
    },
    slot2: {
      label: "2",
      pts: [
        { x: 115, y: 750 },
        { x: 1055, y: 650 },
        { x: 1070, y: 1570 },
        { x: 130, y: 1595 },
      ],
      r: 70,
      rot: 1,
    },
    slot3: {
      label: "3",
      pts: [
        { x: 1105, y: 120 },
        { x: 2045, y: 220 },
        { x: 2085, y: 1460 },
        { x: 1150, y: 1495 },
      ],
      r: 110,
      rot: 2.0,
    },
  },
  // Variant 1: 2 slots on top side by side, 1 large slot on bottom
  // Bottom edges of slot1 and slot2 align with top edge of slot3
  variant1: {
    slot1: {
      label: "1",
      pts: [
        { x: 35, y: 20 },
        { x: 985, y: 50 },
        { x: 965, y: 750 },
        { x: 15, y: 730 },
      ],
      r: 85,
      rot: -0.8,
    },
    slot2: {
      label: "2",
      pts: [
        { x: 1005, y: 20 },
        { x: 1995, y: 50 },
        { x: 1975, y: 750 },
        { x: 985, y: 730 },
      ],
      r: 85,
      rot: -0.8,
    },
    slot3: {
      label: "3",
      pts: [
        { x: 15, y: 750 },   // Aligns with slot1 bottom-left, parallel to slot1 bottom edge
        { x: 1975, y: 780 }, // Aligns with slot2 bottom-right, parallel to slot2 bottom edge
        { x: 1955, y: 1570 },
        { x: 5, y: 1590 },
      ],
      r: 100,
      rot: -0.8,
    },
  },
  // Variant 2: 1 large slot on left, 2 slots stacked on right
  // Right edge of slot1 aligns with left edges of slot2 and slot3 where they meet
  variant2: {
    slot1: {
      label: "1",
      pts: [
        { x: 35, y: 30 },
        { x: 1005, y: 50 },
        { x: 985, y: 1560 },
        { x: 15, y: 1580 },
      ],
      r: 90,
      rot: 0.5,
    },
    slot2: {
      label: "2",
      pts: [
        { x: 1005, y: 30 },  // Aligns with slot1 top-right, parallel to slot1 right edge
        { x: 2015, y: 80 },
        { x: 1995, y: 800 },
        { x: 985, y: 780 },  // Parallel to slot1 right edge
      ],
      r: 85,
      rot: 0.5,
    },
    slot3: {
      label: "3",
      pts: [
        { x: 1005, y: 850 },  // Aligns with slot1 bottom-right area, parallel to slot1 right edge
        { x: 2015, y: 900 },
        { x: 1995, y: 1570 },
        { x: 985, y: 1550 },  // Parallel to slot1 right edge
      ],
      r: 85,
      rot: 0.5,
    },
  },
  // Variant 3: 2 slots on left side by side, 1 large slot on right
  // Right edges of slot1 and slot2 align with left edge of slot3 where they meet
  variant3: {
    slot1: {
      label: "1",
      pts: [
        { x: 35, y: 30 },
        { x: 985, y: 60 },
        { x: 965, y: 780 },
        { x: 15, y: 760 },
      ],
      r: 85,
      rot: 0.8,
    },
    slot2: {
      label: "2",
      pts: [
        { x: 35, y: 830 },
        { x: 985, y: 860 },
        { x: 965, y: 1570 },
        { x: 15, y: 1550 },
      ],
      r: 85,
      rot: 0.8,
    },
    slot3: {
      label: "3",
      pts: [
        { x: 985, y: 30 },   // Aligns with slot1 top-right, parallel to slot1 right edge
        { x: 2015, y: 60 },
        { x: 1995, y: 1570 },
        { x: 965, y: 1550 },  // Aligns with slot2 bottom-right, parallel to slot2 right edge
      ],
      r: 100,
      rot: 0.8,
    },
  },
  // Variant 4: 1 large slot on top spanning most width, 2 smaller slots on bottom side by side
  // Bottom edge of slot1 aligns with top edges of slot2 and slot3 where they meet
  variant4: {
    slot1: {
      label: "1",
      pts: [
        { x: 45, y: 20 },
        { x: 1955, y: 50 },
        { x: 1935, y: 750 },
        { x: 25, y: 730 },
      ],
      r: 95,
      rot: -0.8,
    },
    slot2: {
      label: "2",
      pts: [
        { x: 25, y: 750 },   // Aligns with slot1 bottom-left, parallel to slot1 bottom edge
        { x: 955, y: 780 },   // Parallel to slot1 bottom edge
        { x: 935, y: 1570 },
        { x: 5, y: 1590 },
      ],
      r: 85,
      rot: -0.8,
    },
    slot3: {
      label: "3",
      pts: [
        { x: 985, y: 750 },  // Aligns with slot1 bottom-right area, parallel to slot1 bottom edge
        { x: 1935, y: 780 }, // Parallel to slot1 bottom edge
        { x: 1915, y: 1570 },
        { x: 965, y: 1590 },
      ],
      r: 85,
      rot: -0.8,
    },
  },
};

export function ImageCollage({
  slot1Src,
  slot2Src,
  slot3Src,
  className,
  accentColor = "#F97315",
  alt,
  debug = false,
  slots,
  dots,
  variant = 'default',
}: Props) {
  const uid = React.useId().replace(/:/g, "");

  // Native template canvas (adjust if your template PNG uses a different size)
  // Expanded to accommodate points that extend beyond (e.g., slot3 x: 2065)
  const VB_W = 2100;
  const VB_H = 1620;

  // Get variant configuration
  const variantConfig = VARIANTS[variant];
  
  const baseSlot1: Slot = variantConfig.slot1 as Slot;
  const baseSlot2: Slot = variantConfig.slot2 as Slot;
  const baseSlot3: Slot = variantConfig.slot3 as Slot;

  // Allow caller overrides for live tuning
  const slot1: Slot = {
    ...baseSlot1,
    ...(slots?.slot1 as any),
    pts: (slots?.slot1?.pts ?? baseSlot1.pts) as [Pt, Pt, Pt, Pt],
    r: slots?.slot1?.r ?? baseSlot1.r,
    rot: slots?.slot1?.rot ?? baseSlot1.rot,
    label: slots?.slot1?.label ?? baseSlot1.label,
  };

  const slot2: Slot = {
    ...baseSlot2,
    ...(slots?.slot2 as any),
    pts: (slots?.slot2?.pts ?? baseSlot2.pts) as [Pt, Pt, Pt, Pt],
    r: slots?.slot2?.r ?? baseSlot2.r,
    rot: slots?.slot2?.rot ?? baseSlot2.rot,
    label: slots?.slot2?.label ?? baseSlot2.label,
  };

  const slot3: Slot = {
    ...baseSlot3,
    ...(slots?.slot3 as any),
    pts: (slots?.slot3?.pts ?? baseSlot3.pts) as [Pt, Pt, Pt, Pt],
    r: slots?.slot3?.r ?? baseSlot3.r,
    rot: slots?.slot3?.rot ?? baseSlot3.rot,
    label: slots?.slot3?.label ?? baseSlot3.label,
  };

  // Dot grid placement
  const defaultDOT = { x: 0, y: 950, cols: 3, rows: 12, size: 12, gap: 40, opacity: 0.95 };
  const DOT = { ...defaultDOT, ...dots };

  const clip = {
    slot1: `clip-slot1-${uid}`,
    slot2: `clip-slot2-${uid}`,
    slot3: `clip-slot3-${uid}`,
  };

  const cSlot1 = bboxCenter(slot1.pts);
  const cSlot2 = bboxCenter(slot2.pts);
  const cSlot3 = bboxCenter(slot3.pts);

  // Rotate slot points into global space so clip path has correct appearance and image stays axis-aligned
  const rotPts1 = slot1.pts.map((p) => rotatePoint(p, slot1.rot, cSlot1.cx, cSlot1.cy)) as [Pt, Pt, Pt, Pt];
  const rotPts2 = slot2.pts.map((p) => rotatePoint(p, slot2.rot, cSlot2.cx, cSlot2.cy)) as [Pt, Pt, Pt, Pt];
  const rotPts3 = slot3.pts.map((p) => rotatePoint(p, slot3.rot, cSlot3.cx, cSlot3.cy)) as [Pt, Pt, Pt, Pt];

  const dSlot1 = roundedQuadPath(rotPts1, slot1.r);
  const dSlot2 = roundedQuadPath(rotPts2, slot2.r);
  const dSlot3 = roundedQuadPath(rotPts3, slot3.r);

  const bbox1 = bboxRect(rotPts1);
  const bbox2 = bboxRect(rotPts2);
  const bbox3 = bboxRect(rotPts3);

  const DebugShape = ({
    d,
    pts,
    center,
    label,
    stroke,
  }: {
    d: string;
    pts: [Pt, Pt, Pt, Pt];
    center: { cx: number; cy: number };
    label: string;
    stroke: string;
  }) => (
    <g pointerEvents="none">
      {/* Outline of the rounded quad (path and points are already in global space) */}
      <path d={d} fill="none" stroke={stroke} strokeWidth={6} />

      {/* Corner points */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={10} fill={stroke} />
          <text
            x={p.x + 14}
            y={p.y - 14}
            fontSize={34}
            fill={stroke}
            fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
          >
            {i}
          </text>
        </g>
      ))}

      {/* Center + label */}
      <circle cx={center.cx} cy={center.cy} r={10} fill={stroke} />
      <text
        x={center.cx + 14}
        y={center.cy + 44}
        fontSize={44}
        fill={stroke}
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
      >
        {label}
      </text>
    </g>
  );

  return (
    <svg
      className={className}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      height="auto"
      role="img"
      aria-label="Collage template"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <clipPath id={clip.slot1} clipPathUnits="userSpaceOnUse">
          <path d={dSlot1} />
        </clipPath>
        <clipPath id={clip.slot2} clipPathUnits="userSpaceOnUse">
          <path d={dSlot2} />
        </clipPath>
        <clipPath id={clip.slot3} clipPathUnits="userSpaceOnUse">
          <path d={dSlot3} />
        </clipPath>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width={VB_W} height={VB_H} fill="transparent" />

      {/* Dot pattern */}
      <g opacity={DOT.opacity}>
        {Array.from({ length: DOT.rows }).map((_, row) =>
          Array.from({ length: DOT.cols }).map((__, col) => (
            <circle
              key={`${row}-${col}`}
              cx={DOT.x + col * DOT.gap + DOT.size / 2}
              cy={DOT.y + row * DOT.gap + DOT.size / 2}
              r={DOT.size / 2}
              fill={accentColor}
            />
          ))
        )}
      </g>

      {/* SLOT 1 */}
      {!debug && (
        <g clipPath={`url(#${clip.slot1})`}>
          <image
            href={slot1Src}
            xlinkHref={slot1Src}
            x={bbox1.x}
            y={bbox1.y}
            width={bbox1.width}
            height={bbox1.height}
            preserveAspectRatio="xMidYMid slice"
          >
            {alt?.slot1 ? <title>{alt.slot1}</title> : null}
          </image>
        </g>
      )}

      {/* SLOT 2 */}
      {!debug && (
        <g clipPath={`url(#${clip.slot2})`}>
          <image
            href={slot2Src}
            xlinkHref={slot2Src}
            x={bbox2.x}
            y={bbox2.y}
            width={bbox2.width}
            height={bbox2.height}
            preserveAspectRatio="xMidYMid slice"
          >
            {alt?.slot2 ? <title>{alt.slot2}</title> : null}
          </image>
        </g>
      )}

      {/* SLOT 3 */}
      {!debug && (
        <g clipPath={`url(#${clip.slot3})`}>
          <image
            href={slot3Src}
            xlinkHref={slot3Src}
            x={bbox3.x}
            y={bbox3.y}
            width={bbox3.width}
            height={bbox3.height}
            preserveAspectRatio="xMidYMid slice"
          >
            {alt?.slot3 ? <title>{alt.slot3}</title> : null}
          </image>
        </g>
      )}

      {/* DEBUG OVERLAY */}
      {debug ? (
        <>
          <DebugShape d={dSlot1} pts={rotPts1} center={bboxCenter(rotPts1)} label={slot1.label ?? "1"} stroke="#00FF66" />
          <DebugShape d={dSlot2} pts={rotPts2} center={bboxCenter(rotPts2)} label={slot2.label ?? "2"} stroke="#00B7FF" />
          <DebugShape d={dSlot3} pts={rotPts3} center={bboxCenter(rotPts3)} label={slot3.label ?? "3"} stroke="#FF5FD1" />

          {/* show dot-grid bounds */}
          <rect
            x={DOT.x - 10}
            y={DOT.y - 10}
            width={(DOT.cols - 1) * DOT.gap + DOT.size + 20}
            height={(DOT.rows - 1) * DOT.gap + DOT.size + 20}
            fill="none"
            stroke="#FFD400"
            strokeWidth={5}
            strokeDasharray="18 12"
            pointerEvents="none"
          />
        </>
      ) : null}
    </svg>
  );
}