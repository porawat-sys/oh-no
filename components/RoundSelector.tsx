import Link from "next/link";

type RoundSummary = {
  round: number;
  date: string;
  speciesCount: number;
};

export function RoundSelector({ rounds }: { rounds: RoundSummary[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {rounds.map((round) => (
        <Link
          key={round.round}
          href={`/round/${round.round}`}
          className="group rounded-[1.25rem] border border-stone-200 bg-white/90 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-700 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                ครั้งที่ {round.round}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-stone-800">{round.date}</h3>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
              {round.speciesCount} ชนิด
            </span>
          </div>
          <p className="mt-4 text-sm text-stone-600">
            เปิดดูผลสำรวจเห็ดทั้งหมดในรอบนี้และกรองตามชนิดของเห็ดได้ทันที
          </p>
        </Link>
      ))}
    </div>
  );
}
