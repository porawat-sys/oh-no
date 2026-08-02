"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FilterBar } from "@/components/FilterBar";
import { MushroomCard } from "@/components/MushroomCard";
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

type Props = {
  rounds: RoundData[];
};

function hasAnyActiveFilter(filters: FilterState) {
  return Boolean(
    filters.query ||
      filters.families.length ||
      filters.groups.length ||
      filters.habitats.length ||
      filters.ecoRoles.length ||
      filters.edibilities.length ||
      filters.periods.length ||
      filters.points.length
  );
}

export function AllSpeciesSection({ rounds }: Props) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const allSpecies = useMemo(() => {
    const unique: Array<{ mushroom: MushroomRecord; rounds: number[] }> = [];
    const map = new Map<string, { mushroom: MushroomRecord; rounds: number[] }>();

    rounds.forEach((round) => {
      round.mushrooms.forEach((mushroom) => {
        const existing = map.get(mushroom.scientificName);
        if (existing) {
          existing.rounds.push(round.round);
        } else {
          map.set(mushroom.scientificName, { mushroom, rounds: [round.round] });
        }
      });
    });

    map.forEach((value) => unique.push(value));
    return unique;
  }, [rounds]);

  const isActive = hasAnyActiveFilter(filters);

  const species = useMemo(() => {
    if (!isActive) return [];
    return allSpecies.filter(({ mushroom }) => matchesFilters(mushroom, filters));
  }, [allSpecies, filters, isActive]);

  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">ค้นหาเห็ดจากทั้ง 7 รอบ</p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-900">พิมพ์ค้นหาหรือเลือกตัวกรองเพื่อดูชนิดเห็ด</h2>
          <p className="mt-2 text-sm text-stone-600">ค้นได้ครอบคลุมข้อมูลทุกรอบพร้อมกัน ผลลัพธ์จะเชื่อมไปยังรอบที่พบ</p>
        </div>
        <Link href="/all" className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-emerald-700 hover:text-emerald-700">
          ดูหน้าทั้งหมด 7 รอบ →
        </Link>
      </div>

      <div className="mt-8">
        <FilterBar
          mushrooms={rounds.flatMap((round) => round.mushrooms)}
          visibleCount={species.length}
          totalCount={allSpecies.length}
          onChange={setFilters}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      </div>

      {!isActive ? (
        <div className="mt-6 rounded-[2rem] border border-dashed border-stone-300 bg-stone-50/80 p-8 text-center text-stone-600">
          พิมพ์ค้นหาชื่อเห็ด หรือกดเลือกตัวกรองด้านบน เพื่อแสดงรายชื่อเห็ดที่ตรงกับเงื่อนไข
        </div>
      ) : species.length === 0 ? (
        <div className="mt-6 rounded-[2rem] border border-dashed border-stone-300 bg-stone-50/80 p-8 text-center text-stone-600">
          ไม่พบข้อมูลเห็ดตามเงื่อนไขที่เลือก
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {species.map(({ mushroom, rounds: matchRounds }) => (
            <MushroomCard
              key={mushroom.scientificName}
              mushroom={mushroom}
              detailHref={matchRounds.length === 1 ? `/round/${matchRounds[0]}` : undefined}
              foundInPeriods={matchRounds}
            />
          ))}
        </div>
      )}
    </section>
  );
}