"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

/* ──────────────────────── Types ──────────────────────── */

interface Venue {
  name: string;
  attending: number;   // 오늘 출근
  available: number;   // 초이스 가능
  waiting: number;     // 웨이팅 팀 수 (0이면 웨이팅 없음)
}

type BarMode = "attending" | "available" | "waiting";

/* ──────────────────────── Data ──────────────────────── */

const VENUES: Venue[] = [
  { name: "도파민",           attending: 31, available: 18, waiting: 0 },
  { name: "유앤미",           attending: 42, available: 27, waiting: 5 },
  { name: "사라있네(엘리트)", attending: 63, available: 41, waiting: 12 },
  { name: "달토",             attending: 22, available: 14, waiting: 3 },
];

/* ──────────────────────── Animated Counter ──────────────────────── */

function AnimatedCounter({
  target,
  duration = 1400,
  className,
}: {
  target: number;
  duration?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    setCount(0);
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return <span className={className}>{count.toLocaleString()}</span>;
}

/* ──────────────────────── Bar Row ──────────────────────── */

function VenueBar({
  venue,
  rank,
  mode,
  maxValue,
  delay,
  onClick,
}: {
  venue: Venue;
  rank: number;
  mode: BarMode;
  maxValue: number;
  delay: number;
  onClick?: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), delay + 80);
    return () => clearTimeout(t);
  }, [mode, delay]);

  const value =
    mode === "attending" ? venue.attending
    : mode === "available" ? venue.available
    : venue.waiting;

  const isWaitingMode = mode === "waiting";
  const hasNoWaiting = isWaitingMode && venue.waiting === 0;
  const hasWaiting = isWaitingMode && venue.waiting > 0;

  const pct = isWaitingMode ? 100 : (maxValue > 0 ? (value / maxValue) * 100 : 0);
  const isTop = rank === 0 && !isWaitingMode;

  const rankColors = [
    "from-[#d4a94a] to-[#f5e6c8]",  // 1위 — gold
    "from-[#a0a0c0] to-[#d0d0e8]",  // 2위 — silver
    "from-[#b87333] to-[#e8a87c]",  // 3위 — bronze
    "from-[#6b7280] to-[#9ca3af]",  // 4위 — grey
  ];

  const barColor = isWaitingMode
    ? (hasNoWaiting ? "from-[#22c55e] to-[#4ade80]" : "from-[#ef4444] to-[#f87171]")
    : (rankColors[rank] ?? rankColors[3]);

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col gap-2 rounded-2xl p-5 transition-all duration-300 cursor-pointer hover:scale-[1.01] active:scale-[0.99]",
        "glass-card hover:border-[rgba(212,169,74,0.2)] hover:shadow-[0_0_30px_rgba(212,169,74,0.06)]",
        isTop && "ring-1 ring-[rgba(212,169,74,0.18)]",
        hasNoWaiting && "ring-1 ring-[rgba(34,197,94,0.25)]",
        hasWaiting && "ring-1 ring-[rgba(239,68,68,0.25)]"
      )}
    >
      {/* Name row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Rank badge */}
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold",
              isTop
                ? "bg-gradient-to-br from-[#d4a94a] to-[#f5e6c8] text-black"
                : hasNoWaiting
                ? "bg-gradient-to-br from-[#22c55e] to-[#4ade80] text-black"
                : hasWaiting
                ? "bg-gradient-to-br from-[#ef4444] to-[#f87171] text-white"
                : "bg-white/5 text-white/40"
            )}
          >
            {isWaitingMode ? "-" : rank + 1}
          </span>

          <span className={cn(
            "text-base font-semibold",
            isTop ? "text-gold-100" : "text-white/75"
          )}>
            {venue.name}
          </span>

          {/* Badge */}
          {isTop && (
            <span className="rounded-full border border-gold-300/20 bg-gold-300/10 px-2 py-0.5 text-[10px] text-gold-300">
              TOP
            </span>
          )}
          {hasNoWaiting && (
            <span className="rounded-full border border-green-400/25 bg-green-400/10 px-2 py-0.5 text-[10px] text-green-400">
              입장 가능
            </span>
          )}
          {hasWaiting && (
            <span className="rounded-full border border-red-400/25 bg-red-400/10 px-2 py-0.5 text-[10px] text-red-400">
              웨이팅 중
            </span>
          )}
        </div>

        {/* Count */}
        <div className="text-right">
          {isWaitingMode ? (
            <span className={cn("text-xl font-bold", hasNoWaiting ? "text-green-400" : "text-red-400")}>
              {hasNoWaiting ? "가능" : "대기"}
            </span>
          ) : (
            <>
              <span className={cn(
                "text-2xl font-bold tabular-nums",
                isTop ? "gold-shimmer" : "text-white/70"
              )}>
                {value}
              </span>
              <span className="ml-0.5 text-xs text-white/35">명</span>
            </>
          )}
        </div>
      </div>

      {/* Bar track */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/5">
        {isTop && (
          <div
            className={cn("absolute inset-0 rounded-full bg-gradient-to-r opacity-20", barColor)}
          />
        )}
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all", barColor)}
          style={{
            width: mounted ? `${pct}%` : "0%",
            transitionDuration: "1000ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      {/* Sub stats */}
      <div className="flex flex-wrap items-center gap-4 pt-0.5 text-xs text-white/35">
        <span>출근 <span className="text-white/55">{venue.attending}명</span></span>
        <span>초이스 가능 <span className="text-white/55">{venue.available}명</span></span>
        <span>
          웨이팅{" "}
          <span className={isWaitingMode ? (hasNoWaiting ? "text-green-400" : "text-red-400") : "text-white/55"}>
            {venue.waiting === 0 ? "없음" : "있음"}
          </span>
        </span>
      </div>
    </div>
  );
}

/* ──────────────────────── Mode Tab ──────────────────────── */

function ModeTab({
  label,
  active,
  onClick,
  accent,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accent?: "gold" | "green";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
        active && accent === "green"
          ? "bg-gradient-to-r from-green-500 to-green-400 text-black shadow-[0_0_16px_rgba(34,197,94,0.35)]"
          : active
          ? "bg-gradient-to-r from-gold-400 to-gold-300 text-black shadow-[0_0_16px_rgba(212,169,74,0.3)]"
          : "text-white/40 hover:text-white/70"
      )}
    >
      {label}
    </button>
  );
}

