import { CoolingResult, SimulationParams, TreeSpecies, ZoneData } from "../types";

/**
 * Calculates microclimate cooling based on the official equation:
 * Delta T_air = (TreeCount * CanopyArea * LAI * Transpiration) / ZoneArea
 * Delta T_surface = Delta T_air * 2.85
 */
export function calculateMicroclimate(
  zone: ZoneData,
  species: TreeSpecies,
  params: SimulationParams
): CoolingResult {
  const { treeCount, growthStageYears, timeOfDay } = params;

  // Growth stage maturity multipliers
  let maturityFactor = 1.0;
  if (growthStageYears === 2) maturityFactor = 0.20;
  else if (growthStageYears === 5) maturityFactor = 0.50;
  else if (growthStageYears === 10) maturityFactor = 0.80;
  else if (growthStageYears === 15) maturityFactor = 1.00;

  // Effective Canopy Area & Leaf Area Index
  const effectiveCanopyPerTree = species.canopyArea * maturityFactor;
  const totalCanopyAreaSqM = treeCount * effectiveCanopyPerTree;
  const effectiveLAI = species.lai * (0.6 + 0.4 * maturityFactor);

  // Calibration constant K_PHYSICS ensures that 1,000-5,000 trees in a ~2km² urban zone yield realistic 0.3°C - 4.5°C cooling
  const K_PHYSICS = 18500;

  // Primary Equation 1: Delta T_air = (TreeCount * CanopyArea * LAI * Transpiration) / ZoneArea
  const rawNumerator = treeCount * effectiveCanopyPerTree * effectiveLAI * species.transpirationRate * K_PHYSICS;
  let deltaTAir = rawNumerator / zone.areaSqMeters;

  // Solar Time adjustments
  if (timeOfDay === "03PM") {
    // Peak heat stress - transpiration operates at max efficiency
    deltaTAir *= 1.15;
  } else if (timeOfDay === "07PM") {
    // Evening UHI retention - shade effect reduced, transpiration lower
    deltaTAir *= 0.85;
  }

  // Cap max realistic air cooling per zone to 5.5°C physics limit
  deltaTAir = Math.min(Math.max(deltaTAir, 0.05), 5.5);

  // Primary Equation 2: Delta T_surface = Delta T_air * 2.85
  const deltaTSurface = deltaTAir * 2.85;

  // Final Temperatures
  const currentAirTemp = Math.max(zone.baseTempAir - deltaTAir, 28.0);
  const currentSurfaceTemp = Math.max(zone.baseTempSurface - deltaTSurface, 32.0);

  // Canopy percentage of total zone area
  const canopyCoveragePct = Math.min((totalCanopyAreaSqM / zone.areaSqMeters) * 100, 100);

  // Environmental Benefits
  const co2OffsetTonsYr = ((treeCount * species.co2SequestrationKgYr * maturityFactor) / 1000);
  const stormwaterRetainedM3Yr = (totalCanopyAreaSqM * 0.45 * maturityFactor); // m³ of runoff absorbed
  const energySavingsKwhYr = Math.round(treeCount * 145 * maturityFactor * (deltaTAir / 2.0)); // kWh reduced AC load

  // Color Interpolation Engine: #EF4444 (Red) -> #F59E0B (Amber) -> #10B981 (Emerald)
  // Normalizing deltaTAir from 0°C (Red) to 3.5°C+ (Emerald)
  const normalizedCooling = Math.min(deltaTAir / 3.2, 1.0);
  const colorHex = interpolateThermalColor(normalizedCooling);

  // Heat Index Classification
  let heatIndexLevel: CoolingResult["heatIndexLevel"] = "Extreme Danger";
  if (currentAirTemp < 36.0) heatIndexLevel = "Microclimate Oasis";
  else if (currentAirTemp < 38.0) heatIndexLevel = "Moderate Comfort";
  else if (currentAirTemp < 39.5) heatIndexLevel = "Caution";
  else if (currentAirTemp < 41.0) heatIndexLevel = "Extreme Caution";
  else if (currentAirTemp < 42.5) heatIndexLevel = "Danger";
  else heatIndexLevel = "Extreme Danger";

  return {
    deltaTAir: Number(deltaTAir.toFixed(2)),
    deltaTSurface: Number(deltaTSurface.toFixed(2)),
    currentAirTemp: Number(currentAirTemp.toFixed(1)),
    currentSurfaceTemp: Number(currentSurfaceTemp.toFixed(1)),
    canopyCoverageSqM: Math.round(totalCanopyAreaSqM),
    canopyCoveragePct: Number(canopyCoveragePct.toFixed(1)),
    co2OffsetTonsYr: Number(co2OffsetTonsYr.toFixed(1)),
    stormwaterRetainedM3Yr: Math.round(stormwaterRetainedM3Yr),
    energySavingsKwhYr,
    heatIndexLevel,
    fillColor: colorHex,
    fillOpacity: 0.6 + 0.15 * normalizedCooling
  };
}

