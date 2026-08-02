"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterBar } from "@/components/FilterBar";
import { MushroomCard } from "@/components/MushroomCard";
import { WeatherSummary } from "@/components/WeatherSummary";
import { matchesFilters, type FilterState } from "@/components/filterUtils";
import type { MushroomRecord, RoundData } from "@/components/types";

const EMPTY_FILTERS: FilterState = {
  query: "",
  families: [],
  groups: [],
  habitats: [],
  ecoRoles: [],
  edibilities: [],
  periods: [],
  points: [],
};

const ALL = "ทั้งหมด";

// รายการตายตัว รวมจากทุกรอบที่เคยสำรวจ ใช้เสมอไม่ว่ารอบนั้นจะมีข้อมูลหรือไม่
// เพื่อให้ตัวกรองแสดงตัวเลือกครบเหมือนกันทุกรอบ

const ALL_SURVEY_POINTS = [
  "จุดที่ 1 ศูนย์บริการนักท่องเที่ยว-ประดู่ใหญ่",
  "จุดที่ 2 ประดู่ใหญ่-มออีหก",
  "จุดที่ 3 มออีหก-จุดชมวิว",
  "จุดที่ 4 จุดชมวิว-ตะเคียนคู่",
  "จุดที่ 5 ตะเคียนคู่-น้ำดิบผามะหาด",
  "จุดที่ 6 น้ำดิบผามะหาด-ชานเบิกภัย",
  "จุดที่ 7 ชานเบิกภัย-ไทรงาม",
  "จุดที่ 8 ไทรงาม-ปล่องนางนาค",
  "จุดที่ 9 ปล่องนางนาค-พระยาแล่นเรือ",
  "จุดที่ 10 พระยาแล่นเรือ-ค่ายพักแรม",
];

const ALL_FAMILIES = [
  "Agaricaceae",
  "Amanitaceae",
  "Auriculariaceae",
  "Clavariaceae",
  "Ganodermataceae",
  "Hydnaceae",
  "Hygrophoraceae",
  "Hymenochaetaceae",
  "Inocybaceae",
  "Laetiporaceae",
  "Lyophyllaceae",
  "Marasmiaceae",
  "Mycenaceae",
  "Omphalinaceae",
  "Omphalotaceae",
  "Phanerochaetaceae",
  "Pleurotaceae",
  "Polyporaceae",
  "Psathyrellaceae",
  "Pyronemataceae",
  "Stereaceae",
  "Thelephoraceae",
  "Xylariaceae",
  "ระบุไม่ได้",
];

const ALL_GROUPS = [
  "เห็ดครีบ",
  "เห็ดปะการังและเห็ดกระบอง",
  "เห็ดฟันเลื่อย",
  "เห็ดรูปแก้วแชมเปญ รูปถ้วย หรือรูปจาน",
  "เห็ดหิ้ง",
  "เห็ดหูหนู/เห็ดวุ้น",
  "เห็ดแบนราบไปกับต้นไม้",
  "เห็ดแผ่นหนัง",
  "แผ่นหนัง",
];

export function RoundExplorer({
  roundData,
  previousRound,
  nextRound,
}: {
  roundData: RoundData;
  previousRound: number | null;
  nextRound: number | null;
}) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const filteredMushrooms = useMemo(
    () => roundData.mushrooms.filter((mushroom) => matchesFilters(mushroom, filters)),
    [filters, roundData.mushrooms]
  );

  const selectedOptionHasNoData = false;

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

      <FilterBar
        mushrooms={roundData.mushrooms}
        visibleCount={filteredMushrooms.length}
        totalCount={roundData.mushrooms.length}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      {selectedOptionHasNoData ? (
        <div className="rounded-[2rem] border border-dashed border-amber-300 bg-amber-50 p-8 text-center text-amber-800">
          รอบนี้ไม่มีข้อมูลเห็ดตามตัวกรองที่เลือก (อาจไม่พบในรอบนี้ หรือยังไม่ได้สำรวจถึงจุดนี้)
        </div>
      ) : (
        <>
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
        </>
      )}

      <WeatherSummary avgTemperature={roundData.avgTemperature} avgHumidity={roundData.avgHumidity} />
    </div>
  );
}