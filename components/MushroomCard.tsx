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

function getEdibilityClass(edibility: string) {
  if (edibility.includes("กินได้")) {
    return "bg-emerald-100 text-emerald-800";
  }
  if (edibility.includes("กินไม่ได้")) {
    return "bg-rose-100 text-rose-800";
  }
  return "bg-stone-100 text-stone-700";
}

export function MushroomCard({ mushroom }: { mushroom: MushroomRecord }) {
  const imageSrc = mushroom.images?.[0] ?? "/images/placeholder-mushroom.png";

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white shadow-sm">
      <div className="h-48 overflow-hidden bg-stone-100">
        <img
          src={imageSrc}
          alt={mushroom.scientificName}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(event) => {
            const target = event.currentTarget as HTMLImageElement;
            target.src = "/images/placeholder-mushroom.png";
          }}
        />
      </div>
      <div className="space-y-3 p-5">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            {mushroom.family}
          </p>
          <h3 className="text-lg font-semibold text-stone-900">
            <em>{mushroom.scientificName}</em>
          </h3>
          <p className="text-sm text-stone-600">{mushroom.localName}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            {mushroom.group}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${getEdibilityClass(mushroom.edibility)}`}>
            {mushroom.edibility}
          </span>
        </div>

        <div className="grid gap-2 rounded-2xl bg-stone-50 p-3 text-sm text-stone-700">
          <div className="flex items-center justify-between">
            <span>พบทั้งหมด</span>
            <span className="font-semibold text-stone-900">{mushroom.totalFound} ครั้ง</span>
          </div>
          <div className="flex items-center justify-between">
            <span>พบในจุด</span>
            <span className="font-semibold text-stone-900">{mushroom.pointsFoundCount} จุด</span>
          </div>
          <div className="text-xs text-stone-500">แหล่งกำเนิด: {mushroom.habitat}</div>
          <div className="text-xs text-stone-500">บทบาท: {mushroom.ecologicalRole}</div>
        </div>

        {mushroom.pointsFoundCount > 0 ? (
          <details className="rounded-2xl border border-stone-200 p-3 text-sm text-stone-600">
            <summary className="cursor-pointer font-medium text-stone-800">ดูรายชื่อจุดที่พบ</summary>
            <ul className="mt-2 space-y-1">
              {mushroom.pointsFound.map((point) => (
                <li key={point} className="text-xs leading-5 text-stone-600">
                  • {point}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>
    </article>
  );
}
