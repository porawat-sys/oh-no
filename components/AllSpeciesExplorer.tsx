"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FilterBar } from "@/components/FilterBar";
import { MushroomCard } from "@/components/MushroomCard";
import { matchesFilters, type FilterState } from "@/components/filterUtils";
import type { RoundData } from "@/components/types";

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

type Props = {
  rounds: RoundData[];
};

export function AllSpeciesExplorer({ rounds }: Props) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const species = useMemo(() => {
    const map = new Map<string, { mushroom: any; round: number }>();
    rounds.forEach((round) => {
      round.mushrooms.forEach((mushroom) => {
        if (!map.has(mushroom.scientificName)) {
          map.set(mushroom.scientificName, { mushroom, round: round.round });
        }
      });
    });

    return Array.from(map.values()).filter(({ mushroom }) => matchesFilters(mushroom, filters));
  }, [filters, rounds]);

  const totalCount = rounds.reduce((sum, round) => sum + round.mushrooms.length, 0);

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">การสำรวจทั้ง 7 รอบ</p>
            <h1 className="mt-2 text-3xl font-semibold text-stone-900 sm:text-4xl">ชนิดเห็ดทั้งหมดที่พบใน 7 รอบ</h1>
            <p className="mt-3 max-w-2xl text-base text-stone-600">รายการชนิดเห็ดทั้งหมดจากทุกรอบรวมเป็นการ์ดเดี่ยวและเชื่อมต่อไปยังรอบที่พบ</p>
          </div>
          <Link href="/" className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-emerald-700 hover:text-emerald-700">
            ← กลับหน้าแรก
          </Link>
        </div>
      </header>

      <FilterBar
        mushrooms={rounds.flatMap((round) => round.mushrooms)}
        visibleCount={species.length}
        totalCount={totalCount}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      {species.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white/80 p-8 text-center text-stone-600">
          ไม่พบข้อมูลเห็ดตามเงื่อนไขที่เลือก
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {species.map(({ mushroom, round }) => (
            <MushroomCard
              key={`${round}-${mushroom.scientificName}`}
              mushroom={mushroom}
              detailHref={`/round/${round}`}
              foundInPeriods={[round]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
