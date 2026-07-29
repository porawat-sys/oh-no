"use client";

import { useState } from "react";

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
  habitatType: "soil" | "wood";
  airTemperature: number | null;
  airHumidity: number | null;
  soilPH: number | null;
  soilTemperature: number | null;
  soilHumidity: number | null;
  generalCharacteristics: string;
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

  const isSoil = mushroom.habitatType === "soil";

  return (
    <div className="flex flex-col overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white/95 shadow-sm transition hover:shadow-md">
      {/* รูปภาพ */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={withBasePath(images[imageIndex])}
          alt={mushroom.scientificName}
          className="h-full w-full object-cover"
        />

        <span className="absolute left-2 top-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
          {isSoil ? "🌱 เห็ดดิน" : "🪵 เห็ดตอไม้/ต้นไม้"}
        </span>

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

        {/* ข้อมูลสภาพแวดล้อม: อากาศแสดงทุกชนิด, ดินแสดงเฉพาะเห็ดดิน */}
        <div className="space-y-2 rounded-2xl border border-sky-100 bg-sky-50/60 p-3 text-sm">
          <p className="font-medium text-sky-900">🌡️ สภาพแวดล้อมที่พบ</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-stone-700">
            <span>อุณหภูมิอากาศ</span>
            <span className="text-right font-medium">
              {mushroom.airTemperature !== null ? `${mushroom.airTemperature}°C` : "-"}
            </span>
            <span>ความชื้นสัมพัทธ์อากาศ</span>
            <span className="text-right font-medium">
              {mushroom.airHumidity !== null ? `${mushroom.airHumidity}%` : "-"}
            </span>

            {isSoil && (
              <>
                <span className="mt-1 border-t border-sky-100 pt-1 text-stone-600">
                  pH ดิน
                </span>
                <span className="mt-1 border-t border-sky-100 pt-1 text-right font-medium">
                  {mushroom.soilPH !== null ? mushroom.soilPH : "-"}
                </span>
                <span>อุณหภูมิดิน</span>
                <span className="text-right font-medium">
                  {mushroom.soilTemperature !== null ? `${mushroom.soilTemperature}°C` : "-"}
                </span>
                <span>ความชื้นดิน</span>
                <span className="text-right font-medium">
                  {mushroom.soilHumidity !== null ? `${mushroom.soilHumidity}%` : "-"}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-stone-200 bg-stone-50/60 p-3 text-sm">
          <p className="font-medium text-stone-800">📋 ลักษณะทั่วไป</p>
          <p className="leading-relaxed text-stone-600">
            {mushroom.generalCharacteristics}
          </p>
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