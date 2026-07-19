"use client";

import { useState, useCallback, useRef } from "react";
import { useAttendance, VenueAttendance, DEFAULT_VENUES } from "@/context/AttendanceContext";
import { useRouter } from "next/navigation";

/* ────────────────────────────── OCR 파싱 유틸 ────────────────────────────── */

/** 카카오톡 채팅 스크린샷 텍스트에서 "업소명 숫자" 줄을 추출 */
function parseKakaoText(rawText: string): {
  parsed: Record<string, number>;
  chatTime: string | null;
} {
  // 업소명 별칭 매핑 (OCR이 인식할 수 있는 다양한 이름 → 표준명)
  const ALIAS: Record<string, string> = {
    "엘리트":       "사라있네(엘리트)",
    "사라있네":     "사라있네(엘리트)",
    "사라":         "사라있네(엘리트)",
    "유앤미":       "유앤미",
    "도파민":       "도파민",
    "달토":         "달토",
    "퍼펙트":       "퍼펙트",
  };

  const parsed: Record<string, number> = {};
  let chatTime: string | null = null;

  const lines = rawText.split(/[\n\r]+/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    // 카카오톡 시간 패턴: "오전 10:07" "오후 10:07" "PM 10:07"
    const timeMatch = line.match(/(오전|오후|AM|PM)\s*(\d{1,2}):(\d{2})/i);
    if (timeMatch) {
      chatTime = line.replace(/^\d+\s*/, "").trim(); // 앞의 숫자(리액션) 제거
      continue;
    }

    // "업소명 숫자" 패턴: 한글/영문 이름 + 공백 + 숫자
    const venueMatch = line.match(/^([가-힣a-zA-Z]+(?:\([가-힣a-zA-Z]+\))?)\s+(\d+)$/);
    if (venueMatch) {
      const rawName = venueMatch[1].trim();
      const count = parseInt(venueMatch[2], 10);

      // 직접 일치 또는 별칭 매핑
      const canonical = ALIAS[rawName] ?? rawName;
      parsed[canonical] = count;
    }
  }

  return { parsed, chatTime };
}

/** Context의 기존 venues 배열에 파싱 결과를 병합 */
function mergeAttendance(
  base: VenueAttendance[],
  parsed: Record<string, number>
): VenueAttendance[] {
  // 기존 업소 업데이트
  const updated = base.map((v) => {
    if (v.name in parsed) {
      return { ...v, attending: parsed[v.name] };
    }
    return v;
  });

  // 이미지에만 있는 새 업소 추가
  const existingNames = new Set(base.map((v) => v.name));
  for (const [name, count] of Object.entries(parsed)) {
    if (!existingNames.has(name)) {
      updated.push({ name, attending: count, available: 0, waiting: 0 });
    }
  }

  return updated;
}

/* ────────────────────────────── Inline SVGs ────────────────────────────── */

function UploadSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M33 31C36.866 31 40 27.866 40 24C40 20.134 36.866 17 33 17C32.577 17 32.164 17.04 31.764 17.117C30.396 13.547 26.998 11 23 11C17.477 11 13 15.477 13 21C13 21.34 13.018 21.676 13.053 22.007C10.173 22.862 8 25.542 8 28.75C8 32.754 11.246 36 15.25 36H33" />
      <path d="M24 26V42M18 32L24 26L30 32" />
    </svg>
  );
}

function CheckSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function DiamondSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M32 4L12 24L32 60L52 24L32 4Z" stroke="url(#adm-diamond-grad)" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M12 24H52" stroke="url(#adm-diamond-grad)" strokeWidth="1.5" />
      <path d="M32 4L22 24L32 60L42 24L32 4Z" stroke="url(#adm-diamond-grad)" strokeWidth="0.8" strokeLinejoin="round" fill="none" opacity="0.5" />
      <defs>
        <linearGradient id="adm-diamond-grad" x1="12" y1="4" x2="52" y2="60">
          <stop offset="0%" stopColor="#d4a94a" />
          <stop offset="50%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#d4a94a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function RefreshSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-3.93" />
    </svg>
  );
}

/* ────────────────────────────── Admin Page ────────────────────────────── */

type OcrStatus = "idle" | "loading" | "done" | "error";

