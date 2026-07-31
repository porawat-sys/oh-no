"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MushroomCard } from "@/components/MushroomCard";
import { WeatherSummary } from "@/components/WeatherSummary";

export type MushroomRecord = {
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

export type RoundData = {
  round: number;
  date: string;
  speciesCount: number;
  mushrooms: MushroomRecord[];
  avgTemperature: number | null;
  avgHumidity: number | null;
};

const ALL = "ทั้งหมด";

export function RoundExplorer({
  roundData,
  previousRound,
  nextRound,
}: {
  roundData: RoundData;
  previousRound: number | null;
  nextRound: number | null;
}) {
  const [query, setQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState(ALL);
  const [edibilityFilter, setEdibilityFilter] = useState(ALL);
  const [groupFilter, setGroupFilter] = useState(ALL);
  const [pointFilter, setPointFilter] = useState(ALL);

  const familyOptions = useMemo(() => {
    const families = Array.from(new Set(roundData.mushrooms.map((m) => m.family).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b, "th"));
    return [ALL, ...families];
  }, [roundData.mushrooms]);

  const groupOptions = useMemo(() => {
    const groups = Array.from(new Set(roundData.mushrooms.map((m) => m.group).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b, "th"));
    return [ALL, ...groups];
  }, [roundData.mushrooms]);

  const pointOptions = useMemo(() => {
    const points = Array.from(
      new Set(roundData.mushrooms.flatMap((m) => m.pointsFound))
    ).sort((a, b) => a.localeCompare(b, "th", { numeric: true }));
    return [ALL, ...points];
  }, [roundData.mushrooms]);

  const filteredMushrooms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return roundData.mushrooms.filter((mushroom) => {
      const matchesQuery =
        !normalizedQuery ||
        mushroom.scientificName.toLowerCase().includes(normalizedQuery) ||
        mushroom.localName.toLowerCase().includes(normalizedQuery) ||
        mushroom.family.toLowerCase().includes(normalizedQuery);

      const matchesFamily = familyFilter === ALL || mushroom.family === familyFilter;
      const matchesGroup = groupFilter === ALL || mushroom.group === groupFilter;
      const matchesPoint =
        pointFilter === ALL || mushroom.pointsFound.includes(pointFilter);
      const matchesEdibility =
        edibilityFilter === ALL ||
        (edibilityFilter === "กินได้" && mushroom.edibility.includes("กินได้")) ||
        (edibilityFilter === "กินไม่ได้" && mushroom.edibility.includes("กินไม่ได้")) ||
        (edibilityFilter === "ไม่มีข้อมูล" && mushroom.edibility.includes("ไม่มีข้อมูล"));

      return matchesQuery && matchesFamily && matchesGroup && matchesPoint && matchesEdibility;
    });
  }, [edibilityFilter, familyFilter, groupFilter, pointFilter, query, roundData.mushrooms]);

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
              ผลสำรวจเห็ดในเส้นทางศึกษาธรรมชาติยอดเขาหลวง
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-stone-900 sm:text-4xl">
              ครั้งที่ {roundData.round} — {roundData.date}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-stone-600">
              พบเห็ดทั้งหมด {roundData.speciesCount} ชนิด โดยมีทั้งชนิดที่กินได้และชนิดที่ไม่กินได้ในช่วงเส้นทางศึกษาธรรมชาติเขาหลวง
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {previousRound ? (
              <Link href={`/round/${previousRound}`} className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-emerald-700 hover:text-emerald-700">
                ← ก่อนหน้า
              </Link>
            ) : null}
            <Link href="/" className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-emerald-700 hover:text-emerald-700">
              กลับหน้าแรก
            </Link>
            {nextRound ? (
              <Link href={`/round/${nextRound}`} className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-emerald-700 hover:text-emerald-700">
                ถัดไป →
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <section className="rounded-[2rem] border border-stone-200 bg-white/90 p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-5">
          <label className="text-sm font-medium text-stone-700 lg:col-span-1">
            <span className="mb-2 block">ค้นหาชื่อเห็ด</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="เช่น Amanita, เห็ดหูหนู"
              className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none ring-0 focus:border-emerald-700"
            />
          </label>

          <label className="text-sm font-medium text-stone-700">
            <span className="mb-2 block">กรองตามวงศ์</span>
            <select
              value={familyFilter}
              onChange={(event) => setFamilyFilter(event.target.value)}
              className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-700"
            >
              {familyOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-stone-700">
            <span className="mb-2 block">กรองตามกลุ่มเห็ด</span>
            <select
              value={groupFilter}
              onChange={(event) => setGroupFilter(event.target.value)}
              className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-700"
            >
              {groupOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-stone-700">
            <span className="mb-2 block">กรองตามจุดที่สำรวจ</span>
            <select
              value={pointFilter}
              onChange={(event) => setPointFilter(event.target.value)}
              className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-700"
            >
              {pointOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-stone-700">
            <span className="mb-2 block">กรองตามการรับประทาน</span>
            <select
              value={edibilityFilter}
              onChange={(event) => setEdibilityFilter(event.target.value)}
              className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-700"
            >
              <option value={ALL}>{ALL}</option>
              <option value="กินได้">กินได้</option>
              <option value="กินไม่ได้">กินไม่ได้</option>
              <option value="ไม่มีข้อมูล">ไม่มีข้อมูล</option>
            </select>
          </label>
        </div>

        {(familyFilter !== ALL ||
          groupFilter !== ALL ||
          pointFilter !== ALL ||
          edibilityFilter !== ALL ||
          query) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-stone-500">
              พบ {filteredMushrooms.length} จาก {roundData.mushrooms.length} ชนิด
            </span>
            <button
              onClick={() => {
                setQuery("");
                setFamilyFilter(ALL);
                setGroupFilter(ALL);
                setPointFilter(ALL);
                setEdibilityFilter(ALL);
              }}
              className="rounded-full border border-stone-300 px-3 py-1 text-stone-600 transition hover:border-emerald-700 hover:text-emerald-700"
            >
              ล้างตัวกรองทั้งหมด ✕
            </button>
          </div>
        )}
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredMushrooms.map((mushroom) => (
          <MushroomCard key={mushroom.scientificName} mushroom={mushroom} />
        ))}
      </section>

      {filteredMushrooms.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white/80 p-8 text-center text-stone-600">
          ไม่พบข้อมูลเห็ดตามเงื่อนไขที่เลือก กรุณาลองค้นหาอีกครั้ง
        </div>
      ) : null}

      <WeatherSummary avgTemperature={roundData.avgTemperature} avgHumidity={roundData.avgHumidity} />
    </div>
  );
}