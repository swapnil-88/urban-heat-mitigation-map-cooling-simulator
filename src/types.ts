export interface TreeSpecies {
  id: string;
  name: string;
  scientificName: string;
  gujaratiName: string;
  canopyArea: number; // m² per mature tree
  lai: number; // Leaf Area Index (dimensionless)
  transpirationRate: number; // Transpiration factor (liters/m²/day equivalent factor)
  co2SequestrationKgYr: number; // kg per tree per year
  waterReqLitersDay: number;
  shadeEfficiency: number; // 0 - 1 factor
  idealZones: string[];
  description: string;
  iconName?: string;
}

export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: number[][][]; // [lng, lat][]
}

export interface ZoneData {
  id: string;
  name: string;
  shortName: string;
  category: string;
  uhiClassification: "Extreme Industrial Heat" | "Severe UHI" | "Commercial Asphalt" | "Suburban Transit" | "High-Rise Sprawl";
  baseTempAir: number; // °C
  baseTempSurface: number; // °C
  areaSqMeters: number; // Zone land area in m²
  center: [number, number]; // [lat, lng]
  polygon: GeoJSONPolygon;
  primarySpecies: TreeSpecies[];
  recommendedCount: number;
  populationDensity: number; // per km²
  imperviousCoverPct: number; // % concrete/asphalt
  description: string;
  keyChallenges: string[];
}

export interface SimulationParams {
  treeCount: number; // 10 to 5000
  selectedSpeciesId: string;
  growthStageYears: 2 | 5 | 10 | 15; // 2=Sapling, 5=Young, 10=Medium, 15=Mature
  timeOfDay: "12PM" | "03PM" | "07PM";
}

export interface CoolingResult {
  deltaTAir: number; // °C reduction
  deltaTSurface: number; // °C reduction
  currentAirTemp: number; // °C
  currentSurfaceTemp: number; // °C
  canopyCoverageSqM: number; // m²
  canopyCoveragePct: number; // % of zone area
  co2OffsetTonsYr: number;
  stormwaterRetainedM3Yr: number;
  energySavingsKwhYr: number;
  heatIndexLevel: "Extreme Danger" | "Danger" | "Extreme Caution" | "Caution" | "Moderate Comfort" | "Microclimate Oasis";
  fillColor: string; // Dynamic interpolation from #EF4444 -> #F59E0B -> #10B981
  fillOpacity: number;
}
