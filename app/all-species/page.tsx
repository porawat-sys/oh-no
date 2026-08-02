import { promises as fs } from "fs";
import path from "path";
import { AllSpeciesExplorer } from "@/components/AllSpeciesExplorer";
import type { RoundData } from "@/components/types";

async function getRoundData(round: number): Promise<RoundData | null> {
  const filePath = path.join(process.cwd(), "data", `round-${round}.json`);
  try {
    const file = await fs.readFile(filePath, "utf8");
    return JSON.parse(file) as RoundData;
  } catch {
    return null;
  }
}

export default async function AllSpeciesPage() {
  const rounds: RoundData[] = [];
  for (let round = 1; round <= 7; round += 1) {
    const roundData = await getRoundData(round);
    if (roundData) {
      rounds.push(roundData);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f6efe1,_#f8f5ed_45%,_#eef3ea_100%)] px-4 py-8 text-stone-800 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <AllSpeciesExplorer rounds={rounds} />
      </div>
    </main>
  );
}
