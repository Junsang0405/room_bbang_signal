"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

/* ──────────────────────── Types ──────────────────────── */

export interface VenueAttendance {
  name: string;
  attending: number;
  available: number;
  waiting: number;
}

interface AttendanceState {
  venues: VenueAttendance[];
  updatedAt: string | null;   // 카카오톡 대화 시간 e.g. "오후 10:07"
  updatedDate: string | null; // 업데이트한 실제 날짜 e.g. "2025-07-19"
}

interface AttendanceContextValue {
  state: AttendanceState;
  updateVenues: (venues: VenueAttendance[], chatTime: string | null) => void;
  resetToDefault: () => void;
}

/* ──────────────────────── Default Data ──────────────────────── */

export const DEFAULT_VENUES: VenueAttendance[] = [
  { name: "도파민",           attending: 31, available: 18, waiting: 0 },
  { name: "유앤미",           attending: 42, available: 27, waiting: 5 },
  { name: "사라있네(엘리트)", attending: 63, available: 41, waiting: 12 },
  { name: "달토",             attending: 22, available: 14, waiting: 3 },
  { name: "퍼펙트",           attending: 0,  available: 0,  waiting: 0 },
];

const DEFAULT_STATE: AttendanceState = {
  venues: DEFAULT_VENUES,
  updatedAt: null,
  updatedDate: null,
};

const STORAGE_KEY = "rbs-attendance-v1";

/* ──────────────────────── Context ──────────────────────── */

const AttendanceContext = createContext<AttendanceContextValue | null>(null);

/* ──────────────────────── Provider ──────────────────────── */

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AttendanceState>(DEFAULT_STATE);

  // 마운트 시 localStorage에서 복원
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AttendanceState;
        setState(parsed);
      }
    } catch {
      // 파싱 오류 무시 → 기본값 유지
    }
  }, []);

  const updateVenues = (venues: VenueAttendance[], chatTime: string | null) => {
    const today = new Date().toLocaleDateString("ko-KR", {
      year: "numeric", month: "2-digit", day: "2-digit",
    });
    const next: AttendanceState = {
      venues,
      updatedAt: chatTime,
      updatedDate: today,
    };
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const resetToDefault = () => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AttendanceContext.Provider value={{ state, updateVenues, resetToDefault }}>
      {children}
    </AttendanceContext.Provider>
  );
}

/* ──────────────────────── Hook ──────────────────────── */

export function useAttendance(): AttendanceContextValue {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error("useAttendance must be used inside <AttendanceProvider>");
  return ctx;
}
