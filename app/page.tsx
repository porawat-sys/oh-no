import { promises as fs } from "fs";
import path from "path";
import { TrailMap } from "@/components/TrailMap";
import { RoundSelector } from "@/components/RoundSelector";
import { AllSpeciesSection } from "@/components/AllSpeciesSection";

type RoundSummary = {
  round: number;
  date: string;
  speciesCount: number;
};

async function getSummary() {
  const summaryPath = path.join(process.cwd(), "data", "summary.json");
  const file = await fs.readFile(summaryPath, "utf8");
  return JSON.parse(file) as RoundSummary[];
}

async function getRoundData(round: number) {
  const filePath = path.join(process.cwd(), "data", `round-${round}.json`);
  const file = await fs.readFile(filePath, "utf8");
  return JSON.parse(file);
}

export default async function HomePage() {
  const rounds = await getSummary();
  const roundData = await Promise.all(Array.from({ length: 7 }, (_, index) => getRoundData(index + 1)));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f6efe1,_#f8f5ed_45%,_#eef3ea_100%)] px-4 py-10 text-stone-800 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="rounded-[2rem] border border-stone-200/80 bg-white/90 p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                Mushroom Database
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-900 sm:text-5xl">
                ฐานข้อมูลเห้ดในเส้นทางศึกษาธรรมชาติยอดเขาหลวง อุทยานแห่งชาติรามคำแหง จังหวัดสุโขทัย ช่วงเดือนพฤศจิกายน 2568 ถึง กรกฎาคม 2569
              </h1>
              <p className="mt-4 text-lg text-stone-600">
                เว็บไซต์นี้รวบรวมข้อมูลผลสำรวจเห็ดจาก 7 รอบการเดินป่า โดยแสดงภาพรวมเส้นทางและรายละเอียดชนิดเห็ดที่พบในแต่ละช่วงเวลา
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-emerald-900/10 bg-emerald-50 px-5 py-4 text-sm text-stone-700">
              <div className="font-semibold text-emerald-900">ข้อมูลที่แสดง</div>
              <div className="mt-2">7 รอบการสำรวจ • 7 ไฟล์ข้อมูล Excel • รูปภาพจากแถวข้อมูลจริง</div>
            </div>
          </div>
        </header>

        {/* ช่องค้นหา + ตัวกรอง (ครอบคลุมทั้ง 7 รอบ) ย้ายมาไว้บนสุด เหนือแผนที่เส้นทาง */}
        <AllSpeciesSection rounds={roundData} />

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <TrailMap />
          <div className="space-y-5">
            <div className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-stone-900">เลือกช่วงเวลาสำรวจ</h2>
              <p className="mt-2 text-sm text-stone-600">
                กดปุ่มเพื่อเปิดผลสำรวจของแต่ละรอบและเรียกดูชนิดเห็ดที่ค้นพบในช่วงเวลานั้น
              </p>
            </div>
            <RoundSelector rounds={rounds} />
          </div>
        </section>
      </div>
    </main>
  );
}