import React, { useState } from "react";
import { ZoneData, CoolingResult, TreeSpecies, SimulationParams, GeoJSONPolygon } from "../types";
import { calculateShadeTimeline } from "../utils/microclimateEngine";
import { SPECIES_CATALOG } from "../data/vadodaraData";
import { X, Thermometer, ShieldAlert, Sparkles, TrendingDown, Wind, Droplets, Leaf, Activity, CheckCircle2, ChevronRight, BarChart3, PlusCircle, MapPin, Building2, SlidersHorizontal } from "lucide-react";

interface ZoneDrawerProps {
  zone: ZoneData;
  isOpen: boolean;
  onClose: () => void;
  coolingResult: CoolingResult;
  activeSpecies: TreeSpecies;
  simulationParams: SimulationParams;
  onSelectSpecies: (speciesId: string) => void;
  onAddZone: (newZone: ZoneData) => void;
  onOpenMapsGrounding?: () => void;
}

export const ZoneDrawer: React.FC<ZoneDrawerProps> = ({
  zone,
  isOpen,
  onClose,
  coolingResult,
  activeSpecies,
  simulationParams,
  onSelectSpecies,
  onAddZone,
  onOpenMapsGrounding
}) => {
  const [activeDrawerTab, setActiveDrawerTab] = useState<"diagnostics" | "addZone">("diagnostics");

  // Form state for creating a new custom zone
  const [formName, setFormName] = useState("");
  const [formShortName, setFormShortName] = useState("");
  const [formCategory, setFormCategory] = useState("Academic & Transit Corridor");
  const [formUhiClassification, setFormUhiClassification] = useState<ZoneData["uhiClassification"]>("Severe UHI");
  const [formLat, setFormLat] = useState("22.3105");
  const [formLng, setFormLng] = useState("73.1890");
  const [formBaseTempAir, setFormBaseTempAir] = useState("41.0");
  const [formBaseTempSurface, setFormBaseTempSurface] = useState("49.5");
  const [formAreaKm2, setFormAreaKm2] = useState("1.8");
  const [formImperviousPct, setFormImperviousPct] = useState("80");
  const [formDescription, setFormDescription] = useState("");
  const [formChallenges, setFormChallenges] = useState("High pavement reflection, Lack of shade along bus stops, Vehicle AC exhaust heat");

  const [formSuccessMsg, setFormSuccessMsg] = useState<string | null>(null);
  const [formErrorMsg, setFormErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const shadeTimeline = calculateShadeTimeline(zone, activeSpecies, simulationParams.treeCount);

  // Helper function to generate a valid GeoJSON polygon boundary around center [lat, lng]
  const generatePolygonAroundCenter = (lat: number, lng: number, radiusDeg = 0.008): GeoJSONPolygon => {
    return {
      type: "Polygon",
      coordinates: [[
        [Number((lng - radiusDeg).toFixed(5)), Number((lat + radiusDeg * 0.8).toFixed(5))],
        [Number((lng + radiusDeg * 1.1).toFixed(5)), Number((lat + radiusDeg * 0.9).toFixed(5))],
        [Number((lng + radiusDeg * 1.2).toFixed(5)), Number((lat - radiusDeg * 0.8).toFixed(5))],
        [Number((lng - radiusDeg * 0.9).toFixed(5)), Number((lat - radiusDeg * 0.9).toFixed(5))],
        [Number((lng - radiusDeg).toFixed(5)), Number((lat + radiusDeg * 0.8).toFixed(5))]
      ]]
    };
  };

  const handleCreateZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMsg(null);
    setFormSuccessMsg(null);

    if (!formName.trim()) {
      setFormErrorMsg("Please enter a valid Zone Name.");
      return;
    }

    const lat = Number(formLat);
    const lng = Number(formLng);
    const airTemp = Number(formBaseTempAir);
    const surfaceTemp = Number(formBaseTempSurface);
    const areaKm2 = Number(formAreaKm2);

    if (isNaN(lat) || isNaN(lng) || lat < 20 || lat > 25 || lng < 70 || lng > 76) {
      setFormErrorMsg("Please enter valid Vadodara geographical coordinates (e.g. Lat ~22.31, Lng ~73.18).");
      return;
    }

    if (isNaN(airTemp) || airTemp < 20 || airTemp > 60) {
      setFormErrorMsg("Please enter a valid baseline air temperature (°C).");
      return;
    }

    const newZone: ZoneData = {
      id: `zone-custom-${Date.now()}`,
      name: formName.trim(),
      shortName: formShortName.trim() || formName.trim().split(" ")[0],
      category: formCategory.trim() || "Municipal Sector",
      uhiClassification: formUhiClassification,
      baseTempAir: airTemp,
      baseTempSurface: surfaceTemp || Number((airTemp * 1.2).toFixed(1)),
      areaSqMeters: Math.max(areaKm2, 0.1) * 1000000,
      center: [lat, lng],
      polygon: generatePolygonAroundCenter(lat, lng),
      primarySpecies: [SPECIES_CATALOG[0], SPECIES_CATALOG[1], SPECIES_CATALOG[2]], // Bakul, Neem, Karanj
      recommendedCount: Math.round(areaKm2 * 1800),
      populationDensity: 14500,
      imperviousCoverPct: Number(formImperviousPct) || 80,
      description: formDescription.trim() || `Custom municipal sector defined at ${lat}° N, ${lng}° E.`,
      keyChallenges: formChallenges.split(",").map(c => c.trim()).filter(Boolean)
    };

    onAddZone(newZone);

    setFormSuccessMsg(`Sector "${newZone.name}" successfully created and added to GIS map!`);
    
    // Reset form fields
    setFormName("");
    setFormShortName("");
    setFormDescription("");

    // Automatically switch back to diagnostics view after 1 second
    setTimeout(() => {
      setActiveDrawerTab("diagnostics");
      setFormSuccessMsg(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[2000] w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-900 animate-in slide-in-from-right duration-300 font-sans">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 sticky top-0 z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                {zone.uhiClassification}
              </span>
              <span className="text-xs text-slate-500 font-mono">Area: {(zone.areaSqMeters / 1000000).toFixed(2)} km²</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">{zone.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-600 hover:text-slate-900 border border-slate-300/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside Drawer */}
        <div className="flex bg-slate-100 p-1 rounded border border-slate-200 space-x-1 font-mono text-xs">
          <button
            onClick={() => setActiveDrawerTab("diagnostics")}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded transition ${
              activeDrawerTab === "diagnostics"
                ? "bg-white text-emerald-800 font-bold border border-slate-200 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Zone Diagnostics</span>
          </button>
          <button
            onClick={() => setActiveDrawerTab("addZone")}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded transition ${
              activeDrawerTab === "addZone"
                ? "bg-emerald-600 text-white font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Define New Zone</span>
          </button>
        </div>
      </div>

      {/* Body Scrollable */}
      <div className="p-4 overflow-y-auto space-y-5 flex-1 text-xs">
        {activeDrawerTab === "diagnostics" ? (
          <>
            {/* Google Maps AI Location Intelligence Card */}
            {onOpenMapsGrounding && (
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 p-3.5 rounded-xl border border-emerald-300 shadow-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Real-World Maps Grounding</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Query live nurseries, parks & hot spots in {zone.shortName} via Google Maps API.
                  </p>
                </div>
                <button
                  onClick={onOpenMapsGrounding}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 transition shadow-xs"
                >
                  Query Maps
                </button>
              </div>
            )}

            {/* Core Calculation Delta Display Card */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Live Microclimate Calculations</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Real-time Thermal Equations Sync</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {coolingResult.heatIndexLevel}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Delta T_air */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold block">Air Temp Reduction (&Delta;T_air)</span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-2xl font-mono font-bold text-emerald-700">-{coolingResult.deltaTAir}°C</span>
                    <span className="text-[10px] text-slate-400 line-through">{zone.baseTempAir}°C</span>
                  </div>
                  <p className="text-[10px] font-mono text-emerald-800">New Air Temp: <strong className="text-slate-900">{coolingResult.currentAirTemp}°C</strong></p>
                </div>

                {/* Delta T_surface */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold block">Surface Temp (&Delta;T_surface)</span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-2xl font-mono font-bold text-amber-700">-{coolingResult.deltaTSurface}°C</span>
                    <span className="text-[10px] text-slate-400 line-through">{zone.baseTempSurface}°C</span>
                  </div>
                  <p className="text-[10px] font-mono text-amber-800">New Surface: <strong className="text-slate-900">{coolingResult.currentSurfaceTemp}°C</strong></p>
                </div>
              </div>

              {/* Mathematical Formula Footnote */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] font-mono space-y-1">
                <div className="text-slate-600 font-semibold flex items-center justify-between">
                  <span>Equation 1: Ambient Air Cooling</span>
                  <span className="text-emerald-700 font-bold">Verified</span>
                </div>
                <div className="text-slate-800 bg-white p-1.5 rounded border border-slate-200 text-[10px] overflow-x-auto font-mono">
                  {"\\Delta T_air = (TreeCount × CanopyArea × LAI × Transpiration) / ZoneArea"}
                </div>
                <div className="text-slate-600 font-semibold pt-1">
                  <span>Equation 2: Surface Radiant Drop</span>
                </div>
                <div className="text-amber-800 bg-white p-1.5 rounded border border-slate-200 text-[10px] font-mono">
                  {"\\Delta T_surface = \\Delta T_air × 2.85"}
                </div>
              </div>
            </div>

            {/* Mature Shade Timeline Section */}
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                  <BarChart3 className="w-4 h-4 text-sky-600" />
                  <span>Mature Shade Timeline Projection</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-500">{simulationParams.treeCount} {activeSpecies.name} Trees</span>
              </div>

              {/* Microclimate Cooling Curve Visualizer */}
              <div className="space-y-2 pt-1">
                {shadeTimeline.map((item) => {
                  const maxReduction = 5.0;
                  const barWidthPct = Math.min((item.deltaAir / maxReduction) * 100, 100);

                  return (
                    <div key={item.year} className="space-y-1 font-mono text-[11px]">
                      <div className="flex items-center justify-between text-slate-700">
                        <span>
                          {item.year === 0 ? "Year 0 (Baseline)" : `Year ${item.year} (${item.year <= 3 ? "Sapling" : item.year <= 7 ? "Young" : "Mature"})`}
                        </span>
                        <span className="text-emerald-700 font-bold">-{item.deltaAir}°C Air | -{item.deltaSurface}°C Surface</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 flex">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 via-emerald-500 to-emerald-600 transition-all duration-500"
                          style={{ width: `${Math.max(barWidthPct, 4)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Native Species for Zone */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Recommended Native Tree Species</span>
              </h3>

              <div className="space-y-2">
                {zone.primarySpecies.map((spec) => {
                  const isSelected = spec.id === activeSpecies.id;

                  return (
                    <div
                      key={spec.id}
                      onClick={() => onSelectSpecies(spec.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer space-y-2 ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500/20"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shrink-0 inline-block ring-2 ring-emerald-200" title={`Preferable native tree for ${zone.name}`} />
                            <span className="font-bold text-sm text-slate-900">{spec.name}</span>
                            <span className="text-[10px] text-emerald-800 font-mono px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-200">
                              {spec.gujaratiName}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Preferable
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 italic mt-0.5">{spec.scientificName}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>

                      <p className="text-slate-700 leading-relaxed text-[11px]">{spec.description}</p>

                      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg text-[10px] font-mono text-slate-700 border border-slate-200/80">
                        <div>
                          <span className="text-slate-500 block">Canopy:</span>
                          <strong className="text-slate-900">{spec.canopyArea} m²</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">CO2 Absorption:</span>
                          <strong className="text-emerald-700">{spec.co2SequestrationKgYr} kg/yr</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Water Need:</span>
                          <strong className="text-sky-700">{spec.waterReqLitersDay} L/day</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Urban Challenges */}
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-800 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Zone Urban Heat Challenges</span>
              </h3>
              <ul className="space-y-1.5 text-slate-700 font-mono text-[11px]">
                {zone.keyChallenges.map((challenge, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          /* Define New Geographic Zone Form */
          <form onSubmit={handleCreateZoneSubmit} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <div>
                <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-slate-900">
                  Define New Municipal Geographic Zone
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">Generates GIS Boundary & Calibrates Microclimate Equations</p>
              </div>
            </div>

            {formSuccessMsg && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded text-xs font-mono">
                {formSuccessMsg}
              </div>
            )}

            {formErrorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-300 text-red-900 rounded text-xs font-mono">
                {formErrorMsg}
              </div>
            )}

            {/* Form Inputs */}
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Zone Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sayajigunj Academic & Transit Hub"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Short Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Sayajigunj"
                    value={formShortName}
                    onChange={(e) => setFormShortName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">UHI Classification</label>
                  <select
                    value={formUhiClassification}
                    onChange={(e) => setFormUhiClassification(e.target.value as ZoneData["uhiClassification"])}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Severe UHI">Severe UHI</option>
                    <option value="Extreme Industrial Heat">Extreme Industrial Heat</option>
                    <option value="Commercial Asphalt">Commercial Asphalt</option>
                    <option value="High-Rise Sprawl">High-Rise Sprawl</option>
                    <option value="Suburban Transit">Suburban Transit</option>
                  </select>
                </div>
              </div>

              {/* Geographic Coordinates */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-800 font-bold border-b border-slate-200 pb-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Vadodara GIS Coordinates</span>
                  </span>
                  <span className="text-[10px] text-slate-500">GeoJSON Polygon Auto-Gen</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[10px]">Center Latitude (°N)</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={formLat}
                      onChange={(e) => setFormLat(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px]">Center Longitude (°E)</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={formLng}
                      onChange={(e) => setFormLng(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Baseline Thermal Properties */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Base Air Temp (°C) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formBaseTempAir}
                    onChange={(e) => setFormBaseTempAir(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-emerald-800 font-bold focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Base Surface Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formBaseTempSurface}
                    onChange={(e) => setFormBaseTempSurface(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-amber-800 font-bold focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Area (km²)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formAreaKm2}
                    onChange={(e) => setFormAreaKm2(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Impervious Cover (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={formImperviousPct}
                    onChange={(e) => setFormImperviousPct(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Sector Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Busy commercial avenue with heavy pedestrian transit and minimal canopy."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Key Heat Challenges (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Bus exhaust heat, Asphalt parking lots, Lack of shade"
                  value={formChallenges}
                  onChange={(e) => setFormChallenges(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded border border-emerald-600 shadow-xs transition flex items-center justify-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Zone to Vadodara GIS Map</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer Drawer Action */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="text-slate-500 font-mono text-[11px]">
          <span>Vadodara Municipal Ward GIS ID: </span>
          <span className="text-slate-800 font-bold">{zone.id.toUpperCase()}</span>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded text-xs transition shadow-xs"
        >
          Apply & Close
        </button>
      </div>
    </div>
  );
};
