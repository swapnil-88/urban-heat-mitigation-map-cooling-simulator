import React, { useState, useMemo } from "react";
import { CoolingResult, ZoneData, TreeSpecies, SimulationParams } from "../types";
import {
  Thermometer,
  Zap,
  Flame,
  Droplets,
  TrendingDown,
  Info,
  Calendar,
  Sparkles,
  TreeDeciduous,
  ShieldCheck,
  HelpCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { calculate10YearGrowthTrend, GrowthYearData } from "../utils/microclimateEngine";

interface MetricsOverviewProps {
  zone: ZoneData;
  coolingResult: CoolingResult;
  species: TreeSpecies;
  treeCount: number;
  timeOfDay?: "12PM" | "03PM" | "07PM";
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  zone,
  coolingResult,
  species,
  treeCount,
  timeOfDay = "03PM"
}) => {
  const [chartMode, setChartMode] = useState<"temperature" | "coolingDrop">("temperature");
  const [activeStageFilter, setActiveStageFilter] = useState<string | null>(null);

  // Generate 10-year growth projection data
  const trendData: GrowthYearData[] = useMemo(() => {
    return calculate10YearGrowthTrend(zone, species, treeCount, timeOfDay);
  }, [zone, species, treeCount, timeOfDay]);

  const isRecommended = useMemo(() => {
    return (
      zone.primarySpecies.some((ps) => ps.id === species.id) ||
      species.idealZones?.includes(zone.id)
    );
  }, [zone, species]);

  // Max cooling achieved at year 10
  const year10 = trendData[trendData.length - 1];
  const baselineAir = zone.baseTempAir;

  return (
    <div className="space-y-4 font-sans text-slate-900">
      {/* 1. Four Intuitive Key Outcome Cards (Understood by Any Non-Tech Visitor) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Air Cooling */}
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs hover:shadow-sm transition space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Air Temperature Drop
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-mono tabular-nums font-bold text-emerald-800">
                -{coolingResult.deltaTAir}&deg;C
              </span>
              <span className="text-xs text-slate-500 font-medium">
                cooler breeze
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span>Current Air: <strong className="text-slate-900 font-semibold">{coolingResult.currentAirTemp}&deg;C</strong></span>
              <span className="text-slate-400 text-[11px] line-through">{zone.baseTempAir}&deg;C</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
            💡 Leaves block harsh sunlight and release cool moisture, reducing the ambient air temperature.
          </div>
        </div>

        {/* Card 2: Road & Ground Surface Heat */}
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs hover:shadow-sm transition space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Road & Ground Heat
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Flame className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-mono tabular-nums font-bold text-amber-800">
                -{coolingResult.deltaTSurface}&deg;C
              </span>
              <span className="text-xs text-slate-500 font-medium">
                surface heat drop
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span>Shaded Ground: <strong className="text-slate-900 font-semibold">{coolingResult.currentSurfaceTemp}&deg;C</strong></span>
              <span className="text-slate-400 text-[11px] line-through">{zone.baseTempSurface}&deg;C</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
            🛣️ Footpaths and asphalt won&apos;t bake in the open sun, preventing heat from radiating into people.
          </div>
        </div>

        {/* Card 3: Green Shade Area */}
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs hover:shadow-sm transition space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Green Tree Canopy
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
              <Droplets className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-mono tabular-nums font-bold text-sky-800">
                {coolingResult.canopyCoveragePct}%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                of neighborhood shaded
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Total Shade: <strong className="text-slate-900 font-semibold">{coolingResult.canopyCoverageSqM.toLocaleString()} m&sup2;</strong>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
            🌳 Equivalent to {Math.round(coolingResult.canopyCoverageSqM / 400)} basketball courts of lush shade.
          </div>
        </div>

        {/* Card 4: Community Relief & Electricity Saved */}
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs hover:shadow-sm transition space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Comfort & Power Saved
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-slate-900 truncate">
                {coolingResult.heatIndexLevel}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              AC Saved: <strong className="text-slate-900 font-semibold">{coolingResult.energySavingsKwhYr.toLocaleString()} kWh/yr</strong>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
            ⚡ Lower temperatures mean homes and shops run air-conditioners less, cutting power bills.
          </div>
        </div>
      </div>

      {/* 2. Interactive Recharts 10-Year Cooling Trend by Tree Growth Stages */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg">
                <TrendingDown className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                10-Year Predicted Temperature Cooling Trend
              </h3>
              <span className="hidden md:inline-flex text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                Tree Growth Stages
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span>How temperatures drop as {treeCount.toLocaleString()}</span>
              <span className="font-bold text-slate-900 inline-flex items-center space-x-1">
                {isRecommended && (
                  <span
                    className="relative flex h-2 w-2 shrink-0"
                    title={`Recommended tree for ${zone.shortName}`}
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 ring-2 ring-emerald-200"></span>
                  </span>
                )}
                <span>{species.name}</span>
                <span className="text-[10px] text-slate-500 font-normal">({species.gujaratiName})</span>
              </span>
              <span>trees mature in {zone.name}</span>
              {isRecommended && (
                <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded-md">
                  ● Recommended Area Species
                </span>
              )}
            </div>
          </div>

          {/* Chart Display Mode Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs">
            <button
              onClick={() => setChartMode("temperature")}
              className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                chartMode === "temperature"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Actual Temperatures (&deg;C)
            </button>
            <button
              onClick={() => setChartMode("coolingDrop")}
              className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                chartMode === "coolingDrop"
                  ? "bg-white text-emerald-800 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Cooling Drop Achieved (-&deg;C)
            </button>
          </div>
        </div>

        {/* Tree Growth Stages Visual Progression Legend (Non-Tech Explanation) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center space-x-1 text-slate-700 font-bold">
              <span>🌱</span>
              <span>Years 0–2: Sapling</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Roots take hold. Small canopy (~20% mature size). Initial shade along pavements.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700">
              Cooling: ~{trendData[2]?.coolingDropAir}&deg;C drop
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center space-x-1 text-slate-700 font-bold">
              <span>🌿</span>
              <span>Years 3–5: Juvenile</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Branches spread rapidly (~60% canopy). Noticeable continuous cooling at street level.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700">
              Cooling: ~{trendData[5]?.coolingDropAir}&deg;C drop
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center space-x-1 text-slate-700 font-bold">
              <span>🌳</span>
              <span>Years 6–8: Maturing</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Dense canopy crowns interlock (~85% shade). High moisture transpiration cooling.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700">
              Cooling: ~{trendData[8]?.coolingDropAir}&deg;C drop
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div className="flex items-center space-x-1 text-emerald-900 font-bold">
              <span>🌲</span>
              <span>Years 9–10: Full Mature</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-tight">
              Maximum biological cooling (100% capacity). Creates a persistent urban microclimate oasis.
            </p>
            <div className="text-[11px] font-bold text-emerald-800">
              Max Cooling: -{year10?.coolingDropAir}&deg;C air drop
            </div>
          </div>
        </div>

        {/* Recharts Line Chart Container */}
        <div className="w-full h-72 sm:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === "temperature" ? (
              <LineChart
                data={trendData}
                margin={{ top: 10, right: 25, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="yearLabel"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  unit="°C"
                  domain={["auto", "auto"]}
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as GrowthYearData;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[230px]">
                          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                            <span className="font-bold text-sm text-emerald-400">
                              {label} ({data.year === 0 ? "Planting" : `${data.year} Years Later`})
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">
                              {data.stageCategory}
                            </span>
                          </div>

                          <div className="text-slate-300 text-[11px]">
                            Stage: <strong className="text-white">{data.stageName}</strong> ({data.maturityPct}% Canopy Growth)
                          </div>

                          <div className="space-y-1 pt-1 font-mono text-[11px]">
                            <div className="flex justify-between items-center">
                              <span className="text-emerald-300">Air Temperature:</span>
                              <span className="font-bold text-emerald-300 text-sm">{data.airTemp}&deg;C</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300">
                              <span>Air Cooling Achieved:</span>
                              <span className="font-bold text-emerald-400">-{data.coolingDropAir}&deg;C</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-amber-300">Ground Surface Temp:</span>
                              <span className="font-bold text-amber-300">{data.surfaceTemp}&deg;C</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300">
                              <span>Ground Heat Drop:</span>
                              <span className="font-bold text-amber-400">-{data.coolingDropSurface}&deg;C</span>
                            </div>
                          </div>

                          <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between">
                            <span>Canopy Area: {data.canopyAreaSqM.toLocaleString()} m&sup2;</span>
                            <span className="text-emerald-400 font-semibold">{data.comfortLevel}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                  formatter={(value) => {
                    if (value === "airTemp") return "Predicted Air Temperature (°C)";
                    if (value === "surfaceTemp") return "Predicted Road & Surface Temp (°C)";
                    if (value === "baseline") return "Baseline (Without Trees)";
                    return value;
                  }}
                />
                <ReferenceLine
                  y={baselineAir}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{
                    value: `Baseline Heat: ${baselineAir}°C`,
                    position: "top",
                    fill: "#ef4444",
                    fontSize: 11
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="airTemp"
                  name="airTemp"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#059669" }}
                  activeDot={{ r: 7, stroke: "#ffffff", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="surfaceTemp"
                  name="surfaceTemp"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  strokeDasharray="4 2"
                  dot={{ r: 3, fill: "#d97706" }}
                  activeDot={{ r: 6, stroke: "#ffffff", strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <LineChart
                data={trendData}
                margin={{ top: 10, right: 25, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="yearLabel"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  unit="°C"
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as GrowthYearData;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[220px]">
                          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                            <span className="font-bold text-sm text-emerald-400">
                              {label} ({data.year === 0 ? "Planting" : `${data.year} Years Growth`})
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 font-mono">
                              {data.stageCategory}
                            </span>
                          </div>

                          <div className="space-y-1 font-mono text-xs pt-1">
                            <div className="flex justify-between text-emerald-300">
                              <span>Air Cooling Drop:</span>
                              <span className="font-bold text-sm">-{data.coolingDropAir}&deg;C</span>
                            </div>
                            <div className="flex justify-between text-amber-300">
                              <span>Surface Heat Drop:</span>
                              <span className="font-bold text-sm">-{data.coolingDropSurface}&deg;C</span>
                            </div>
                            <div className="flex justify-between text-sky-300 pt-1 border-t border-slate-800">
                              <span>CO2 Absorbed:</span>
                              <span>{data.co2OffsetTons} tons/yr</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                  formatter={(value) => {
                    if (value === "coolingDropAir") return "Air Temperature Reduction (-°C Drop)";
                    if (value === "coolingDropSurface") return "Surface Heat Reduction (-°C Drop)";
                    return value;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="coolingDropAir"
                  name="coolingDropAir"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#059669" }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="coolingDropSurface"
                  name="coolingDropSurface"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  strokeDasharray="4 2"
                  dot={{ r: 3, fill: "#d97706" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* 3. Non-Tech Takeaway Box (Clear, Scannable Insight for Citizens and Officials) */}
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/90 rounded-xl text-xs flex items-start space-x-3 text-slate-800">
          <div className="p-1 rounded-full bg-emerald-600 text-white shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-emerald-950">
              Key Takeaway for {zone.name}:
            </p>
            <p className="text-slate-700 leading-relaxed">
              If {treeCount.toLocaleString()} <strong>{species.name}</strong> trees are planted today, residents will experience noticeable relief by Year 3 (-{trendData[3]?.coolingDropAir}&deg;C). By Year 10, the full mature canopy will permanently lower peak summer air temperatures by <strong>-{year10?.coolingDropAir}&deg;C</strong> (down from {zone.baseTempAir}&deg;C to {year10?.airTemp}&deg;C) and cool road surfaces by <strong>-{year10?.coolingDropSurface}&deg;C</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