export default function AdminPage() {
  const { state, updateVenues, resetToDefault } = useAttendance();
  const router = useRouter();

  const [ocrStatus, setOcrStatus] = useState<OcrStatus>("idle");
  const [ocrText, setOcrText] = useState<string>("");
  const [parsedData, setParsedData] = useState<Record<string, number>>({});
  const [chatTime, setChatTime] = useState<string | null>(null);
  const [previewVenues, setPreviewVenues] = useState<VenueAttendance[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    // 이미지 미리보기
    const src = URL.createObjectURL(file);
    setPreviewSrc(src);
    setOcrStatus("loading");
    setApplied(false);

    try {
      // Tesseract.js 동적 임포트 (번들 크기 최적화)
      const Tesseract = (await import("tesseract.js")).default;

      const result = await Tesseract.recognize(file, "kor+eng", {
        logger: () => {}, // 진행 로그 숨김
      });

      const raw = result.data.text;
      setOcrText(raw);

      const { parsed, chatTime: ct } = parseKakaoText(raw);
      setParsedData(parsed);
      setChatTime(ct);
      setPreviewVenues(mergeAttendance(state.venues, parsed));
      setOcrStatus("done");
    } catch (err) {
      console.error(err);
      setOcrStatus("error");
    }
  }, [state.venues]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleApply = () => {
    updateVenues(previewVenues, chatTime);
    setApplied(true);
  };

  // 프리뷰 특정 행 업데이트
  const updatePreviewVenue = (index: number, field: "name" | "attending", value: string) => {
    setPreviewVenues((prev) =>
      prev.map((v, i) =>
        i === index
          ? { ...v, [field]: field === "attending" ? Math.max(0, parseInt(value) || 0) : value }
          : v
      )
    );
    setApplied(false);
  };

  // 프리뷰 행 삭제
  const removePreviewVenue = (index: number) => {
    setPreviewVenues((prev) => prev.filter((_, i) => i !== index));
    setApplied(false);
  };

  // 프리뷰 새 업소 추가
  const addPreviewVenue = () => {
    setPreviewVenues((prev) => [
      ...prev,
      { name: "", attending: 0, available: 0, waiting: 0 },
    ]);
    setApplied(false);
  };

  // 하단 수동 편집용 상태 (현재 저장된 데이터 기반)
  const [manualVenues, setManualVenues] = useState<typeof state.venues>(() => state.venues);
  const [manualApplied, setManualApplied] = useState(false);

  const updateManualVenue = (index: number, field: "name" | "attending", value: string) => {
    setManualVenues((prev) =>
      prev.map((v, i) =>
        i === index
          ? { ...v, [field]: field === "attending" ? Math.max(0, parseInt(value) || 0) : value }
          : v
      )
    );
    setManualApplied(false);
  };

  const handleManualApply = () => {
    updateVenues(manualVenues, state.updatedAt);
    setManualApplied(true);
  };

  const handleReset = () => {
    resetToDefault();
    setOcrStatus("idle");
    setPreviewSrc(null);
    setOcrText("");
    setParsedData({});
    setApplied(false);
    setManualApplied(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* ── Nav ── */}
      <nav className="flex items-center justify-between border-b border-white/5 px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2">
          <DiamondSVG className="h-6 w-6" />
          <span className="text-base font-bold text-gold-200">Room_Bbang_Signal</span>
          <span className="ml-2 rounded-full border border-gold-300/20 bg-gold-300/5 px-2.5 py-0.5 text-[10px] tracking-widest text-gold-300 uppercase">
            Admin
          </span>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/50 transition-all hover:border-white/20 hover:text-white"
        >
          대시보드 이동
        </button>
      </nav>

      <main className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
        <h1 className="gold-shimmer mb-1 text-3xl font-extrabold tracking-tight">출근 현황 관리</h1>
        <p className="mb-8 text-sm text-white/40">
          카카오톡 출근 현황 캡처 이미지를 올리면 자동으로 인식하여 대시보드를 업데이트합니다.
        </p>

        {/* ── 이미지 업로드 영역 ── */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`glass-card flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200 ${
            isDragging
              ? "border-gold-300/60 bg-gold-300/5 scale-[1.01]"
              : "border-white/10 hover:border-gold-300/30 hover:bg-white/3"
          }`}
        >
          <UploadSVG className="h-12 w-12 text-gold-300/60" />
          <div>
            <p className="text-sm font-semibold text-white/70">
              이미지를 드래그하거나 클릭하여 업로드
            </p>
            <p className="mt-1 text-xs text-white/30">
              카카오톡 출근 현황 캡처 이미지 (PNG · JPG)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* ── OCR 처리 중 ── */}
        {ocrStatus === "loading" && (
          <div className="glass-card mt-6 flex flex-col items-center gap-4 rounded-2xl px-6 py-10 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-300/20 border-t-gold-300" />
            <p className="text-sm text-white/50">이미지에서 텍스트를 인식하는 중...</p>
            <p className="text-xs text-white/25">처음 실행 시 한국어 언어 파일을 내려받아 30초~1분 소요될 수 있습니다.</p>
          </div>
        )}

        {/* ── OCR 오류 ── */}
        {ocrStatus === "error" && (
          <div className="glass-card mt-6 rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-6 text-center">
            <p className="text-sm font-semibold text-red-400">이미지 인식에 실패했습니다.</p>
            <p className="mt-1 text-xs text-white/30">더 선명한 이미지를 업로드해 주세요.</p>
          </div>
        )}

        {/* ── 인식 결과 미리보기 ── */}
        {ocrStatus === "done" && (
          <div className="mt-6 flex flex-col gap-4">

            {/* 이미지 + 인식된 원본 텍스트 */}
            <div className="grid gap-4 sm:grid-cols-2">
              {previewSrc && (
                <div className="glass-card rounded-2xl p-3">
                  <p className="mb-2 text-[10px] text-white/30 uppercase tracking-widest">업로드 이미지</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewSrc} alt="업로드 이미지" className="w-full rounded-xl object-contain max-h-60" />
                </div>
              )}
              <div className="glass-card rounded-2xl p-4">
                <p className="mb-2 text-[10px] text-white/30 uppercase tracking-widest">인식된 원본 텍스트</p>
                <pre className="whitespace-pre-wrap break-all text-[11px] text-white/50 leading-relaxed max-h-60 overflow-y-auto">
                  {ocrText || "(텍스트를 인식하지 못했습니다)"}
                </pre>
              </div>
            </div>

            {/* 파싱 결과 카드 헤더 */}
            <div className="glass-card rounded-2xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gold-100">파싱 결과 미리보기</p>
                  {chatTime && (
                    <p className="text-xs text-gold-300/70 mt-0.5">
                      대화 시간: <span className="font-bold">{chatTime}</span>
                    </p>
                  )}
                  {!chatTime && (
                    <p className="text-xs text-white/30 mt-0.5">대화 시간을 인식하지 못했습니다.</p>
                  )}
                </div>
                <span className="text-xs text-white/25">{Object.keys(parsedData).length}개 업소 인식됨</span>
              </div>

              {/* 인식된 업소 목록 — 수동 편집 가능 */}
              <div className="flex flex-col gap-2">
                {previewVenues.map((v, idx) => {
                  const isUpdated = v.name in parsedData;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${
                        isUpdated
                          ? "border border-gold-300/15 bg-gold-300/5"
                          : "border border-white/5 bg-white/2"
                      }`}
                    >
                      {/* 업소명 input */}
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => updatePreviewVenue(idx, "name", e.target.value)}
                        placeholder="업소명"
                        className="flex-1 min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/90 placeholder-white/20 outline-none focus:border-gold-300/40 focus:bg-gold-300/5 transition-all"
                      />
                      {isUpdated && (
                        <span className="flex-shrink-0 rounded-full border border-gold-300/20 bg-gold-300/10 px-1.5 py-0.5 text-[9px] text-gold-300">
                          OCR
                        </span>
                      )}
                      {/* 인원 수 input */}
                      <div className="flex flex-shrink-0 items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          value={v.attending}
                          onChange={(e) => updatePreviewVenue(idx, "attending", e.target.value)}
                          className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-right text-base font-black text-gold-200 outline-none focus:border-gold-300/40 focus:bg-gold-300/5 transition-all tabular-nums"
                        />
                        <span className="text-xs text-white/30">명</span>
                      </div>
                      {/* 행 삭제 버튼 */}
                      <button
                        onClick={() => removePreviewVenue(idx)}
                        className="flex-shrink-0 rounded-lg border border-white/5 bg-white/3 px-2 py-1.5 text-xs text-white/25 transition-all hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
                {/* 업소 추가 버튼 */}
                <button
                  onClick={addPreviewVenue}
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/10 py-2.5 text-xs text-white/30 transition-all hover:border-gold-300/25 hover:text-gold-300/60"
                >
                  + 업소 추가
                </button>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                disabled={applied}
                className={`pulse-glow flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition-all ${
                  applied
                    ? "bg-green-500/20 border border-green-500/30 text-green-400 cursor-default"
                    : "bg-gradient-to-r from-gold-400 to-gold-300 text-black hover:scale-[1.02] shadow-lg"
                }`}
              >
                {applied ? (
                  <>
                    <CheckSVG className="h-4 w-4" />
                    대시보드에 반영 완료!
                  </>
                ) : (
                  "대시보드에 반영하기"
                )}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-medium text-white/50 transition-all hover:border-white/20 hover:text-white"
              >
                <RefreshSVG className="h-4 w-4" />
                초기화
              </button>
            </div>

            {applied && (
              <button
                onClick={() => router.push("/dashboard")}
                className="mt-1 w-full rounded-full border border-gold-300/20 bg-gold-300/5 py-3 text-sm font-medium text-gold-300 transition-all hover:bg-gold-300/10"
              >
                대시보드에서 확인하기 →
              </button>
            )}
          </div>
        )}

        {/* ── 수동 직접 입력 (OCR 없이 바로 수정) ── */}
        <div className="mt-10 border-t border-white/5 pt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest">수동 직접 입력</h2>
            {state.updatedAt && (
              <span className="text-xs text-white/25">마지막 업데이트: {state.updatedDate} {state.updatedAt}</span>
            )}
          </div>
          <p className="mb-4 text-xs text-white/30">이미지 없이 직접 숫자를 수정하여 대시보드에 반영할 수 있습니다.</p>

          <div className="flex flex-col gap-2">
            {manualVenues.map((v, idx) => (
              <div key={idx} className="glass-card flex items-center gap-2 rounded-xl px-3 py-2.5">
                <input
                  type="text"
                  value={v.name}
                  onChange={(e) => updateManualVenue(idx, "name", e.target.value)}
                  placeholder="업소명"
                  className="flex-1 min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/80 placeholder-white/20 outline-none focus:border-gold-300/40 focus:bg-gold-300/5 transition-all"
                />
                <div className="flex flex-shrink-0 items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    value={v.attending}
                    onChange={(e) => updateManualVenue(idx, "attending", e.target.value)}
                    className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-right text-base font-black text-gold-200 outline-none focus:border-gold-300/40 focus:bg-gold-300/5 transition-all tabular-nums"
                  />
                  <span className="text-xs text-white/30">명</span>
                </div>
                <button
                  onClick={() => setManualVenues((prev) => prev.filter((_, i) => i !== idx))}
                  className="flex-shrink-0 rounded-lg border border-white/5 bg-white/3 px-2 py-1.5 text-xs text-white/25 transition-all hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => setManualVenues((prev) => [...prev, { name: "", attending: 0, available: 0, waiting: 0 }])}
              className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/10 py-2.5 text-xs text-white/30 transition-all hover:border-gold-300/25 hover:text-gold-300/60"
            >
              + 업소 추가
            </button>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleManualApply}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition-all ${
                manualApplied
                  ? "bg-green-500/20 border border-green-500/30 text-green-400"
                  : "bg-gradient-to-r from-gold-400 to-gold-300 text-black hover:scale-[1.01] shadow-md"
              }`}
            >
              {manualApplied ? (
                <>
                  <CheckSVG className="h-4 w-4" />
                  반영 완료!
                </>
              ) : (
                "대시보드에 반영하기"
              )}
            </button>
            <button
              onClick={() => { setManualVenues(state.venues); setManualApplied(false); }}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/40 transition-all hover:border-white/20 hover:text-white/60"
            >
              <RefreshSVG className="h-3.5 w-3.5" />
              저장값 불러오기
            </button>
          </div>

          <button
            onClick={handleReset}
            className="mt-4 w-full rounded-full border border-white/8 bg-white/3 py-2.5 text-xs text-white/25 transition-all hover:border-white/15 hover:text-white/40"
          >
            기본값으로 전체 초기화
          </button>
        </div>

      </main>
    </div>
  );
}
