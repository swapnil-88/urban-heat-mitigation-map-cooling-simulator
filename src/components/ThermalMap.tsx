import React, { useEffect, useState, useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Polygon, Tooltip, Popup, useMap } from "react-leaflet";
import { ZoneData, CoolingResult, SimulationParams } from "../types";
import { VADODARA_CENTER } from "../data/vadodaraData";
import { Flame, MapPin, Navigation, Layers, Sliders, Check } from "lucide-react";

interface ThermalMapProps {
  zones: ZoneData[];
  selectedZoneId: string;
  onSelectZone: (zoneId: string) => void;
  zoneResults: Record<string, CoolingResult>;
  simulationParams: SimulationParams;
}

type MapTileStyle = "voyager" | "satellite" | "roads";

// Helper to auto-invalidate Leaflet map size on mount & layout change
function MapResizer() {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);
    const t3 = setTimeout(() => map.invalidateSize(), 1000);

    const handleResize = () => map.invalidateSize();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return null;
}

// Subcomponent to smoothly pan and zoom to the selected zone
function MapFlyTo({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (
      center &&
      Array.isArray(center) &&
      center.length === 2 &&
      !isNaN(center[0]) &&
      !isNaN(center[1])
    ) {
      map.flyTo(center, 13.5, { duration: 0.8 });
    }
  }, [center, map]);

  return null;
}

