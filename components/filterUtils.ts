import type { MushroomRecord } from "@/components/types";

export type FilterState = {
  query: string;
  families: string[];
  groups: string[];
  habitats: string[];
  ecoRoles: string[];
  edibilities: string[];
  periods: string[];
  points: string[];
};

export function normalizeText(value: string | null | undefined): string {
  return (value ?? "").toString().trim();
}

export function normalizeValues(value: string | string[] | null | undefined): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeText(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    return normalizeText(value)
      .split(/[;,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function toDisplayText(value: string | string[] | null | undefined): string {
  const values = normalizeValues(value);
  return values.join(", ");
}

export function isUnknownSpecies(mushroom: Pick<MushroomRecord, "scientificName" | "localName">) {
  const scientificName = normalizeText(mushroom.scientificName).toLowerCase();
  const localName = normalizeText(mushroom.localName).toLowerCase();
  return scientificName === "ระบุไม่ได้" || localName === "ระบุไม่ได้";
}

export function matchesFilters(mushroom: MushroomRecord, filters: FilterState) {
  const query = filters.query.trim().toLowerCase();
  const matchesQuery =
    !query ||
    normalizeText(mushroom.scientificName).toLowerCase().includes(query) ||
    normalizeText(mushroom.localName).toLowerCase().includes(query) ||
    normalizeText(mushroom.family).toLowerCase().includes(query);

  const familyValues = normalizeValues(mushroom.family);
  const groupValues = normalizeValues(mushroom.group);
  const habitatValues = normalizeValues(mushroom.habitat);
  const ecoRoleValues = normalizeValues(mushroom.ecologicalRole);
  const edibilityValues = normalizeValues(mushroom.edibility);
  const pointValues = mushroom.pointsFound.map((point) => normalizeText(point));

  const matchesFamily = filters.families.length === 0 || filters.families.some((value) => familyValues.includes(value));
  const matchesGroup = filters.groups.length === 0 || filters.groups.some((value) => groupValues.includes(value));
  const matchesHabitat = filters.habitats.length === 0 || filters.habitats.some((value) => habitatValues.includes(value));
  const matchesEcoRole = filters.ecoRoles.length === 0 || filters.ecoRoles.some((value) => ecoRoleValues.includes(value));
  const matchesEdibility = filters.edibilities.length === 0 || filters.edibilities.some((value) => edibilityValues.includes(value));
  const matchesPeriod = filters.periods.length === 0 || filters.periods.some((value) => mushroom.foundInPeriods.includes(Number(value)));
  const matchesPoint = filters.points.length === 0 || filters.points.some((value) => pointValues.includes(value));

  return matchesQuery && matchesFamily && matchesGroup && matchesHabitat && matchesEcoRole && matchesEdibility && matchesPeriod && matchesPoint;
}

export function collectUniqueValues(items: Array<string | string[] | null | undefined>) {
  const seen = new Set<string>();
  const values: string[] = [];

  items.forEach((item) => {
    normalizeValues(item).forEach((value) => {
      if (!seen.has(value)) {
        seen.add(value);
        values.push(value);
      }
    });
  });

  return values.sort((a, b) => a.localeCompare(b, "th", { sensitivity: "base" }));
}
