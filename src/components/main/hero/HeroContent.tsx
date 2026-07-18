"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DASHBOARD_ROUTE } from "@/lib/auth";

/* ───────────────────────── Inline SVG Decorations ───────────────────────── */

function DiamondSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 4L12 24L32 60L52 24L32 4Z"
        stroke="url(#diamond-grad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M12 24H52"
        stroke="url(#diamond-grad)"
        strokeWidth="1.5"
      />
      <path
        d="M32 4L22 24L32 60L42 24L32 4Z"
        stroke="url(#diamond-grad)"
        strokeWidth="0.8"
        strokeLinejoin="round"
        fill="none"
        opacity="0.5"
      />
      <defs>
        <linearGradient id="diamond-grad" x1="12" y1="4" x2="52" y2="60">
          <stop offset="0%" stopColor="#d4a94a" />
          <stop offset="50%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#d4a94a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CrownSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 40L4 12L20 24L40 6L60 24L76 12L72 40H8Z"
        stroke="url(#crown-grad)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M8 40H72"
        stroke="url(#crown-grad)"
        strokeWidth="1.8"
      />
      <circle cx="4" cy="12" r="2.5" fill="#d4a94a" opacity="0.8" />
      <circle cx="40" cy="6" r="2.5" fill="#f5e6c8" opacity="0.9" />
      <circle cx="76" cy="12" r="2.5" fill="#d4a94a" opacity="0.8" />
      <defs>
        <linearGradient id="crown-grad" x1="4" y1="6" x2="76" y2="40">
          <stop offset="0%" stopColor="#d4a94a" />
          <stop offset="50%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#c99a2e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SparklesSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M60 10L63 50L100 60L63 70L60 110L57 70L20 60L57 50L60 10Z" fill="url(#sparkle-grad)" opacity="0.15" />
      <path d="M60 25L62 52L88 60L62 68L60 95L58 68L32 60L58 52L60 25Z" stroke="#d4a94a" strokeWidth="0.8" fill="none" opacity="0.5" />
      <circle cx="25" cy="25" r="1.5" fill="#d4a94a" opacity="0.4" />
      <circle cx="95" cy="30" r="1" fill="#f5e6c8" opacity="0.3" />
      <circle cx="90" cy="95" r="1.5" fill="#d4a94a" opacity="0.35" />
      <circle cx="15" cy="90" r="1" fill="#f5e6c8" opacity="0.25" />
      <defs>
        <linearGradient id="sparkle-grad" x1="20" y1="10" x2="100" y2="110">
          <stop offset="0%" stopColor="#d4a94a" />
          <stop offset="100%" stopColor="#c99a2e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BuildingSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="12" width="32" height="32" rx="2" stroke="#d4a94a" strokeWidth="1.2" opacity="0.8" />
      <rect x="14" y="18" width="6" height="6" rx="1" stroke="#f5e6c8" strokeWidth="0.8" opacity="0.6" />
      <rect x="28" y="18" width="6" height="6" rx="1" stroke="#f5e6c8" strokeWidth="0.8" opacity="0.6" />
      <rect x="14" y="28" width="6" height="6" rx="1" stroke="#f5e6c8" strokeWidth="0.8" opacity="0.6" />
      <rect x="28" y="28" width="6" height="6" rx="1" stroke="#f5e6c8" strokeWidth="0.8" opacity="0.6" />
      <rect x="20" y="36" width="8" height="8" rx="1" stroke="#d4a94a" strokeWidth="1" opacity="0.9" />
      <path d="M24 12V6" stroke="#d4a94a" strokeWidth="1" opacity="0.7" />
      <circle cx="24" cy="5" r="1.5" fill="#d4a94a" opacity="0.6" />
    </svg>
  );
}

function PeopleSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="14" r="6" stroke="#d4a94a" strokeWidth="1.2" opacity="0.8" />
      <path d="M12 40C12 32.268 17.373 26 24 26C30.627 26 36 32.268 36 40" stroke="#d4a94a" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <circle cx="38" cy="16" r="4" stroke="#f5e6c8" strokeWidth="0.8" opacity="0.5" />
      <path d="M32 40C32 34.477 34.686 30 38 30C40.5 30 42.6 32.2 43.6 35.5" stroke="#f5e6c8" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      <circle cx="10" cy="16" r="4" stroke="#f5e6c8" strokeWidth="0.8" opacity="0.5" />
      <path d="M16 40C16 34.477 13.314 30 10 30C7.5 30 5.4 32.2 4.4 35.5" stroke="#f5e6c8" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function ChartSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="28" width="8" height="14" rx="1" stroke="#d4a94a" strokeWidth="1.2" opacity="0.7" />
      <rect x="6" y="28" width="8" height="14" rx="1" fill="#d4a94a" opacity="0.1" />
      <rect x="20" y="18" width="8" height="24" rx="1" stroke="#d4a94a" strokeWidth="1.2" opacity="0.85" />
      <rect x="20" y="18" width="8" height="24" rx="1" fill="#d4a94a" opacity="0.15" />
      <rect x="34" y="8" width="8" height="34" rx="1" stroke="#f5e6c8" strokeWidth="1.2" opacity="0.9" />
      <rect x="34" y="8" width="8" height="34" rx="1" fill="#f5e6c8" opacity="0.1" />
      <path d="M4 44H44" stroke="#d4a94a" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

/* ─────────────────────── Animated Counter Component ─────────────────────── */

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 25);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="gold-shimmer text-3xl font-bold sm:text-4xl">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* ──────────────────────────── Feature Card ───────────────────────────────── */