/* ──────────────────────── Main Component ──────────────────────── */

interface AttendanceBoardProps {
  onSelectVenue?: (venueName: string) => void;
}

export const AttendanceBoard = ({ onSelectVenue }: AttendanceBoardProps) => {
  const [mode, setMode] = useState<BarMode>("attending");

  const sorted = [...VENUES].sort((a, b) => {
    if (mode === "waiting") {
      // 웨이팅 모드: 웨이팅 없는 업소(0)가 상단
      if (a.waiting === 0 && b.waiting > 0) return -1;
      if (b.waiting === 0 && a.waiting > 0) return 1;
      return 0; // 웨이팅 유무로만 정렬
    }
    return b[mode] - a[mode];
  });

  const maxValue = Math.max(...sorted.map((v) =>
    mode === "attending" ? v.attending
    : mode === "available" ? v.available
    : v.waiting
  ));

  const displayValue =
    mode === "attending"
      ? VENUES.reduce((s, v) => s + v.attending, 0)
      : mode === "available"
      ? VENUES.reduce((s, v) => s + v.available, 0)
      : VENUES.filter((v) => v.waiting === 0).length;

  const displayLabel =
    mode === "attending"
      ? "서울권 주요 룸빵 총 출근 인원"
      : mode === "available"
      ? "서울권 주요 룸빵 총 초이스 가능"
      : "현재 바로 입장 가능한 업소";

  const isWaitingMode = mode === "waiting";

  return (
    <div className={cn("flex flex-col gap-6 w-full")}>

      {/* ── Total Big Number ── */}
      <div className="glass-card animate-fade-in-up flex flex-col items-center gap-3 rounded-3xl px-8 py-10 text-center">
        {/* Live dot */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-70",
              isWaitingMode ? "bg-green-400" : "bg-green-400"
            )} />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
          </span>
          <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
            LIVE · 실시간 현황
          </span>
        </div>

        {/* Huge number */}
        <div className="flex items-end gap-2">
          <AnimatedCounter
            key={mode}
            target={displayValue}
            duration={1200}
            className={cn(
              "text-[80px] font-black leading-none tabular-nums sm:text-[100px]",
              isWaitingMode && displayValue === 0 ? "text-green-400" : "gold-shimmer"
            )}
          />
          <span className="mb-3 text-2xl font-semibold text-gold-200/70 sm:text-3xl">
            {isWaitingMode ? "곳" : "명"}
          </span>
        </div>

        <p className="text-sm text-white/40">{displayLabel}</p>

        {/* 웨이팅 모드 추가 안내 */}
        {isWaitingMode && (
          <p className="text-xs text-white/30">
            웨이팅 없는 업소를 먼저 확인하고 빠르게 입장하세요
          </p>
        )}

        {/* Mode tabs */}
        <div className="mt-2 flex items-center gap-1 rounded-full border border-white/8 bg-white/4 p-1">
          <ModeTab
            label="출근 인원"
            active={mode === "attending"}
            onClick={() => setMode("attending")}
            accent="gold"
          />
          <ModeTab
            label="초이스 가능"
            active={mode === "available"}
            onClick={() => setMode("available")}
            accent="gold"
          />
          <ModeTab
            label="웨이팅 여부"
            active={mode === "waiting"}
            onClick={() => setMode("waiting")}
            accent="green"
          />
        </div>
      </div>

      {/* ── Bar Chart ── */}
      <div className="animate-fade-in-up animate-delay-200 flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-white/50">업소별 비교</h2>
          <span className="text-xs text-white/25">
            {isWaitingMode ? "상태별로 표시됩니다" : "높을수록 길어요"}
          </span>
        </div>
        {sorted.map((venue, i) => (
          <VenueBar
            key={venue.name}
            venue={venue}
            rank={i}
            mode={mode}
            maxValue={maxValue}
            delay={i * 100}
            onClick={() => onSelectVenue?.(venue.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default AttendanceBoard;
