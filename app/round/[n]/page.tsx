import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { RoundExplorer } from "@/components/RoundExplorer";

type MushroomRecord = {
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
};

type RoundData = {
  round: number;
  date: string;
  speciesCount: number;
  mushrooms: MushroomRecord[];
  avgTemperature: number | null;
  avgHumidity: number | null;
};

async function getRoundData(round: number): Promise<RoundData | null> {
  const filePath = path.join(process.cwd(), "data", `round-${round}.json`);
  try {
    const file = await fs.readFile(filePath, "utf8");
    return JSON.parse(file) as RoundData;
  } catch {
    return null;
  }
}

async function getSummary() {
  const summaryPath = path.join(process.cwd(), "data", "summary.json");
  const file = await fs.readFile(summaryPath, "utf8");
  return JSON.parse(file) as Array<{ round: number }>;
}

export async function generateStaticParams() {
  const rounds = await getSummary();
  return rounds.map((round) => ({ n: String(round.round) }));
}

export default async function RoundPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const roundNumber = Number(n);
  const roundData = await getRoundData(roundNumber);

  if (!roundData) {
    notFound();
  }

  const summary = await getSummary();
  const currentIndex = summary.findIndex((item) => item.round === roundNumber);
  const previousRound = currentIndex > 0 ? summary[currentIndex - 1].round : null;
  const nextRound = currentIndex >= 0 && currentIndex < summary.length - 1 ? summary[currentIndex + 1].round : null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f6efe1,_#f8f5ed_45%,_#eef3ea_100%)] px-4 py-8 text-stone-800 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <RoundExplorer roundData={roundData} previousRound={previousRound} nextRound={nextRound} />
      </div>
    </main>
  );
}