function FeatureCard({
  svg,
  title,
  description,
  delay,
}: {
  svg: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className={`glass-card group animate-fade-in-up ${delay} flex flex-col items-center gap-4 rounded-2xl px-6 py-8 text-center transition-all duration-500 hover:scale-[1.03] hover:border-gold-300/20 hover:shadow-[0_0_30px_rgba(212,169,74,0.1)]`}
    >
      <div className="flex h-16 w-16 items-center justify-center transition-transform duration-500 group-hover:scale-110">
        {svg}
      </div>
      <h3 className="text-lg font-semibold text-gold-100">{title}</h3>
      <p className="text-sm leading-relaxed text-white/50">{description}</p>
    </div>
  );
}

/* ─────────────────────────── Main HeroContent ───────────────────────────── */

export function HeroContent() {
  const router = useRouter();
  const { enter } = useAuth();

  const handleEnter = (mode: "guest" | "explore") => {
    enter(mode);
    router.push(DASHBOARD_ROUTE);
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* ── Nav Bar ── */}
      <nav className="animate-fade-in-up flex items-center justify-between px-6 py-5 sm:px-12">
        <div className="flex items-center gap-2">
          <DiamondSVG className="h-7 w-7" />
          <span className="text-lg font-bold tracking-wide text-gold-200">
            Room_Bbang_Signal
          </span>
        </div>
        <div className="hidden items-center gap-8 text-sm text-white/50 sm:flex">
          <a href="#features" className="transition-colors hover:text-gold-200">소개</a>
          <a href="#stats" className="transition-colors hover:text-gold-200">현황</a>
        </div>
        <button
          onClick={() => handleEnter("guest")}
          className="rounded-full border border-gold-300/30 bg-gold-300/10 px-5 py-2 text-sm font-medium text-gold-200 transition-all hover:bg-gold-300/20 hover:shadow-[0_0_15px_rgba(212,169,74,0.15)]"
        >
          입장하기
        </button>
      </nav>

      {/* ── Decorative SVGs floating ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <SparklesSVG className="animate-float absolute left-[5%] top-[15%] h-32 w-32 opacity-30 sm:h-48 sm:w-48" />
        <SparklesSVG className="animate-float-delayed absolute right-[8%] top-[20%] h-24 w-24 opacity-20 sm:h-36 sm:w-36" />
        <SparklesSVG className="animate-float-slow absolute bottom-[20%] left-[15%] h-20 w-20 opacity-15" />
      </div>

      {/* ── Hero Main ── */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 sm:py-24">
        {/* Crown */}
        <div className="animate-fade-in-up animate-float">
          <CrownSVG className="h-12 w-20 sm:h-16 sm:w-24" />
        </div>

        {/* Headline */}
        <div className="animate-fade-in-up animate-delay-100 flex flex-col items-center gap-4">
          <span className="rounded-full border border-gold-300/20 bg-gold-300/5 px-4 py-1.5 text-xs font-medium tracking-widest text-gold-300 uppercase">
            Premium Choice Platform
          </span>
          <h1 className="gold-shimmer text-center text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
            Room_Bbang_Signal
          </h1>
          <p className="max-w-lg text-center text-base leading-relaxed text-white/50 sm:text-lg">
            프리미엄 업소 정보부터 실시간 출근 현황, <br className="hidden sm:block" />
            초이스까지 한 곳에서 경험하세요
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up animate-delay-200 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => handleEnter("guest")}
            className="pulse-glow group flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-300 px-8 py-3.5 text-base font-semibold text-black shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            지금 시작하기
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => handleEnter("explore")}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-base font-medium text-white/70 backdrop-blur-sm transition-all hover:scale-105 hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            업소 둘러보기
          </button>
        </div>

        {/* ── Stats ── */}
        <div
          id="stats"
          className="animate-fade-in-up animate-delay-300 mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
        >
          {[
            { label: "등록 업소", value: 128, suffix: "+" },
            { label: "총 인원", value: 1240, suffix: "+" },
            { label: "오늘 출근", value: 387, suffix: "" },
            { label: "초이스 가능", value: 215, suffix: "" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card flex flex-col items-center gap-1 rounded-xl px-5 py-4 transition-all hover:border-gold-300/15"
            >
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <span className="text-xs text-white/40">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="px-6 pb-20 sm:px-12">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
          <FeatureCard
            svg={<BuildingSVG className="h-12 w-12" />}
            title="업소 소개"
            description="검증된 프리미엄 업소 정보를 한눈에 확인하고 비교하세요"
            delay="animate-delay-400"
          />
          <FeatureCard
            svg={<PeopleSVG className="h-12 w-12" />}
            title="직원 소개 & 연결"
            description="업소별 직원 프로필을 살펴보고 손쉽게 연결하세요"
            delay="animate-delay-500"
          />
          <FeatureCard
            svg={<ChartSVG className="h-12 w-12" />}
            title="실시간 현황"
            description="초이스 가능 인원과 출근 현황을 실시간으로 확인하세요"
            delay="animate-delay-600"
          />
        </div>
      </section>

      {/* ── Divider Line ── */}
      <div className="mx-auto h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-gold-300/20 to-transparent" />

      {/* ── Footer ── */}
      <footer className="flex flex-col items-center gap-2 px-6 py-8 text-center text-xs text-white/25">
        <DiamondSVG className="h-5 w-5 opacity-40" />
        <span>© 2025 Room_Bbang_Signal. All rights reserved.</span>
      </footer>
    </div>
  );
}
