"use client";

import { cn } from "@/lib/utils";
import { VenueDetail } from "@/lib/venues";
import { useEffect, useState } from "react";

/* ──────────────────────── Inline SVGs ──────────────────────── */

function CloseSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ClockSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MapPinSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CarSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <path d="M16 8h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="12" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}

function PhoneSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MessageSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function KakaoSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      {/* Speech bubble representing KakaoTalk style */}
      <path d="M12 3C6.477 3 2 6.483 2 10.785c0 2.766 1.848 5.19 4.618 6.516-.363 1.341-1.315 4.86-1.503 5.568-.119.45.158.443.332.327.135-.09 2.158-1.465 4.316-2.932.748.106 1.524.161 2.317.161 5.523 0 10-3.483 10-7.785S17.523 3 12 3z" />
    </svg>
  );
}

function AvatarSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Circle Background */}
      <circle cx="40" cy="40" r="38" fill="url(#avatar-bg-grad)" stroke="url(#avatar-border-grad)" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="40" cy="28" r="12" fill="url(#avatar-glow)" />
      {/* Shoulders */}
      <path d="M16 64C16 52.954 26.745 44 40 44C53.255 44 64 52.954 64 64" fill="url(#avatar-glow)" />
      {/* Gradients */}
      <defs>
        <radialGradient id="avatar-bg-grad" cx="40" cy="40" r="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e1b18" />
          <stop offset="100%" stopColor="#0f0d0c" />
        </radialGradient>
        <linearGradient id="avatar-border-grad" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stopColor="#d4a94a" />
          <stop offset="100%" stopColor="#2e2718" />
        </linearGradient>
        <linearGradient id="avatar-glow" x1="40" y1="16" x2="40" y2="64">
          <stop offset="0%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#d4a94a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ClipboardSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
    </svg>
  );
}

function SparklesSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#d4a94a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M7.5 7.5l2.5 2.5M14 14l2.5 2.5M7.5 16.5l2.5-2.5M14 10l2.5-2.5" />
    </svg>
  );
}

/* ──────────────────────── Modal ──────────────────────── */

interface VenueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: VenueDetail | null;
}

export function VenueDetailModal({ isOpen, onClose, venue }: VenueDetailModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !venue) return null;

  const handleCopyKakao = async () => {
    try {
      await navigator.clipboard.writeText(venue.manager.kakao);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy kakao id: ", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="glass-card relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-gold-300/10 shadow-[0_0_50px_rgba(212,169,74,0.12)] transition-all animate-scale-up"
      >
        {/* Header decoration */}
        <div className="absolute right-12 top-4 pointer-events-none opacity-30">
          <SparklesSVG className="h-10 w-10" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-2 text-white/55 transition-all hover:border-white/20 hover:text-white"
        >
          <CloseSVG className="h-4 w-4" />
        </button>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8">
          
          {/* Slogan & Title */}
          <div className="flex flex-col gap-1 pr-8">
            <span className="inline-self-start rounded-full border border-gold-300/20 bg-gold-300/5 px-3 py-1 text-[10px] font-medium tracking-widest text-gold-300 uppercase">
              {venue.theme.split("/")[0]?.trim() || "PREMIUM VENUE"}
            </span>
            <h2 className="gold-shimmer text-3xl font-extrabold tracking-tight mt-2">
              {venue.name}
            </h2>
            <p className="text-sm font-medium text-gold-200/70">
              {venue.subtitle}
            </p>
          </div>

          {/* Introduction */}
          <p className="mt-6 text-sm leading-relaxed text-white/60">
            {venue.intro}
          </p>

          {/* Details list */}
          <div className="mt-6 flex flex-col gap-3.5 border-t border-white/5 pt-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-gold-300">
                <ClockSVG className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/30">영업 시간</span>
                <span className="text-sm font-medium text-white/80">{venue.hours}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-gold-300">
                <MapPinSVG className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/30">위치 안내</span>
                <span className="text-sm font-medium text-white/80">{venue.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-gold-300">
                <CarSVG className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/30">주차 정보</span>
                <span className="text-sm font-medium text-white/80">{venue.parking}</span>
              </div>
            </div>
          </div>

          {/* Manager Section */}
          <div className="mt-8 border-t border-white/5 pt-6">
            <h3 className="text-xs font-semibold tracking-wider text-white/40 uppercase">
              대표 실장 안내
            </h3>

            <div className="mt-4 flex flex-col items-center gap-4 rounded-2xl bg-white/3 border border-white/5 p-5 text-center sm:flex-row sm:text-left">
              {/* Avatar */}
              <AvatarSVG className="h-16 w-16 flex-shrink-0" />
              
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline justify-center gap-2 sm:justify-start">
                  <span className="text-base font-bold text-gold-100">
                    {venue.manager.name}
                  </span>
                  <span className="text-xs text-white/30">
                    {venue.manager.role}
                  </span>
                </div>
                <p className="text-xs text-gold-200/80 leading-relaxed font-medium italic">
                  "{venue.manager.intro}"
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 grid grid-cols-3 gap-2.5">
            {/* Call */}
            <a
              href={`tel:${venue.manager.phone}`}
              className="pulse-glow flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-300 py-3.5 text-xs font-bold text-black shadow-lg transition-transform hover:scale-[1.03]"
            >
              <PhoneSVG className="h-4.5 w-4.5" />
              전화 연결
            </a>

            {/* SMS */}
            <a
              href={`sms:${venue.manager.phone}`}
              className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 py-3.5 text-xs font-semibold text-white/70 backdrop-blur-sm transition-all hover:scale-[1.03] hover:border-white/20 hover:text-white"
            >
              <MessageSVG className="h-4.5 w-4.5" />
              문자 문의
            </a>

            {/* Kakao */}
            <button
              onClick={handleCopyKakao}
              className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#fee500]/20 bg-[#fee500]/10 py-3.5 text-xs font-semibold text-[#fee500]/80 backdrop-blur-sm transition-all hover:scale-[1.03] hover:border-[#fee500]/30 hover:bg-[#fee500]/15 hover:text-[#fee500]"
            >
              {copied ? (
                <>
                  <ClipboardSVG className="h-4.5 w-4.5 text-green-400 animate-pulse" />
                  <span className="text-green-400 font-bold">복사 완료!</span>
                </>
              ) : (
                <>
                  <KakaoSVG className="h-4.5 w-4.5" />
                  카톡 ID 복사
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
