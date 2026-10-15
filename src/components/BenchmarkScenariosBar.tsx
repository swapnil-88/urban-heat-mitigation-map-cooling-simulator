import React from "react";
import { Sparkles, MapPin, Check, ArrowRight, TreeDeciduous, Clock, Sun } from "lucide-react";
import { SimulationParams } from "../types";

export interface BenchmarkScenario {
  id: string;
  name: string;
  badge: string;
  location: string;
  zoneId: string;
  treeCount: number;
  speciesId: string;
  speciesName: string;
  speciesGujarati: string;
  growthStageYears: 2 | 5 | 10 | 15;
  timeOfDay: "12PM" | "03PM" | "07PM";
  impactNote: string;
  description: string;
}

export const BENCHMARK_SCENARIOS: BenchmarkScenario[] = [
  {
    id: "industrial",
    name: "Industrial Heat Buffer",
    badge: "🏭 Factories & Asphalt",
    location: "Makarpura GIDC",
    zoneId: "zone-2",
    treeCount: 3000,
    speciesId: "neem",
    speciesName: "Neem",
    speciesGujarati: "લીમડો",
    growthStageYears: 15,
    timeOfDay: "03PM",
    impactNote: "3,000 Neem · Fast growing & drought hardy",
    description: "Cools heavy asphalt and industrial metal roofs with resilient, low-water canopy."
  },
  {
    id: "heritage",
    name: "Old City Shade Corridor",
    badge: "🏛️ Walled Heritage Core",
    location: "Mandvi Old City",
    zoneId: "zone-1",
    treeCount: 1800,
    speciesId: "bakul",
    speciesName: "Bakul",
    speciesGujarati: "બોરસલી / બકુલ",
    growthStageYears: 15,
    timeOfDay: "03PM",
    impactNote: "1,800 Bakul · Dense foliage for narrow streets",
    description: "Interlocks dense fragrant evergreen crowns over narrow heritage street canyons."
  },
  {
    id: "commercial",
    name: "Commercial Avenue",
    badge: "🏬 Shopping & Offices",
    location: "Alkapuri / RC Dutt Rd",
    zoneId: "zone-3",
    treeCount: 1200,
    speciesId: "amaltas",
    speciesName: "Amaltas",
    speciesGujarati: "ગરમાળો",
    growthStageYears: 10,
    timeOfDay: "12PM",
    impactNote: "1,200 Amaltas · Golden blooms & street shade",
    description: "Golden floral canopy cools wide multi-lane boulevards and pedestrian walkways."
  },
  {
    id: "banyan-corridor",
    name: "Vadodara Banyan Oasis",
    badge: "🌳 Suburban Green Belt",
    location: "Gotri - Vasna Bhayli",
    zoneId: "zone-4",
    treeCount: 2000,
    speciesId: "banyan",
    speciesName: "Banyan (Vad)",
    speciesGujarati: "વડ",
    growthStageYears: 15,
    timeOfDay: "03PM",
    impactNote: "2,000 Banyan · 120m² massive crown",
    description: "Creates an expansive microclimate oasis using Vadodara's namesake heritage banyans."
  }
];

interface BenchmarkScenariosBarProps {
  selectedZoneId: string;
  simulationParams: SimulationParams;
  onApplyScenario: (sc: BenchmarkScenario) => void;
}

export const BenchmarkScenariosBar: React.FC<BenchmarkScenariosBarProps> = ({
  selectedZoneId,
  simulationParams,
  onApplyScenario
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 font-sans text-slate-900">
      {/* Block Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                1-Click Municipal Test Scenarios
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Pre-Calibrated Benchmarks
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any scenario card below to immediately apply verified intervention variables across the map and 10-year model
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden md:block">
          4 Vadodara Urban Typologies
        </div>
      </div>

      {/* 4 Horizontal Scenario Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {BENCHMARK_SCENARIOS.map((sc) => {
          const isMatch =
            selectedZoneId === sc.zoneId &&
            simulationParams.selectedSpeciesId === sc.speciesId &&
            simulationParams.treeCount === sc.treeCount;

          return (
            <button
              key={sc.id}
              onClick={() => onApplyScenario(sc)}
              className={`p-3.5 text-left rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                isMatch
                  ? "bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/30 shadow-xs"
                  : "bg-white hover:bg-slate-50/80 border-slate-200 hover:border-emerald-300 hover:shadow-xs"
              }`}
            >
              {/* Card Top: Typology Badge + Active Pill */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {sc.badge}
                </span>
                {isMatch ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-700 text-white font-mono shadow-xs">
                    <Check className="w-3 h-3" />
                    <span>Active Now</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-400 group-hover:text-emerald-700 transition flex items-center space-x-0.5">
                    <span>Click to apply</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </span>
                )}
              </div>

              {/* Title & Location */}
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-950 transition">
                  {sc.name}
                </h3>
                <div className="flex items-center space-x-1 text-xs text-slate-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="font-medium truncate">{sc.location}</span>
                </div>
              </div>

              {/* Specs Box */}
              <div className="bg-white/80 rounded-lg p-2.5 border border-slate-200/80 text-xs space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-500 flex items-center space-x-1">
                    <TreeDeciduous className="w-3 h-3 text-emerald-700" />
                    <span>Planted:</span>
                  </span>
                  <strong className="text-slate-900 flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-xs shrink-0" title="Preferable tree for this area" />
                    <span>{sc.treeCount.toLocaleString()} {sc.speciesName}</span>
                  </strong>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Horizon:</span>
                  </span>
                  <span className="text-slate-700 font-semibold">{sc.growthStageYears}y Mature</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Time:</span>
                  </span>
                  <span className="text-slate-700 font-semibold">{sc.timeOfDay} Peak</span>
                </div>
              </div>

              {/* Description & Impact */}
              <p className="text-[11px] text-slate-600 leading-snug">
                {sc.description}
              </p>

              {/* Bottom Apply Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-800 font-medium font-mono">
                  {sc.impactNote.split("·")[0].trim()}
                </span>
                <span
                  className={`font-semibold transition ${
                    isMatch ? "text-emerald-800" : "text-slate-500 group-hover:text-emerald-700"
                  }`}
                >
                  {isMatch ? "Selected" : "Test Now →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