export const ThermalMap: React.FC<ThermalMapProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
  zoneResults,
  simulationParams
}) => {
  const [isClient, setIsClient] = useState(false);
  const [tileStyle, setTileStyle] = useState<MapTileStyle>("voyager");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectedZone = useMemo(() => {
    return zones.find((z) => z.id === selectedZoneId) || zones[0];
  }, [zones, selectedZoneId]);

  const mapCenter: [number, number] = useMemo(() => {
    if (
      selectedZone?.center &&
      Array.isArray(selectedZone.center) &&
      selectedZone.center.length === 2 &&
      !isNaN(selectedZone.center[0]) &&
      !isNaN(selectedZone.center[1])
    ) {
      return selectedZone.center;
    }
    return VADODARA_CENTER;
  }, [selectedZone]);

  if (!isClient) {
    return (
      <div className="w-full h-full min-h-[520px] bg-slate-100 rounded-2xl flex flex-col items-center justify-center border border-slate-200 text-slate-600 p-8 space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-xs font-mono tracking-wider text-slate-700">
          LOADING VADODARA INTERACTIVE MAP...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-200">
      {/* Top Map Control Bar Overlay */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-xl border border-slate-200 shadow-sm text-xs text-slate-800">
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 rounded-lg text-emerald-800 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>Vadodara GIS Map</span>
        </div>

        {/* Tile Style Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-medium">
          <button
            onClick={() => setTileStyle("voyager")}
            className={`px-2 py-1 rounded-md transition cursor-pointer ${
              tileStyle === "voyager"
                ? "bg-white text-slate-900 font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Clean Street & Avenue Map"
          >
            Street
          </button>
          <button
            onClick={() => setTileStyle("roads")}
            className={`px-2 py-1 rounded-md transition cursor-pointer ${
              tileStyle === "roads"
                ? "bg-white text-slate-900 font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="High-Contrast Highways & Roads"
          >
            Roads
          </button>
          <button
            onClick={() => setTileStyle("satellite")}
            className={`px-2 py-1 rounded-md transition cursor-pointer ${
              tileStyle === "satellite"
                ? "bg-white text-slate-900 font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Real Satellite Aerial View"
          >
            Satellite
          </button>
        </div>

        {/* Selected Zone Pill */}
        <div className="hidden lg:flex items-center space-x-1 px-2 py-1 bg-slate-100 rounded-lg text-slate-700 text-[11px]">
          <span className="text-slate-400">Target:</span>
          <span className="font-bold text-slate-900 truncate max-w-[140px]">
            {selectedZone?.shortName || selectedZone?.name}
          </span>
        </div>
      </div>


      {/* Floating Thermal Index Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-sm max-w-xs text-xs space-y-2 pointer-events-auto">
        <div className="flex items-center justify-between text-slate-800 font-semibold border-b border-slate-200 pb-1.5">
          <div className="flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-bold">Temperature Legend</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">Click any zone</span>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-2 text-slate-700">
              <span className="w-3 h-3 rounded bg-[#EF4444] inline-block shadow-xs shrink-0" />
              <span>High Heat (&gt;42&deg;C)</span>
            </span>
            <span className="text-red-700 font-bold font-mono">Heat Trap</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-2 text-slate-700">
              <span className="w-3 h-3 rounded bg-[#F59E0B] inline-block shadow-xs shrink-0" />
              <span>Moderate (38.5&deg;C - 41&deg;C)</span>
            </span>
            <span className="text-amber-700 font-bold font-mono">Partial Shade</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-2 text-slate-700">
              <span className="w-3 h-3 rounded bg-[#10B981] inline-block shadow-xs shrink-0" />
              <span>Cooled (&lt;38&deg;C)</span>
            </span>
            <span className="text-emerald-700 font-bold font-mono">Comfortable</span>
          </div>
        </div>

        <div className="pt-1 border-t border-slate-100">
          <div className="h-1.5 rounded-full w-full bg-gradient-to-r from-[#EF4444] via-[#F59E0B] to-[#10B981]" />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Severe Heat</span>
            <span>Cooled Green Oasis</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map Container with native responsive viewport */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[520px]"
        style={{ minHeight: "520px", width: "100%", height: "100%" }}
      >
        <MapResizer />
        <MapFlyTo center={mapCenter} />

        {/* Dynamic Tile Layer based on user selection */}
        {tileStyle === "voyager" && (
          <TileLayer
            key="carto-voyager"
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />
        )}

        {tileStyle === "roads" && (
          <TileLayer
            key="esri-roads"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        )}

        {tileStyle === "satellite" && (
          <TileLayer
            key="esri-satellite"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        )}

        {/* Dynamic Thermal Zone GeoJSON Polygons with translucent styling */}
        {zones.map((zone) => {
          const res = zoneResults[zone.id];
          const isSelected = zone.id === selectedZoneId;

          // Validate polygon coordinates structure
          const rawCoords = zone.polygon?.coordinates?.[0];
          if (!rawCoords || !Array.isArray(rawCoords) || rawCoords.length < 3) {
            return null;
          }

          // Map [lng, lat] to Leaflet [lat, lng]
          const latLngs = rawCoords
            .map(([lng, lat]) => [lat, lng] as [number, number])
            .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));

          if (latLngs.length < 3) return null;

          const fillColor = res ? res.fillColor : "#EF4444";
          // Translucent fill opacity so the city streets and labels are always visible underneath!
          const activeFillOpacity = isSelected ? 0.36 : 0.22;

          return (
            <Polygon
              key={zone.id}
              positions={latLngs}
              eventHandlers={{
                click: () => onSelectZone(zone.id)
              }}
              pathOptions={{
                color: isSelected ? "#047857" : fillColor,
                weight: isSelected ? 3.5 : 2,
                fillColor: fillColor,
                fillOpacity: activeFillOpacity,
                dashArray: isSelected ? undefined : "3"
              }}
            >
              <Tooltip sticky direction="top" opacity={0.97}>
                <div className="bg-slate-900 border border-slate-700 text-slate-100 p-2.5 rounded-lg shadow-xl text-xs space-y-1.5 max-w-[220px]">
                  <div className="font-bold text-sm text-emerald-400 flex items-center justify-between space-x-2">
                    <span>{zone.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {zone.uhiClassification}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px] border-t border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Air Temp:</span>
                      <span className="font-semibold text-slate-100">
                        {res ? res.currentAirTemp : zone.baseTempAir}&deg;C
                      </span>
                      {res && res.deltaTAir > 0 && (
                        <span className="text-emerald-400 text-[10px] ml-1">
                          (-{res.deltaTAir}&deg;C)
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Comfort:</span>
                      <span className="font-semibold text-emerald-300">
                        {res?.heatIndexLevel || "Standard"}
                      </span>
                    </div>
                  </div>

                  {/* Preferable Trees with Green Dots for this Area */}
                  {zone.primarySpecies && zone.primarySpecies.length > 0 && (
                    <div className="pt-1.5 border-t border-slate-800 text-[10.5px] space-y-1">
                      <span className="text-slate-400 block text-[10px]">Preferable Native Trees:</span>
                      <div className="flex flex-wrap gap-1">
                        {zone.primarySpecies.map((sp) => (
                          <span
                            key={sp.id}
                            className="inline-flex items-center space-x-1 text-emerald-300 bg-slate-800 px-1.5 py-0.5 rounded text-[10px]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-xs"></span>
                            <span>{sp.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-400 italic pt-0.5">Click to select and simulate</p>
                </div>
              </Tooltip>

              <Popup>
                <div className="bg-white text-slate-900 p-3 rounded-lg text-xs space-y-2 max-w-xs border border-slate-200">
                  <h3 className="font-bold text-sm text-emerald-800">{zone.name}</h3>
                  <p className="text-slate-600 leading-tight">{zone.description}</p>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Normal Heat (Without Trees):</span>
                      <span className="text-red-700 font-bold font-mono">{zone.baseTempAir}&deg;C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Simulated Air (With Trees):</span>
                      <span className="text-emerald-700 font-bold font-mono">
                        {res?.currentAirTemp}&deg;C (-{res?.deltaTAir}&deg;C)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Surface / Road Temp:</span>
                      <span className="text-amber-700 font-bold font-mono">
                        {res?.currentSurfaceTemp}&deg;C (-{res?.deltaTSurface}&deg;C)
                      </span>
                    </div>
                  </div>

                  {/* Preferable Trees Section in Popup with Green Dots */}
                  {zone.primarySpecies && zone.primarySpecies.length > 0 && (
                    <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-200 text-xs space-y-1">
                      <span className="text-emerald-950 font-semibold block text-[11px] flex items-center space-x-1.5">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                        </span>
                        <span>Preferable Native Trees for this Area:</span>
                      </span>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {zone.primarySpecies.map((sp) => (
                          <span
                            key={sp.id}
                            className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-white text-emerald-900 border border-emerald-200 text-[10.5px] font-semibold shadow-2xs"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                            <span>{sp.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => onSelectZone(zone.id)}
                    className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg transition text-xs cursor-pointer shadow-xs"
                  >
                    Select this Neighborhood
                  </button>
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
};
