"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FilterBar } from "@/components/FilterBar";
import { MushroomCard } from "@/components/MushroomCard";
import { WeatherSummary } from "@/components/WeatherSummary";
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

export function AllPeriodsExplorer({ rounds }: Props) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const visibleRounds = useMemo(() => {
    return rounds
      .map((round) => ({
        ...round,
        filteredMushrooms: round.mushrooms.filter((mushroom) => matchesFilters(mushroom, filters)),
      }))
      .filter((round) => round.filteredMushrooms.length > 0);
  }, [filters, rounds]);

  const visibleCount = visibleRounds.reduce((sum, round) => sum + round.filteredMushrooms.length, 0);

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
              ผลสำรวจเห็ดจากทั้ง 7 รอบ
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-stone-900 sm:text-4xl">
              ผลสำรวจทั้ง 7 รอบเรียงต่อกันในหน้าเดียว
            </h1>
            <p className="mt-3 max-w-2xl text-base text-stone-600">
              เลือกช่วงเวลาและกรองชนิดเห็ดได้แบบเรียลไทม์โดยไม่ต้องเลื่อนหาจากรอบละรอบ
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-emerald-700 hover:text-emerald-700"
          >
            ← กลับหน้าแรก
          </Link>
        </div>
      </header>

      <FilterBar
        mushrooms={rounds.flatMap((round) => round.mushrooms)}
        includePeriodFilter
        visibleCount={visibleCount}
        totalCount={rounds.reduce((sum, round) => sum + round.mushrooms.length, 0)}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      <div className="flex flex-wrap gap-2">
        {rounds.map((round) => (
          <a
            key={round.round}
            href={`#period-${round.round}`}
            className="rounded-full border border-stone-300 bg-white/80 px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-emerald-700 hover:text-emerald-700"
          >
            รอบที่ {round.round}
          </a>
        ))}
      </div>

      {visibleRounds.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white/80 p-8 text-center text-stone-600">
          ไม่พบข้อมูลเห็ดตามเงื่อนไขที่เลือก
        </div>
      ) : null}

      {visibleRounds.map((round) => (
        <section
          key={round.round}
          id={`period-${round.round}`}
          className="rounded-[2rem] border border-stone-200 bg-white/90 p-5 shadow-sm sm:p-8"
        >
          <div className="flex flex-col gap-3 border-b border-stone-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                ช่วงเวลาที่ {round.round}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-900">{round.date}</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
              {round.filteredMushrooms.length} ชนิดที่ตรงเงื่อนไข
            </span>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {round.filteredMushrooms.map((mushroom) => (
              <MushroomCard
                key={`${round.round}-${mushroom.scientificName}`}
                mushroom={mushroom}
                detailHref={`/round/${round.round}`}
                foundInPeriods={[round.round]}
              />
            ))}
          </div>

          <div className="mt-8">
            <WeatherSummary avgTemperature={round.avgTemperature} avgHumidity={round.avgHumidity} />
          </div>
        </section>
      ))}
    </div>
  );
}
