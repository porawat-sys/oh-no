export type MushroomRecord = {
  scientificName: string;
  localName: string;
  family: string;
  group: string[];
  habitat: string[];
  ecologicalRole: string[];
  edibility: string[];
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
  foundInPeriods: number[];
};

export type RoundData = {
  round: number;
  date: string;
  speciesCount: number;
  mushrooms: MushroomRecord[];
  avgTemperature: number | null;
  avgHumidity: number | null;
};
