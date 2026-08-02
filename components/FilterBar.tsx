"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  return values.filter(Boolean);
}

function FilterDropdown({
  label,
  options,
  selected,
  onApply,
}: {
  label: string;
  options: string[];
  selected: string[];
  onApply: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>(selected);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(selected);
  }, [selected]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setDraft(selected);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, selected]);

  const toggleOption = (option: string) => {
    setDraft((prev) =>
      prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
          selected.length > 0
            ? "border-emerald-700 bg-emerald-50 text-emerald-800"
            : "border-stone-300 bg-stone-50 text-stone-700 hover:border-emerald-700 hover:text-emerald-700"
        }`}
      >
        <span>
          {label}
          {selected.length > 0 ? ` (${selected.length})` : ""}
        </span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-72 max-w-[90vw] rounded-2xl border border-stone-200 bg-white p-3 shadow-lg">
          <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {options.length === 0 ? (
              <p className="p-2 text-sm text-stone-500">ไม่มีตัวเลือก</p>
            ) : (
              options.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-sm text-stone-700 hover:bg-stone-50"
                >
                  <input
                    type="checkbox"
                    checked={draft.includes(option)}
                    onChange={() => toggleOption(option)}
                    className="h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-700"
                  />
                  {option}
                </label>
              ))
            )}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
            <button
              onClick={() => setDraft([])}
              className="text-xs font-medium text-stone-500 hover:text-stone-700"
            >
              ล้างข้อนี้
            </button>
            <button
              onClick={() => {
                onApply(draft);
                setOpen(false);
              }}
              className="rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  );
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

  const familyOptions = useMemo(() => toOptionSet(collectUniqueValues(mushrooms.map((m) => m.family))), [mushrooms]);
  const groupOptions = useMemo(() => toOptionSet(collectUniqueValues(mushrooms.map((m) => m.group))), [mushrooms]);
  const habitatOptions = useMemo(() => toOptionSet(collectUniqueValues(mushrooms.map((m) => m.habitat))), [mushrooms]);
  const ecoRoleOptions = useMemo(() => toOptionSet(collectUniqueValues(mushrooms.map((m) => m.ecologicalRole))), [mushrooms]);
  const edibilityOptions = useMemo(() => toOptionSet(collectUniqueValues(mushrooms.map((m) => m.edibility))), [mushrooms]);
  const periodOptions = useMemo(() => {
    const values = mushrooms.flatMap((m) => m.foundInPeriods.map((period) => String(period)));
    return [...new Set(values)].sort((a, b) => Number(a) - Number(b));
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

  return (
    <section className={`rounded-[2rem] border border-stone-200 bg-white/90 p-5 shadow-sm ${className ?? ""}`.trim()}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">ค้นหาและกรองเห็ด</p>
            <p className="mt-1 text-sm text-stone-600">ค้นหาชื่อเห็ดและจำกัดผลลัพธ์ตามข้อมูลสภาพแวดล้อมและช่วงเวลาที่พบ</p>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                พบ {visibleCount} จาก {totalCount} ชนิด
              </span>
            )}
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

        <label className="text-sm font-medium text-stone-700">
          <span className="mb-2 block">ค้นหาชื่อชนิด</span>
          <input
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="เช่น Amanita, เห็ดหูหนู"
            className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none ring-0 focus:border-emerald-700"
          />
        </label>

        {/* ตัวกรองแต่ละหัวข้อเป็นปุ่มป้อปอัพ กดแล้วเลือกได้เลย ไม่กินพื้นที่หน้าจอตลอดเวลา */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          <FilterDropdown label="วงศ์" options={familyOptions} selected={families} onApply={(v) => { setFamilies(v); updateFilters({ families: v }); }} />
          <FilterDropdown label="กลุ่มเห็ด" options={groupOptions} selected={groups} onApply={(v) => { setGroups(v); updateFilters({ groups: v }); }} />
          <FilterDropdown label="แหล่งกำเนิด" options={habitatOptions} selected={habitats} onApply={(v) => { setHabitats(v); updateFilters({ habitats: v }); }} />
          <FilterDropdown label="หน้าที่ในระบบนิเวศ" options={ecoRoleOptions} selected={ecoRoles} onApply={(v) => { setEcoRoles(v); updateFilters({ ecoRoles: v }); }} />
          <FilterDropdown label="การรับประทาน" options={edibilityOptions} selected={edibilities} onApply={(v) => { setEdibilities(v); updateFilters({ edibilities: v }); }} />
          {includePeriodFilter && (
            <FilterDropdown label="ช่วงเวลาที่พบ" options={periodOptions} selected={periods} onApply={(v) => { setPeriods(v); updateFilters({ periods: v }); }} />
          )}
          <FilterDropdown label="จุดที่พบ" options={pointOptions} selected={points} onApply={(v) => { setPoints(v); updateFilters({ points: v }); }} />
        </div>
      </div>
    </section>
  );
}