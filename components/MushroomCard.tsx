"use client";

import { useState } from "react";

// ต้องตรงกับชื่อ repo ของคุณ (จากที่ตั้งไว้ใน next.config.ts)
const BASE_PATH = process.env.NODE_ENV === "production" ? "/oh-no" : "";

type Mushroom = {
  scientificName: string;
  localName: string;
  family: string;
  group: string;
  habitat: string;
  ecologicalRole: string;
  edibility: string;
  totalFound: number;
  pointsFound: string[];
  pointsFoundCount: number;
  images: string[];
};

function withBasePath(path: string) {
  if (!path) return path;
  return `${BASE_PATH}${path}`;
}

function edibilityStyle(edibility: string) {
  if (edibility.includes("กินได้") && !edibility.includes("ไม่")) {
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  }
  if (edibility.includes("กินไม่ได้")) {
    return "bg-rose-100 text-rose-800 border-rose-200";
  }
  return "bg-stone-100 text-stone-600 border-stone-200";
}

export function MushroomCard({ mushroom }: { mushroom: Mushroom }) {
  const [showPoints, setShowPoints] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const images = mushroom.images.length > 0
    ? mushroom.images
    : ["/images/placeholder-mushroom.png"];

  return (
    <div className="flex flex-col overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white/95 shadow-sm transition hover:shadow-md">
      {/* รูปภาพ */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={withBasePath(images[imageIndex])}
          alt={mushroom.scientificName}
          className="h-full w-full object-cover"
        />

        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImageIndex(i)}
                className={`h-2 w-2 rounded-full border border-white/80 ${
                  i === imageIndex ? "bg-white" : "bg-white/40"
                }`}
                aria-label={`รูปที่ ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* เนื้อหา */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {mushroom.family}
          </p>
          <h3 className="mt-1 text-lg font-semibold italic text-stone-900">
            {mushroom.scientificName}
          </h3>
          <p className="text-sm text-stone-600">{mushroom.localName}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-stone-700">
            {mushroom.group}
          </span>
          <span
            className={`rounded-full border px-3 py-1 font-medium ${edibilityStyle(
              mushroom.edibility
            )}`}
          >
            {mushroom.edibility}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-stone-50 p-3 text-sm">
          <div>
            <p className="text-stone-500">พบทั้งหมด</p>
            <p className="font-semibold text-stone-900">
              {mushroom.totalFound} ครั้ง
            </p>
          </div>
          <div>
            <p className="text-stone-500">พบในจุด</p>
            <p className="font-semibold text-stone-900">
              {mushroom.pointsFoundCount} จุด
            </p>
          </div>
        </div>

        <div className="space-y-1 text-sm text-stone-600">
          <p>
            <span className="font-medium text-stone-800">แหล่งกำเนิด:</span>{" "}
            {mushroom.habitat}
          </p>
          <p>
            <span className="font-medium text-stone-800">บทบาท:</span>{" "}
            {mushroom.ecologicalRole}
          </p>
        </div>

        <button
          onClick={() => setShowPoints((v) => !v)}
          className="mt-auto text-left text-sm font-medium text-emerald-700 hover:text-emerald-900"
        >
          {showPoints ? "ซ่อนรายชื่อจุดที่พบ ▲" : "ดูรายชื่อจุดที่พบ ▼"}
        </button>

        {showPoints && (
          <ul className="space-y-1 rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm text-stone-700">
            {mushroom.pointsFound.map((point) => (
              <li key={point} className="flex gap-2">
                <span>•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}