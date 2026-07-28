"use client";

import { useMemo, useState } from "react";

type TrailPoint = {
  id: string;
  label: string;
  distance: string;
  x: number;
  y: number;
};

const trailPoints: TrailPoint[] = [
  { id: "start", label: "ศูนย์บริการนักท่องเที่ยว", distance: "0 กม.", x: 160, y: 70 },
  { id: "pradu", label: "ประดู่ใหญ่", distance: "1 กม.", x: 180, y: 125 },
  { id: "moeiok", label: "มออีหก", distance: "1.4 กม.", x: 150, y: 180 },
  { id: "viewpoint", label: "จุดชมวิว", distance: "1.6 กม.", x: 195, y: 230 },
  { id: "takian", label: "ตะเคียนคู่", distance: "1.9 กม.", x: 155, y: 285 },
  { id: "namdibh", label: "น้ำดิบผามะหาด", distance: "2.3 กม.", x: 205, y: 335 },
  { id: "chan", label: "ชานเบิกภัย", distance: "2.7 กม.", x: 165, y: 385 },
  { id: "sairang", label: "ไทรงาม", distance: "3 กม.", x: 205, y: 440 },
  { id: "plong", label: "ปล่องนางนาค", distance: "3.3 กม.", x: 150, y: 495 },
  { id: "phra", label: "พระยาแล่นเรือ", distance: "3.5 กม.", x: 195, y: 545 },
  { id: "camp", label: "ค่ายพักแรม", distance: "3.7 กม.", x: 165, y: 600 },
];

export function TrailMap() {
  const [activePoint, setActivePoint] = useState<TrailPoint | null>(null);

  const pathD = useMemo(
    () =>
      [
        "M 160 70",
        "C 180 95, 190 115, 180 125",
        "C 155 145, 150 165, 150 180",
        "C 160 210, 180 225, 195 230",
        "C 170 255, 160 275, 155 285",
        "C 180 315, 205 325, 205 335",
        "C 190 360, 175 375, 165 385",
        "C 185 410, 195 430, 205 440",
        "C 175 470, 155 485, 150 495",
        "C 175 520, 190 535, 195 545",
        "C 180 575, 170 590, 165 600",
      ].join(" "),
    [],
  );

  return (
    <div className="rounded-[2rem] border border-emerald-900/10 bg-amber-50/70 p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
            เส้นทางศึกษาธรรมชาติ
          </p>
          <h2 className="text-xl font-semibold text-stone-800">เขาหลวง — เส้นทางเดินป่าแบบสรุป</h2>
        </div>
        <div className="rounded-full border border-emerald-800/20 bg-white/80 px-3 py-1 text-sm text-stone-700">
          จุดเริ่มต้น → จุดสิ้นสุด
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-gradient-to-b from-amber-100/70 via-emerald-50/60 to-stone-100/80 p-4">
        <svg viewBox="0 0 320 650" className="w-full">
          <path d={pathD} fill="none" stroke="#8b3d1f" strokeWidth="7" strokeLinecap="round" />
          <path d={pathD} fill="none" stroke="#4b2e1f" strokeWidth="3" strokeLinecap="round" opacity="0.35" />

          {trailPoints.map((point) => (
            <g key={point.id}>
              <circle cx={point.x} cy={point.y} r="12" fill="#f5f2e8" stroke="#8b3d1f" strokeWidth="4" />
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill={activePoint?.id === point.id ? "#1f5130" : "#d97706"}
                className="cursor-pointer transition-colors"
                onMouseEnter={() => setActivePoint(point)}
                onFocus={() => setActivePoint(point)}
                onMouseLeave={() => setActivePoint(null)}
                onBlur={() => setActivePoint(null)}
              />
            </g>
          ))}
        </svg>

        <div className="pointer-events-none absolute inset-0">
          {trailPoints.map((point) => (
            <div
              key={`${point.id}-label`}
              className={`absolute rounded-full border border-stone-300/70 bg-white/90 px-3 py-1 text-xs font-medium text-stone-700 shadow-sm transition-all ${
                activePoint?.id === point.id ? "scale-105" : ""
              }`}
              style={{ left: `${Math.min(point.x + 12, 240)}px`, top: `${Math.max(point.y - 28, 20)}px` }}
            >
              {point.label}
            </div>
          ))}
        </div>

        {activePoint ? (
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-emerald-800/20 bg-white/90 px-4 py-3 text-sm text-stone-700 shadow-lg">
            <div className="font-semibold text-stone-800">{activePoint.label}</div>
            <div>ระยะทางสะสม {activePoint.distance}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
