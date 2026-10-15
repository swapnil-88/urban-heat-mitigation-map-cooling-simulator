/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { ThermalMap } from "./components/ThermalMap";
import { MicroclimateControls } from "./components/MicroclimateControls";
import { BenchmarkScenariosBar } from "./components/BenchmarkScenariosBar";
import { MetricsOverview } from "./components/MetricsOverview";
import { ZoneDrawer } from "./components/ZoneDrawer";
import { GovReportModal } from "./components/GovReportModal";
import { MethodologyModal } from "./components/MethodologyModal";
import { GovernmentFooter } from "./components/GovernmentFooter";
import { SPECIES_CATALOG, VADODARA_ZONES, VADODARA_CENTER } from "./data/vadodaraData";
import { calculateMicroclimate } from "./utils/microclimateEngine";
import { SimulationParams, CoolingResult, ZoneData } from "./types";
import { Calculator, ArrowUpRight, RotateCcw } from "lucide-react";

const STORAGE_KEYS = {
  ZONES: "vmc_saved_zones_v3",
  SELECTED_ZONE: "vmc_selected_zone_id_v3",
  SIMULATION_PARAMS: "vmc_simulation_params_v3"
};

export default function App() {
  const matrixRef = useRef<HTMLDivElement>(null);
  const simulatorRef = useRef<HTMLDivElement>(null);

  // Persistent zones array with strict schema validation
  const [zones, setZones] = useState<ZoneData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ZONES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const isValid = parsed.every(
            (z) =>
              z &&
              typeof z.id === "string" &&
              Array.isArray(z.center) &&
              z.center.length === 2 &&
              !isNaN(z.center[0]) &&
              !isNaN(z.center[1]) &&
              Array.isArray(z.polygon?.coordinates?.[0]) &&
              z.polygon.coordinates[0].length >= 3
          );
          if (isValid) return parsed;
        }
      }
    } catch (e) {
      console.warn("Falling back to default zones:", e);
    }
    return VADODARA_ZONES;
  });

  // Persistent selected zone ID with fallback
  const [selectedZoneId, setSelectedZoneId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_ZONE);
      if (saved && VADODARA_ZONES.some((z) => z.id === saved)) return saved;
    } catch (e) {
      console.warn("Failed to load selectedZoneId:", e);
    }
    return "zone-2"; // Makarpura GIDC Industrial Corridor
  });

  // Persistent simulation parameters
  const [simulationParams, setSimulationParams] = useState<SimulationParams>(() => {
    const defaultParams: SimulationParams = {
      treeCount: 2000,
      selectedSpeciesId: "neem",
      growthStageYears: 15,
      timeOfDay: "03PM"
    };
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIMULATION_PARAMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const speciesValid = SPECIES_CATALOG.some((s) => s.id === parsed.selectedSpeciesId);
        return {
          ...defaultParams,
          ...parsed,
          selectedSpeciesId: speciesValid ? parsed.selectedSpeciesId : "neem"
        };
      }
    } catch (e) {
      console.warn("Failed to load simulationParams:", e);
    }
    return defaultParams;
  });

  // Modals & drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);

  // Baseline temperature mode
  const [temperatureMode, setTemperatureMode] = useState<"live" | "summer">("summer");
  const [liveTemp] = useState<number | null>(36.4);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones));
    } catch (e) {
      console.warn("Failed to sync zones:", e);
    }
  }, [zones]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_ZONE, selectedZoneId);
    } catch (e) {
      console.warn("Failed to sync selectedZoneId:", e);
    }
  }, [selectedZoneId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SIMULATION_PARAMS, JSON.stringify(simulationParams));
    } catch (e) {
      console.warn("Failed to sync simulationParams:", e);
    }
  }, [simulationParams]);

  const handleAddZone = (newZone: ZoneData) => {
    setZones((prev) => [...prev, newZone]);
    setSelectedZoneId(newZone.id);
  };

  const getZoneUhiOffset = (zone: ZoneData): number => {
    const name = zone.name.toLowerCase();
    if (name.includes("makarpura") || name.includes("industrial") || name.includes("nandesari")) return 3.8;
    if (name.includes("mandvi") || name.includes("walled")) return 2.8;
    if (name.includes("alkapuri") || name.includes("dutt")) return 1.8;
    if (name.includes("waghodia") || name.includes("sayajipura")) return 1.5;
    if (name.includes("gotri") || name.includes("bhayli")) return 0.8;
    return 1.2;
  };

  const selectedZone = useMemo(() => {
    const rawZone = zones.find((z) => z.id === selectedZoneId) || zones[0] || VADODARA_ZONES[0];
    if (temperatureMode === "live" && liveTemp !== null) {
      const offset = getZoneUhiOffset(rawZone);
      const liveBaseAir = Number((liveTemp + offset).toFixed(1));
      const liveBaseSurface = Number((liveBaseAir * 1.22).toFixed(1));
      return {
        ...rawZone,
        baseTempAir: liveBaseAir,
        baseTempSurface: liveBaseSurface
      };
    }
    return rawZone;
  }, [zones, selectedZoneId, temperatureMode, liveTemp]);

  const activeSpecies = useMemo(() => {
    return (
      SPECIES_CATALOG.find((s) => s.id === simulationParams.selectedSpeciesId) ||
      SPECIES_CATALOG[0]
    );
  }, [simulationParams.selectedSpeciesId]);

  // Compute live microclimate results for all active zones
  const zoneResults = useMemo(() => {
    const results: Record<string, CoolingResult> = {};
    zones.forEach((zone) => {
      let effectiveZone = zone;
      if (temperatureMode === "live" && liveTemp !== null) {
        const offset = getZoneUhiOffset(zone);
        const liveBaseAir = Number((liveTemp + offset).toFixed(1));
        const liveBaseSurface = Number((liveBaseAir * 1.22).toFixed(1));
        effectiveZone = {
          ...zone,
          baseTempAir: liveBaseAir,
          baseTempSurface: liveBaseSurface
        };
      }
      results[zone.id] = calculateMicroclimate(effectiveZone, activeSpecies, simulationParams);
    });
    return results;
  }, [zones, activeSpecies, simulationParams, temperatureMode, liveTemp]);

  const currentZoneResult = zoneResults[selectedZone.id] || calculateMicroclimate(selectedZone, activeSpecies, simulationParams);

  const handleResetSimulation = () => {
    setSimulationParams({
      treeCount: 2000,
      selectedSpeciesId: "neem",
      growthStageYears: 15,
      timeOfDay: "03PM"
    });
    setZones(VADODARA_ZONES);
    setSelectedZoneId("zone-2");
    try {
      localStorage.removeItem(STORAGE_KEYS.ZONES);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_ZONE);
      localStorage.removeItem(STORAGE_KEYS.SIMULATION_PARAMS);
    } catch (e) {
      // ignore
    }
  };

  const scrollToMatrix = () => {
    matrixRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Top Municipal Navigation */}
      <Header
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onScrollToMatrix={scrollToMatrix}
        onScrollToSimulator={scrollToSimulator}
      />

      {/* Main Core Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Government Directive & Simulation Protocol Banner */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-700 inline-block" />
                <h2 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                  Municipal Microclimate Simulation Protocol
                </h2>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  VMC-UHI-2026
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                Simulate thermodynamic temperature reductions, shaded canopy expansion, and 10-year cooling impacts across Vadodara wards by modeling native urban tree plantations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs">
            <div className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-md bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                1
              </div>
              <div className="space-y-0.5">
                <strong className="text-slate-900 block font-semibold">Select Ward</strong>
                <span className="text-slate-500 text-[11px] leading-snug block">
                  Click any sector on the GIS map or choose from the neighborhood menu.
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-md bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                2
              </div>
              <div className="space-y-0.5">
                <strong className="text-slate-900 block font-semibold">Configure Plantation</strong>
                <span className="text-slate-500 text-[11px] leading-snug block">
                  Set target tree volume and choose native species (preferable types marked with 🟢).
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-md bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                3
              </div>
              <div className="space-y-0.5">
                <strong className="text-slate-900 block font-semibold">Evaluate Cooling</strong>
                <span className="text-slate-500 text-[11px] leading-snug block">
                  Assess immediate temperature reductions and review the 10-year predicted cooling curve.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Interactive Sandbox: GIS Map (60%) + Parameter Deck (40%) - First Step */}
        <div ref={simulatorRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* GIS Thermal Map Stage (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="h-[520px] w-full min-h-[520px]">
              <ThermalMap
                zones={zones}
                selectedZoneId={selectedZoneId}
                onSelectZone={(id) => setSelectedZoneId(id)}
                zoneResults={zoneResults}
                simulationParams={simulationParams}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono px-1">
              <span>Projection: EPSG:4326 &bull; Vadodara Coordinates 22.3072&deg; N, 73.1812&deg; E</span>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="text-emerald-700 hover:text-emerald-900 font-medium underline flex items-center space-x-1 cursor-pointer"
              >
                <span>Sector Details & Growth Timeline</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Parameter Deck (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <MicroclimateControls
              params={simulationParams}
              onChangeParams={setSimulationParams}
              selectedZone={selectedZone}
              zones={zones}
              onSelectZone={(id) => setSelectedZoneId(id)}
              activeSpecies={activeSpecies}
              onReset={handleResetSimulation}
            />
          </div>
        </div>

        {/* Selected Sector Environmental Baseline Bar */}
        <div
          className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
              <span className="font-bold text-slate-900 text-sm">{selectedZone.name}</span>
              <span className="text-slate-300">&bull;</span>
              <span className="font-mono">{(selectedZone.areaSqMeters / 1000000).toFixed(2)} km&sup2;</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-amber-800 font-semibold">{selectedZone.uhiClassification}</span>
              <span className="text-slate-300">&bull;</span>
              <span className="font-mono">{selectedZone.imperviousCoverPct}% Concrete/Asphalt</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
              {selectedZone.description}
            </p>
          </div>

          {/* Baseline Condition Selector & Technical Methodology Button */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
              <button
                onClick={() => setTemperatureMode("summer")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  temperatureMode === "summer"
                    ? "bg-amber-600 text-white font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Historical peak summer heatwave (42.0°C - 44.5°C)"
              >
                Summer Heatwave (43.5&deg;C)
              </button>
              <button
                onClick={() => setTemperatureMode("live")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  temperatureMode === "live"
                    ? "bg-emerald-600 text-white font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Synchronized Vadodara meteorological telemetry (36.4°C)"
              >
                Live Ambient (36.4&deg;C)
              </button>
            </div>

            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition cursor-pointer"
              title="Open full thermodynamic equations & technical documentation"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-700" />
              <span>Methodology</span>
            </button>
          </div>
        </div>

        {/* Results: The 4 Metric Boxes & 10-Year Predicted Growth Stage Cooling Line Chart */}
        <MetricsOverview
          zone={selectedZone}
          coolingResult={currentZoneResult}
          species={activeSpecies}
          treeCount={simulationParams.treeCount}
          timeOfDay={simulationParams.timeOfDay}
        />

        {/* Horizontal 1-Click Municipal Test Scenarios Block (Exact after Heat Map & Control Panel) */}
        <BenchmarkScenariosBar
          selectedZoneId={selectedZoneId}
          simulationParams={simulationParams}
          onApplyScenario={(scenario) => {
            setSelectedZoneId(scenario.zoneId);
            setSimulationParams({
              treeCount: scenario.treeCount,
              selectedSpeciesId: scenario.speciesId,
              growthStageYears: scenario.growthStageYears,
              timeOfDay: scenario.timeOfDay
            });
            scrollToSimulator();
          }}
        />

        {/* Ward Comparison Matrix */}
        <div
          ref={matrixRef}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 font-sans"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="font-bold text-base text-slate-900">
                Vadodara Municipal Ward Comparative Heat Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Microclimate cooling impact across all sectors with {simulationParams.treeCount.toLocaleString()} {activeSpecies.name} specimens
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {zones.length} Sectors Modeled
              </span>
              <button
                onClick={handleResetSimulation}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
                title="Restore all default Vadodara wards & settings"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="p-3">Neighborhood (Sector)</th>
                  <th className="p-3">Heat Risk Level</th>
                  <th className="p-3">Normal Heat (No Trees)</th>
                  <th className="p-3">Cooled Air (With Trees)</th>
                  <th className="p-3">Road / Surface Drop</th>
                  <th className="p-3">Human Comfort</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {zones.map((zone) => {
                  const res = zoneResults[zone.id];
                  const isSelected = zone.id === selectedZoneId;

                  return (
                    <tr
                      key={zone.id}
                      className={`transition hover:bg-slate-50/80 ${isSelected ? "bg-emerald-50/70" : ""}`}
                    >
                      <td className="p-3 font-semibold text-slate-900 flex items-center space-x-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                          style={{ backgroundColor: res?.fillColor || "#EF4444" }}
                        />
                        <span>{zone.name}</span>
                      </td>
                      <td className="p-3 text-slate-600 font-medium">{zone.uhiClassification}</td>
                      <td className="p-3 text-slate-600 tabular-nums">{zone.baseTempAir}&deg;C</td>
                      <td className="p-3 text-emerald-800 font-bold tabular-nums">
                        {res?.currentAirTemp}&deg;C <span className="text-xs font-normal">(-{res?.deltaTAir}&deg;C)</span>
                      </td>
                      <td className="p-3 text-amber-800 font-semibold tabular-nums">
                        -{res?.deltaTSurface}&deg;C
                      </td>
                      <td className="p-3 text-slate-700 font-medium">{res?.heatIndexLevel}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedZoneId(zone.id);
                            scrollToSimulator();
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            isSelected
                              ? "bg-emerald-700 text-white shadow-xs"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {isSelected ? "Active Sector" : "Select Sector"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Slide-over Side Drawer for Deep Zone Diagnostics */}
      <ZoneDrawer
        zone={selectedZone}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        coolingResult={currentZoneResult}
        activeSpecies={activeSpecies}
        simulationParams={simulationParams}
        onSelectSpecies={(speciesId) => {
          setSimulationParams((prev) => ({
            ...prev,
            selectedSpeciesId: speciesId
          }));
        }}
        onAddZone={handleAddZone}
      />

      {/* Technical Methodology & Climate Thermodynamics Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Official Municipal Microclimate Action Plan & Executive Assessment Modal */}
      <GovReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        zone={selectedZone}
        coolingResult={currentZoneResult}
        species={activeSpecies}
        params={simulationParams}
      />

      {/* Official Government of Gujarat & Vadodara Municipal Corporation Footer */}
      <GovernmentFooter />
    </div>
  );
}
