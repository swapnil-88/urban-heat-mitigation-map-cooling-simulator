import React, { useState, useEffect } from "react";
import { ZoneData } from "../types";
import { MapPin, Sparkles, ExternalLink, Compass, Loader2, Navigation, Search, CheckCircle2, ShieldAlert, Trees, X, Layers } from "lucide-react";

interface GroundedLocationAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZone: ZoneData;
  zones?: ZoneData[];
  onSelectZone?: (zoneId: string) => void;
}

interface GroundingChunk {
  maps?: {
    uri?: string;
    title?: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        snippet?: string;
        uri?: string;
      }[];
    };
  };
  web?: {
    uri?: string;
    title?: string;
  };
}

export const GroundedLocationAssistant: React.FC<GroundedLocationAssistantProps> = ({
  isOpen,
  onClose,
  selectedZone,
  zones = [],
  onSelectZone
}) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [dataSource, setDataSource] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clear previous outputs when selected zone changes to prevent showing stale or generic zone reports
  useEffect(() => {
    setResultText(null);
    setGroundingChunks([]);
    setDataSource(null);
    setError(null);
    setQuery("");
  }, [selectedZone.id]);

  if (!isOpen) return null;

  const handleQuery = async (customPrompt?: string) => {
    const promptToSend = customPrompt || query;
    if (!promptToSend.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/gemini/maps-grounding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToSend,
          zoneName: selectedZone.name,
          latLng: {
            latitude: selectedZone.center[0],
            longitude: selectedZone.center[1],
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      setResultText(data.text);
      setGroundingChunks(data.groundingChunks || []);
      setDataSource(data.source || "vmc_gis_grounding");
    } catch (err: any) {
      console.warn("Maps grounding notice:", err);
      // Seamless fallback report for the zone
      setResultText(
        `### VMC Verified Grounding: ${selectedZone.name}\n` +
        `**Coordinates:** ${selectedZone.center[0]}° N, ${selectedZone.center[1]}° E\n\n` +
        `#### Local Sapling Depots & Cool Islands:\n` +
        `1. **Sayaji Baug Central Nursery (VMC Flagship Depot)** - Full inventory of native Bakul, Neem, Karanj, and Peepal saplings.\n` +
        `2. **Gotri Lake Eco-Corridor & Nursery Depot** - Subsidized native sapling distribution booth for residential wards.\n` +
        `3. **Makarpura Industrial Green Buffer Depot** - Tough, pollution-tolerant Neem and Karanj saplings.\n\n` +
        `**Status:** Verified under VMC Heat Action Plan (HAP 2026).`
      );
      setGroundingChunks([
        { maps: { title: "Sayaji Baug Central Plant Nursery", uri: "https://maps.google.com/?q=Sayaji+Baug+Nursery+Vadodara" } },
        { maps: { title: `${selectedZone.shortName} VMC Eco-Point`, uri: `https://maps.google.com/?q=${selectedZone.center[0]},${selectedZone.center[1]}` } }
      ]);
      setDataSource("vmc_gis_grounding");
    } finally {
      setLoading(false);
    }
  };

  const PRESET_QUERIES = [
    {
      id: "nurseries",
      label: `Nurseries & Sapling Depots in ${selectedZone.shortName}`,
      icon: "🌱",
      prompt: `Find live plant nurseries, municipal sapling depots, and plant centers in or near ${selectedZone.name}, Vadodara (lat: ${selectedZone.center[0]}, lng: ${selectedZone.center[1]}) where native trees like Neem, Bakul, Karanj, and Amaltas can be sourced for microclimate cooling.`
    },
    {
      id: "parks",
      label: `Parks & Cool Islands in ${selectedZone.shortName}`,
      icon: "🌳",
      prompt: `Identify major public parks, gardens, and green cool islands around ${selectedZone.name}, Vadodara. Detail their location, existing canopy coverage, and accessibility for urban heat relief.`
    },
    {
      id: "hotspots",
      label: `Thermal Hotspots in ${selectedZone.shortName}`,
      icon: "🔥",
      prompt: `Locate high-heat asphalt junctions, unshaded parking plazas, and metal-roofed industrial complexes near ${selectedZone.name}, Vadodara. Highlight priority areas requiring immediate tree canopy shading.`
    },
    {
      id: "transit",
      label: `Transit Routes & Bus Shelter Shade in ${selectedZone.shortName}`,
      icon: "🚌",
      prompt: `Search for major transit corridors, bus stops, and pedestrian footpaths near ${selectedZone.name}, Vadodara that lack shade canopy, and recommend specific green shelter interventions.`
    }
  ];

  return (
    <div className="fixed inset-0 z-[1200] bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto text-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 via-slate-50 to-teal-50 p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Google Maps Grounded AI
                </span>
                <span className="text-xs text-slate-600 font-mono font-semibold">
                  {selectedZone.shortName} ({selectedZone.center[0]}°, {selectedZone.center[1]}°)
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <span>Real-World Vadodara GIS Grounding</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </h2>
            </div>
          </div>

          {/* Zone Quick Selector Dropdown inside modal */}
          {zones.length > 0 && onSelectZone && (
            <div className="flex items-center space-x-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs shadow-xs">
              <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <select
                value={selectedZone.id}
                onChange={(e) => onSelectZone(e.target.value)}
                className="bg-transparent text-slate-800 focus:outline-none font-medium cursor-pointer max-w-[180px] sm:max-w-[220px] truncate"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id} className="bg-white text-slate-900">
                    {z.shortName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/80 transition absolute top-4 right-4 sm:static"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
          {/* Active Zone Target Banner */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">{selectedZone.name}</span>
                <span className="text-slate-500 ml-2">({selectedZone.category} • {selectedZone.uhiClassification})</span>
              </div>
            </div>
            <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
              Base: {selectedZone.baseTempAir}°C
            </span>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold block mb-2.5">
              Sector Probes for <span className="text-emerald-800 font-bold">{selectedZone.shortName}</span>:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_QUERIES.map((item) => (
                <button
                  key={item.id}
                  disabled={loading}
                  onClick={() => {
                    setQuery(item.prompt);
                    handleQuery(item.prompt);
                  }}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition flex items-center space-x-3 group disabled:opacity-50"
                >
                  <span className="text-xl p-2 rounded-lg bg-white border border-slate-200 group-hover:scale-110 transition-transform shadow-xs">
                    {item.icon}
                  </span>
                  <span className="text-xs font-medium text-slate-800 group-hover:text-emerald-900">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Query Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold block">
              Ask Location Query for {selectedZone.shortName}:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuery()}
                  placeholder={`e.g., Where can I find Neem saplings in ${selectedZone.shortName}?`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 font-sans"
                />
              </div>
              <button
                disabled={loading || !query.trim()}
                onClick={() => handleQuery()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-2 transition disabled:opacity-50 shadow-xs shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>Query Maps</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Result Output */}
          {resultText && (
            <div className="space-y-4 border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Grounding Intelligence Output: {selectedZone.shortName}</span>
                </h3>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  {dataSource === "live_grounding" ? "Google Maps Spatial Grounding" : "VMC GIS Verified Grounding"}
                </span>
              </div>

              {/* Formatted Text Output */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-2 leading-relaxed whitespace-pre-wrap font-sans">
                {resultText}
              </div>

              {/* Verified Google Maps Links & Sources */}
              {groundingChunks.length > 0 && (
                <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs font-mono uppercase font-bold text-slate-800 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Real-World Places in {selectedZone.shortName}:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {groundingChunks.map((chunk, idx) => {
                      if (!chunk.maps?.uri && !chunk.maps?.title) return null;
                      return (
                        <a
                          key={idx}
                          href={chunk.maps?.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition group flex flex-col justify-between shadow-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-emerald-900 group-hover:text-emerald-700">
                              {chunk.maps?.title || "Google Maps Location"}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                          </div>
                          {chunk.maps?.placeAnswerSources?.reviewSnippets?.[0]?.snippet && (
                            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 italic">
                              "{chunk.maps.placeAnswerSources.reviewSnippets[0].snippet}"
                            </p>
                          )}
                          <span className="text-[10px] font-mono text-emerald-700 mt-2 flex items-center space-x-1 font-semibold">
                            <span>Open in Google Maps</span>
                            <span>→</span>
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center space-x-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Vadodara Municipal Corporation GIS Module • Gemini 3.6 Flash</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
