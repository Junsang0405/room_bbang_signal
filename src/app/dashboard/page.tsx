"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AuroraBackground } from "@/components/main/hero/AuroraBackground";
import { AttendanceBoard } from "@/components/dashboard/AttendanceBoard";
import { VenueDetailModal } from "@/components/dashboard/VenueDetailModal";
import { VENUE_DETAILS } from "@/lib/venues";
import { LANDING_ROUTE } from "@/lib/auth";

/* ──────────────────────── Inline SVGs ──────────────────────── */

function DiamondSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M32 4L12 24L32 60L52 24L32 4Z" stroke="url(#db-diamond-grad)" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M12 24H52" stroke="url(#db-diamond-grad)" strokeWidth="1.5" />
      <path d="M32 4L22 24L32 60L42 24L32 4Z" stroke="url(#db-diamond-grad)" strokeWidth="0.8" strokeLinejoin="round" fill="none" opacity="0.5" />
      <defs>
        <linearGradient id="db-diamond-grad" x1="12" y1="4" x2="52" y2="60">
          <stop offset="0%" stopColor="#d4a94a" />
          <stop offset="50%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#d4a94a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SparklesSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M60 10L63 50L100 60L63 70L60 110L57 70L20 60L57 50L60 10Z" fill="url(#db-sparkle-grad)" opacity="0.15" />
      <path d="M60 25L62 52L88 60L62 68L60 95L58 68L32 60L58 52L60 25Z" stroke="#d4a94a" strokeWidth="0.8" fill="none" opacity="0.5" />
      <circle cx="25" cy="25" r="1.5" fill="#d4a94a" opacity="0.4" />
      <circle cx="95" cy="30" r="1" fill="#f5e6c8" opacity="0.3" />
      <circle cx="90" cy="95" r="1.5" fill="#d4a94a" opacity="0.35" />
      <circle cx="15" cy="90" r="1" fill="#f5e6c8" opacity="0.25" />
      <defs>
        <linearGradient id="db-sparkle-grad" x1="20" y1="10" x2="100" y2="110">
          <stop offset="0%" stopColor="#d4a94a" />
          <stop offset="100%" stopColor="#c99a2e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ──────────────────────── Dashboard Page ──────────────────────── */

export default function DashboardPage() {
  const { mode } = useAuth();
  const router = useRouter();
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);

  const modeLabel = mode === "explore" ? "둘러보기" : "시작하기";

  return (
    <AuroraBackground
      className="flex min-h-screen flex-col"
      variant="custom"
      colors={["hsla(35, 85%, 50%, 0.25)", "hsla(340, 70%, 45%, 0.15)", "transparent"]}
      speed={0.4}
      blobCount={5}
      childrenClassName="flex flex-1 flex-col"
    >
      <div className="flex flex-1 flex-col">

        {/* ── Nav Bar ── */}
        <nav className="animate-fade-in-up flex items-center justify-between px-6 py-5 sm:px-12">
          <div className="flex items-center gap-2">
            <DiamondSVG className="h-7 w-7" />
            <span className="text-lg font-bold tracking-wide text-gold-200">
              Room_Bbang_Signal
            </span>
          </div>

          <button
            onClick={() => router.push(LANDING_ROUTE)}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white/50 transition-all hover:border-white/20 hover:text-white"
          >
            나가기
          </button>
        </nav>

        {/* ── Decorative floating SVGs ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <SparklesSVG className="animate-float absolute left-[3%] top-[10%] h-28 w-28 opacity-20 sm:h-40 sm:w-40" />
          <SparklesSVG className="animate-float-delayed absolute right-[5%] top-[15%] h-20 w-20 opacity-15 sm:h-32 sm:w-32" />
        </div>

        {/* ── Page Header ── */}
        <section className="animate-fade-in-up animate-delay-100 px-6 pb-2 pt-6 sm:px-12">
          <div className="mx-auto max-w-2xl">
            <span className="mb-2 inline-block rounded-full border border-gold-300/20 bg-gold-300/5 px-4 py-1.5 text-xs font-medium tracking-widest text-gold-300 uppercase">
              서울권 실시간 현황
            </span>
            <h1 className="gold-shimmer text-3xl font-extrabold tracking-tight sm:text-4xl">
              출근 현황판
            </h1>

          </div>
        </section>

        {/* ── Main Content ── */}
        <main className="flex-1 px-6 py-6 sm:px-12">
          <div className="mx-auto max-w-2xl">
            <AttendanceBoard onSelectVenue={setSelectedVenue} />
          </div>
        </main>

        {/* ── Venue Detail Modal ── */}
        <VenueDetailModal
          isOpen={!!selectedVenue}
          onClose={() => setSelectedVenue(null)}
          venue={selectedVenue ? VENUE_DETAILS[selectedVenue] : null}
        />

        {/* ── Divider ── */}
        <div className="mx-auto mb-2 mt-4 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-gold-300/20 to-transparent" />

        {/* ── Footer ── */}
        <footer className="flex flex-col items-center gap-2 px-6 py-6 text-center text-xs text-white/25">
          <DiamondSVG className="h-5 w-5 opacity-40" />
          <span>© 2025 Room_Bbang_Signal. All rights reserved.</span>
        </footer>
      </div>
    </AuroraBackground>
  );
}
