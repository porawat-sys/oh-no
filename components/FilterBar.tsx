"use client";

import { useMemo, useState } from "react";
import type { MushroomRecord } from "@/components/types";
import { collectUniqueValues, matchesFilters, type FilterState } from "@/components/filterUtils";

type FilterBarProps = {
  mushrooms: MushroomRecord[];
  includePeriodFilter?: boolean;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  visibleCount: number;
  totalCount: number;
  className?: string;
};

const ALL = "ทั้งหมด";

function toOptionSet(values: string[]) {
  return [ALL, ...values.filter(Boolean)];
}

export function FilterBar({
  mushrooms,
  includePeriodFilter = false,
  onChange,
  onClear,
  visibleCount,
  totalCount,
  className,
}: FilterBarProps) {
  const [query, setQuery] = useState("");
  const [families, setFamilies] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [habitats, setHabitats] = useState<string[]>([]);
  const [ecoRoles, setEcoRoles] = useState<string[]>([]);
  const [edibilities, setEdibilities] = useState<string[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [points, setPoints] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const familyOptions = useMemo(() => toOptionSet(collectUniqueValues(mushrooms.map((m) => m.family))), [mushrooms]);
  const groupOptions = useMemo(() => toOptionSet(collectUniqueValues(mushrooms.map((m) => m.group))), [mushrooms]);
  const habitatOptions = useMemo(() => toOptionSet(collectUniqueValues(mushrooms.map((m) => m.habitat))), [mushrooms]);
  const ecoRoleOptions = useMemo(() => toOptionSet(collectUniqueValues(mushrooms.map((m) => m.ecologicalRole))), [mushrooms]);
  const edibilityOptions = useMemo(() => toOptionSet(collectUniqueValues(mushrooms.map((m) => m.edibility))), [mushrooms]);
  const periodOptions = useMemo(() => {
    const values = mushrooms.flatMap((m) => m.foundInPeriods.map((period) => String(period)));
    const unique = [...new Set(values)].sort((a, b) => Number(a) - Number(b));
    return [ALL, ...unique];
  }, [mushrooms]);
  const pointOptions = useMemo(() => toOptionSet(collectUniqueValues(mushrooms.map((m) => m.pointsFound))), [mushrooms]);

  const updateFilters = (next: Partial<FilterState>) => {
    const filters: FilterState = {
      query,
      families,
      groups,
      habitats,
      ecoRoles,
      edibilities,
      periods,
      points,
      ...next,
    };
    onChange(filters);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    updateFilters({ query: value });
  };

  const handleMultiSelect = (
    selected: string[],
    setter: (value: string[]) => void,
    key: keyof FilterState
  ) => {
    setter(selected);
    updateFilters({ [key]: selected } as Partial<FilterState>);
  };

  const resetFilters = () => {
    setQuery("");
    setFamilies([]);
    setGroups([]);
    setHabitats([]);
    setEcoRoles([]);
    setEdibilities([]);
    setPeriods([]);
    setPoints([]);
    onClear();
  };

  const activeFilterCount =
    families.length + groups.length + habitats.length + ecoRoles.length + edibilities.length + periods.length + points.length;
  const hasActiveFilters = query || activeFilterCount > 0;

  const renderSelect = (
    label: string,
    options: string[],
    value: string[],
    onChange: (value: string[]) => void,
    key: keyof FilterState
  ) => (
    <label className="text-sm font-medium text-stone-700">
      <span className="mb-2 block">{label}</span>
      <select
        multiple
        size={Math.min(5, options.length)}
        value={value}
        onChange={(event) => {
          const selected = Array.from(event.target.selectedOptions, (option) => option.value).filter((op) => op !== ALL);
          onChange(selected);
          updateFilters({ [key]: selected } as Partial<FilterState>);
        }}
        className="min-h-36 w-full rounded-2xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-700"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <section className={`rounded-[2rem] border border-stone-200 bg-white/90 p-5 shadow-sm ${className ?? ""}`.trim()}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">ค้นหาและกรองเห็ด</p>
            <p className="mt-1 text-sm text-stone-600">ค้นหาชื่อเห็ดและจำกัดผลลัพธ์ตามข้อมูลสภาพแวดล้อมและช่วงเวลาที่พบ</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
              พบ {visibleCount} จาก {totalCount} ชนิด
            </span>
            {hasActiveFilters ? (
              <button
                onClick={resetFilters}
                className="rounded-full border border-stone-300 px-3 py-1 text-sm font-medium text-stone-600 transition hover:border-emerald-700 hover:text-emerald-700"
              >
                ล้างตัวกรองทั้งหมด ✕
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex-1 text-sm font-medium text-stone-700">
            <span className="mb-2 block">ค้นหาชื่อชนิด</span>
            <input
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder="เช่น Amanita, เห็ดหูหนู"
              className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none ring-0 focus:border-emerald-700"
            />
          </label>

          {/* ปุ่มกดเปิด/ปิดตัวกรอง ใช้ได้ทุกขนาดจอ ไม่ผูกกับ breakpoint อีกต่อไป */}
          <button
            onClick={() => setFiltersOpen((value) => !value)}
            className="flex items-center justify-center gap-2 self-end rounded-2xl border border-stone-300 bg-stone-50 px-5 py-3 text-sm font-medium text-stone-700 transition hover:border-emerald-700 hover:text-emerald-700 sm:self-auto"
          >
            ตัวกรอง{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            <span className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}>▾</span>
          </button>
        </div>

        {filtersOpen ? (
          <div className="grid gap-3 border-t border-stone-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {renderSelect("วงศ์", familyOptions, families, (value) => handleMultiSelect(value, setFamilies, "families"), "families")}
            {renderSelect("กลุ่มเห็ด", groupOptions, groups, (value) => handleMultiSelect(value, setGroups, "groups"), "groups")}
            {renderSelect("แหล่งกำเนิด", habitatOptions, habitats, (value) => handleMultiSelect(value, setHabitats, "habitats"), "habitats")}
            {renderSelect("หน้าที่ในระบบนิเวศ", ecoRoleOptions, ecoRoles, (value) => handleMultiSelect(value, setEcoRoles, "ecoRoles"), "ecoRoles")}
            {renderSelect("การรับประทาน", edibilityOptions, edibilities, (value) => handleMultiSelect(value, setEdibilities, "edibilities"), "edibilities")}
            {includePeriodFilter ? renderSelect("ช่วงเวลาที่พบ", periodOptions, periods, (value) => handleMultiSelect(value, setPeriods, "periods"), "periods") : null}
            {renderSelect("จุดที่พบ", pointOptions, points, (value) => handleMultiSelect(value, setPoints, "points"), "points")}
          </div>
        ) : null}
      </div>
    </section>
  );
}