/**
 * Interpolates color between Red (#EF4444) -> Amber (#F59E0B) -> Emerald (#10B981)
 * t is normalized [0, 1] where 0 is high heat (Red) and 1 is cooled (Emerald)
 */
export function interpolateThermalColor(t: number): string {
  const red = { r: 239, g: 68, b: 68 };     // #EF4444
  const amber = { r: 245, g: 158, b: 11 };  // #F59E0B
  const emerald = { r: 16, g: 185, b: 129 }; // #10B981

  let r: number, g: number, b: number;

  if (t <= 0.5) {
    const factor = t * 2; // 0 to 1 between Red and Amber
    r = Math.round(red.r + factor * (amber.r - red.r));
    g = Math.round(red.g + factor * (amber.g - red.g));
    b = Math.round(red.b + factor * (amber.b - red.b));
  } else {
    const factor = (t - 0.5) * 2; // 0 to 1 between Amber and Emerald
    r = Math.round(amber.r + factor * (emerald.r - amber.r));
    g = Math.round(amber.g + factor * (emerald.g - amber.g));
    b = Math.round(amber.b + factor * (emerald.b - amber.b));
  }

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Calculates cooling timeline progression over mature shade years (0, 3, 7, 15+ years)
 */
export function calculateShadeTimeline(zone: ZoneData, species: TreeSpecies, treeCount: number) {
  const years = [0, 3, 7, 15];
  return years.map(yr => {
    const stage = yr <= 2 ? 2 : yr <= 5 ? 5 : yr <= 10 ? 10 : 15;
    const res = calculateMicroclimate(zone, species, {
      treeCount,
      selectedSpeciesId: species.id,
      growthStageYears: stage as 2 | 5 | 10 | 15,
      timeOfDay: "03PM"
    });
    return {
      year: yr,
      airTemp: res.currentAirTemp,
      surfaceTemp: res.currentSurfaceTemp,
      deltaAir: res.deltaTAir,
      deltaSurface: res.deltaTSurface,
      canopyCoveragePct: res.canopyCoveragePct
    };
  });
}

export interface GrowthYearData {
  year: number;
  yearLabel: string;
  stageName: string;
  stageCategory: "Baseline" | "Sapling Stage" | "Juvenile Stage" | "Maturing Stage" | "Mature Canopy";
  maturityPct: number;
  airTemp: number;
  surfaceTemp: number;
  coolingDropAir: number;
  coolingDropSurface: number;
  canopyAreaSqM: number;
  canopyCoveragePct: number;
  co2OffsetTons: number;
  acEnergySavedKwh: number;
  comfortLevel: string;
}

/**
 * Predicts year-by-year microclimate cooling over 10 years based on tree growth stages.
 */
export function calculate10YearGrowthTrend(
  zone: ZoneData,
  species: TreeSpecies,
  treeCount: number,
  timeOfDay: "12PM" | "03PM" | "07PM" | string = "03PM"
): GrowthYearData[] {
  const schedule: Array<{
    year: number;
    factor: number;
    stageName: string;
    stageCategory: GrowthYearData["stageCategory"];
  }> = [
    { year: 0, factor: 0.0, stageName: "Pre-Planting Baseline", stageCategory: "Baseline" },
    { year: 1, factor: 0.12, stageName: "Root & Sapling Setup", stageCategory: "Sapling Stage" },
    { year: 2, factor: 0.22, stageName: "Early Sapling Canopy", stageCategory: "Sapling Stage" },
    { year: 3, factor: 0.35, stageName: "Juvenile Branching", stageCategory: "Juvenile Stage" },
    { year: 4, factor: 0.48, stageName: "Mid Juvenile Growth", stageCategory: "Juvenile Stage" },
    { year: 5, factor: 0.60, stageName: "Established Young Tree", stageCategory: "Juvenile Stage" },
    { year: 6, factor: 0.70, stageName: "Active Crown Expansion", stageCategory: "Maturing Stage" },
    { year: 7, factor: 0.80, stageName: "Dense Foliage Canopy", stageCategory: "Maturing Stage" },
    { year: 8, factor: 0.88, stageName: "Maturing Crown", stageCategory: "Maturing Stage" },
    { year: 9, factor: 0.94, stageName: "Pre-Mature Urban Forest", stageCategory: "Mature Canopy" },
    { year: 10, factor: 1.00, stageName: "Full Mature Canopy", stageCategory: "Mature Canopy" }
  ];

  const K_PHYSICS = 18500;

  return schedule.map((item) => {
    if (item.year === 0 || item.factor === 0) {
      return {
        year: 0,
        yearLabel: "Yr 0",
        stageName: item.stageName,
        stageCategory: item.stageCategory,
        maturityPct: 0,
        airTemp: Number(zone.baseTempAir.toFixed(1)),
        surfaceTemp: Number(zone.baseTempSurface.toFixed(1)),
        coolingDropAir: 0,
        coolingDropSurface: 0,
        canopyAreaSqM: 0,
        canopyCoveragePct: 0,
        co2OffsetTons: 0,
        acEnergySavedKwh: 0,
        comfortLevel: "Severe Heat"
      };
    }

    const effectiveCanopyPerTree = species.canopyArea * item.factor;
    const totalCanopyAreaSqM = treeCount * effectiveCanopyPerTree;
    const effectiveLAI = species.lai * (0.6 + 0.4 * item.factor);

    const rawNumerator =
      treeCount *
      effectiveCanopyPerTree *
      effectiveLAI *
      species.transpirationRate *
      K_PHYSICS;
    let deltaTAir = rawNumerator / zone.areaSqMeters;

    if (timeOfDay === "03PM") {
      deltaTAir *= 1.15;
    } else if (timeOfDay === "07PM") {
      deltaTAir *= 0.85;
    }

    deltaTAir = Math.min(Math.max(deltaTAir, 0.05), 5.5);
    const deltaTSurface = deltaTAir * 2.85;

    const currentAirTemp = Math.max(zone.baseTempAir - deltaTAir, 28.0);
    const currentSurfaceTemp = Math.max(zone.baseTempSurface - deltaTSurface, 32.0);
    const canopyCoveragePct = Math.min((totalCanopyAreaSqM / zone.areaSqMeters) * 100, 100);

    let comfortLevel = "Extreme Danger";
    if (currentAirTemp < 36.0) comfortLevel = "Comfortable Oasis";
    else if (currentAirTemp < 38.0) comfortLevel = "Moderate Comfort";
    else if (currentAirTemp < 39.5) comfortLevel = "Mild Caution";
    else if (currentAirTemp < 41.0) comfortLevel = "Warm / Warning";
    else comfortLevel = "Severe Heat";

    return {
      year: item.year,
      yearLabel: `Yr ${item.year}`,
      stageName: item.stageName,
      stageCategory: item.stageCategory,
      maturityPct: Math.round(item.factor * 100),
      airTemp: Number(currentAirTemp.toFixed(1)),
      surfaceTemp: Number(currentSurfaceTemp.toFixed(1)),
      coolingDropAir: Number(deltaTAir.toFixed(2)),
      coolingDropSurface: Number(deltaTSurface.toFixed(2)),
      canopyAreaSqM: Math.round(totalCanopyAreaSqM),
      canopyCoveragePct: Number(canopyCoveragePct.toFixed(1)),
      co2OffsetTons: Number(
        ((treeCount * species.co2SequestrationKgYr * item.factor) / 1000).toFixed(1)
      ),
      acEnergySavedKwh: Math.round(treeCount * 145 * item.factor * (deltaTAir / 2.0)),
      comfortLevel
    };
  });
}
