type WeatherSummaryProps = {
  avgTemperature: number | null;
  avgHumidity: number | null;
};

export function WeatherSummary({ avgTemperature, avgHumidity }: WeatherSummaryProps) {
  return (
    <div className="rounded-[2rem] border border-emerald-900/10 bg-gradient-to-br from-emerald-900 to-stone-800 p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">
            สรุปสภาพอากาศ
          </p>
          <h3 className="mt-2 text-2xl font-semibold">ข้อมูลกลางรอบสำรวจ</h3>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.2rem] border border-white/20 bg-white/10 p-4 backdrop-blur">
          <div className="text-sm text-emerald-100">อุณหภูมิอากาศเฉลี่ย</div>
          <div className="mt-2 text-4xl font-semibold">{avgTemperature ?? "—"}°C</div>
        </div>
        <div className="rounded-[1.2rem] border border-white/20 bg-white/10 p-4 backdrop-blur">
          <div className="text-sm text-emerald-100">ความชื้นสัมพัทธ์เฉลี่ย</div>
          <div className="mt-2 text-4xl font-semibold">{avgHumidity ?? "—"}%</div>
        </div>
      </div>
    </div>
  );
}
