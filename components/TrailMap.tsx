"use client";

// จุดบนเส้นทางหลัก (เส้นทึบ) เรียงจากจุดเริ่มต้น -> ค่ายพักแรม
// ระยะทางเป็น "ระยะสะสม" จากจุดเริ่มต้น (กม.) ตรงตามป้ายในภาพต้นฉบับ
const TRAIL_POINTS = [
  { name: "ศูนย์บริการนักท่องเที่ยว", distanceKm: 0 },
  { name: "ประดู่ใหญ่", distanceKm: 1 },
  { name: "มออีหก", distanceKm: 1.4 },
  { name: "จุดชมวิว", distanceKm: 1.6 },
  { name: "ตะเคียนคู่", distanceKm: 1.9 },
  { name: "น้ำดิบผามะหาด", distanceKm: 2.3 },
  { name: "ชานเบิกภัย", distanceKm: 2.7 },
  { name: "ไทรงาม", distanceKm: 3 },
  { name: "ปล่องนางนาค", distanceKm: 3.3 },
  { name: "พระยาแล่นเรือ", distanceKm: 3.5 },
  { name: "ค่ายพักแรม", distanceKm: 3.7 },
];

// ตำแหน่ง x เยื้องซ้าย-ขวาเล็กน้อยของแต่ละจุด เพื่อให้เส้นดูโค้งแบบทางเดินป่า (ไม่ตรงดิ่งจนน่าเบื่อ)
// ค่าเป็น offset จากกึ่งกลาง (0 = กึ่งกลางเป๊ะ)
const X_OFFSETS = [0, -15, 10, -8, 12, -12, 8, -10, 14, -6, 4];

const VIEW_WIDTH = 300;
const VIEW_HEIGHT = 620;
const TOP_MARGIN = 40;
const BOTTOM_MARGIN = 40;
const CENTER_X = VIEW_WIDTH / 2;

function buildPoints() {
  const totalDistance = TRAIL_POINTS[TRAIL_POINTS.length - 1].distanceKm;
  const usableHeight = VIEW_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN;

  return TRAIL_POINTS.map((point, index) => {
    // จุดเริ่มต้นอยู่ล่างสุด (เหมือนภาพต้นฉบับ) ไล่ระยะทางขึ้นไปด้านบน
    const ratio = point.distanceKm / totalDistance;
    const y = VIEW_HEIGHT - BOTTOM_MARGIN - ratio * usableHeight;
    const x = CENTER_X + X_OFFSETS[index];
    return { ...point, x, y };
  });
}

function buildPathD(points: ReturnType<typeof buildPoints>) {
  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    // เส้นโค้งนุ่มๆ ระหว่างจุด แบบทางเดินธรรมชาติ
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export function TrailMap() {
  const points = buildPoints();
  const pathD = buildPathD(points);

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-stone-900">เส้นทางศึกษาธรรมชาติเขาหลวง</h2>
      <p className="mt-2 text-sm text-stone-600">
        ระยะทางสะสมจากศูนย์บริการนักท่องเที่ยวถึงค่ายพักแรม รวม {TRAIL_POINTS[TRAIL_POINTS.length - 1].distanceKm} กม.
      </p>

      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="mx-auto mt-4 h-[560px] w-full max-w-sm"
      >
        {/* เส้นทางหลัก */}
        <path
          d={pathD}
          fill="none"
          stroke="#7c2d3e"
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* จุดหมุดแต่ละจุด + ป้ายชื่อ/ระยะทาง */}
        {points.map((point, index) => {
          const isStart = index === 0;
          const isEnd = index === points.length - 1;
          const labelSide = index % 2 === 0 ? "right" : "left";

          return (
            <g key={point.name}>
              <circle
                cx={point.x}
                cy={point.y}
                r={isStart || isEnd ? 8 : 6}
                fill="#ffffff"
                stroke="#7c2d3e"
                strokeWidth={3}
              />
              <text
                x={labelSide === "right" ? point.x + 14 : point.x - 14}
                y={point.y - 6}
                textAnchor={labelSide === "right" ? "start" : "end"}
                className="fill-stone-800 text-[10px] font-semibold"
              >
                {point.name}
              </text>
              <text
                x={labelSide === "right" ? point.x + 14 : point.x - 14}
                y={point.y + 8}
                textAnchor={labelSide === "right" ? "start" : "end"}
                className="fill-stone-500 text-[9px]"
              >
                {point.distanceKm} กม.
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}