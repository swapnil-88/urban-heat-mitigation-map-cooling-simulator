import React from "react";
import { SimulationParams, TreeSpecies, ZoneData } from "../types";
import { SPECIES_CATALOG, isTreePreferableForZone } from "../data/vadodaraData";
import { TreeDeciduous, Sun, Clock, RefreshCw, Check } from "lucide-react";

interface MicroclimateControlsProps {
  params: SimulationParams;
  onChangeParams: (newParams: SimulationParams) => void;
  selectedZone: ZoneData;
  zones: ZoneData[];
  onSelectZone: (zoneId: string) => void;
  activeSpecies: TreeSpecies;
  onReset: () => void;
}

export const MicroclimateControls: React.FC<MicroclimateControlsProps> = ({
  params,
  onChangeParams,
  selectedZone,
  zones,
  onSelectZone,
  activeSpecies,
  onReset
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeParams({
      ...params,
      treeCount: Number(e.target.value)
    });
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 sm:space-y-5 text-slate-900 font-sans h-full flex flex-col justify-between">
      {/* Header & Reset Button */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Simulation Control Panel
          </h2>
          <p className="text-xs text-slate-500">
            Adjust tree count & native species to see live cooling
          </p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 transition font-mono cursor-pointer"
          title="Reset to default baseline values"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Step 1: Target Neighborhood */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">1</span>
            <span>Select Vadodara Neighborhood</span>
          </span>
          <span className="text-[11px] text-slate-500">
            {zones.length} areas available
          </span>
        </label>
        <select
          value={selectedZone.id}
          onChange={(e) => onSelectZone(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer"
        >
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name} &bull; Base Heat: {z.baseTempAir}&deg;C ({z.uhiClassification})
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Tree Quantity Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">2</span>
            <span>How Many Trees to Plant?</span>
          </label>
          <span className="text-base font-mono font-bold text-emerald-800 tabular-nums">
            {params.treeCount.toLocaleString()} trees
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="5000"
          step="50"
          value={params.treeCount}
          onChange={handleSliderChange}
          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
        />
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>100 (Small Park / Street)</span>
          <span>1,500 (Neighborhood Avenue)</span>
          <span>5,000 (Urban Forest)</span>
        </div>
      </div>

      {/* Step 3: Native Tree Species */}
      <div className="space-y-1.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">3</span>
            <span>Choose Native Tree Species</span>
          </label>
          <div className="flex items-center space-x-1.5 text-[11px] text-emerald-800 font-medium">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-[10.5px]">
              Green dot = Preferred for {selectedZone.shortName || selectedZone.name.split("/")[0].trim()}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {SPECIES_CATALOG.map((sp) => {
            const isSelected = sp.id === params.selectedSpeciesId;
            const isPreferable = isTreePreferableForZone(sp.id, selectedZone);

            return (
              <button
                key={sp.id}
                onClick={() => onChangeParams({ ...params, selectedSpeciesId: sp.id })}
                className={`p-2 rounded-xl text-left border transition text-xs flex flex-col justify-between cursor-pointer relative group ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 text-emerald-950 font-bold"
                    : isPreferable
                    ? "bg-emerald-50/30 hover:bg-emerald-50/70 border-emerald-200/90 text-slate-800"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
                title={isPreferable ? `🟢 Preferred botanical match for ${selectedZone.name}` : undefined}
              >
                <div>
                  <div className="truncate font-semibold flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 truncate">
                      {isPreferable && (
                        <span
                          className="relative flex h-2.5 w-2.5 shrink-0"
                          title={`Preferred native tree for ${selectedZone.name}`}
                        >
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 ring-2 ring-emerald-200"></span>
                        </span>
                      )}
                      <span className="truncate">{sp.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {sp.gujaratiName}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] mt-1.5">
                  <span className="text-slate-500">{sp.canopyArea}m&sup2; crown</span>
                  {isPreferable ? (
                    <span className="text-emerald-800 font-bold text-[9.5px] bg-emerald-100/90 px-1 py-0.2 rounded flex items-center space-x-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                      <span>Preferred</span>
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 4: Tree Age & Time of Day */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Tree Age */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Tree Age Simulated</span>
          </label>
          <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {([2, 5, 10, 15] as const).map((yr) => (
              <button
                key={yr}
                onClick={() => onChangeParams({ ...params, growthStageYears: yr })}
                className={`py-1 text-center text-xs rounded transition cursor-pointer ${
                  params.growthStageYears === yr
                    ? "bg-slate-900 text-white font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title={yr === 2 ? "Sapling" : yr === 5 ? "Young tree" : yr === 10 ? "Maturing" : "Full mature"}
              >
                {yr}y
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-500 block">
            {params.growthStageYears === 2 ? "Sapling stage (20% canopy)" : params.growthStageYears === 5 ? "Young tree (50% canopy)" : params.growthStageYears === 10 ? "Maturing (80% canopy)" : "Full mature (100% canopy)"}
          </span>
        </div>

        {/* Solar Time */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span>Time of Day</span>
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {(["12PM", "03PM", "07PM"] as const).map((time) => (
              <button
                key={time}
                onClick={() => onChangeParams({ ...params, timeOfDay: time })}
                className={`py-1 text-center text-xs rounded transition cursor-pointer ${
                  params.timeOfDay === time
                    ? "bg-amber-600 text-white font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-500 block">
            {params.timeOfDay === "12PM" ? "Sun overhead (Noon)" : params.timeOfDay === "03PM" ? "Peak afternoon heat" : "Evening trapped heat"}
          </span>
        </div>
      </div>
    </div>
  );
};
