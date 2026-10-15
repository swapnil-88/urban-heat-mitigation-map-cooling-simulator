import { TreeSpecies, ZoneData } from "../types";

export const SPECIES_CATALOG: TreeSpecies[] = [
  {
    id: "bakul",
    name: "Bakul",
    scientificName: "Mimusops elengi",
    gujaratiName: "બોરસલ્લી (Borsalli)",
    canopyArea: 42,
    lai: 4.8,
    transpirationRate: 0.00028,
    co2SequestrationKgYr: 28,
    waterReqLitersDay: 25,
    shadeEfficiency: 0.92,
    idealZones: ["zone-1", "zone-3"],
    description: "Dense evergreen canopy native to Gujarat with fragrant flowers. Highly effective for dense urban street canyons and historic heritage corridors.",
    iconName: "Flower2"
  },
  {
    id: "neem",
    name: "Neem",
    scientificName: "Azadirachta indica",
    gujaratiName: "લીમડો (Limbdo)",
    canopyArea: 68,
    lai: 4.2,
    transpirationRate: 0.00032,
    co2SequestrationKgYr: 36,
    waterReqLitersDay: 18,
    shadeEfficiency: 0.88,
    idealZones: ["zone-2", "zone-5"],
    description: "Extremely resilient, pollution-tolerant native species. Ideal for industrial zones like Makarpura GIDC, absorbing airborne particulate matter.",
    iconName: "TreeDeciduous"
  },
  {
    id: "karanj",
    name: "Karanj (Indian Beech)",
    scientificName: "Pongamia pinnata",
    gujaratiName: "કણંજી (Karanji)",
    canopyArea: 52,
    lai: 4.5,
    transpirationRate: 0.00029,
    co2SequestrationKgYr: 31,
    waterReqLitersDay: 20,
    shadeEfficiency: 0.86,
    idealZones: ["zone-2", "zone-1"],
    description: "Salt and drought tolerant, excellent nitrogen fixer. Perfect for industrial perimeter buffer planting and high-heat concrete buffers.",
    iconName: "ShieldAlert"
  },
  {
    id: "amaltas",
    name: "Amaltas (Golden Shower)",
    scientificName: "Cassia fistula",
    gujaratiName: "ગરમાળો (Garmalo)",
    canopyArea: 48,
    lai: 3.8,
    transpirationRate: 0.00025,
    co2SequestrationKgYr: 22,
    waterReqLitersDay: 22,
    shadeEfficiency: 0.82,
    idealZones: ["zone-3", "zone-4"],
    description: "Stunning yellow seasonal blooms. Medium canopy suited for commercial thoroughfares like RC Dutt Road, providing vibrant aesthetic & microclimate cooling.",
    iconName: "Sun"
  },
  {
    id: "peepal",
    name: "Peepal (Sacred Fig)",
    scientificName: "Ficus religiosa",
    gujaratiName: "પીપળો (Piplo)",
    canopyArea: 95,
    lai: 5.4,
    transpirationRate: 0.00038,
    co2SequestrationKgYr: 48,
    waterReqLitersDay: 35,
    shadeEfficiency: 0.98,
    idealZones: ["zone-4", "zone-5"],
    description: "Massive thermal cooling footprint with round-the-clock oxygen emission. Supreme candidate for high-rise open space parks in Gotri & Vasna-Bhayli.",
    iconName: "Trees"
  },
  {
    id: "jamun",
    name: "Jamun (Black Plum)",
    scientificName: "Syzygium cumini",
    gujaratiName: "જાંબુ (Jambu)",
    canopyArea: 58,
    lai: 4.6,
    transpirationRate: 0.00031,
    co2SequestrationKgYr: 33,
    waterReqLitersDay: 30,
    shadeEfficiency: 0.90,
    idealZones: ["zone-5", "zone-1"],
    description: "Evergreen broadleaf tree offering thick shade and edible fruit. Flourishes along suburban transit routes like Waghodia Road and Sayajipura.",
    iconName: "Apple"
  },
  {
    id: "banyan",
    name: "Banyan (Vad)",
    scientificName: "Ficus benghalensis",
    gujaratiName: "વડ (Vad)",
    canopyArea: 120,
    lai: 5.2,
    transpirationRate: 0.00042,
    co2SequestrationKgYr: 55,
    waterReqLitersDay: 35,
    shadeEfficiency: 0.98,
    idealZones: ["zone-1", "zone-4"],
    description: "Vadodara's namesake keystone species. Expansive cooling crown footprint up to 120 m² delivering maximum thermal radiation extinction for public parks and wide medians.",
    iconName: "Trees"
  }
];

export const VADODARA_ZONES: ZoneData[] = [
  {
    id: "zone-1",
    name: "Mandvi / Old City Walled Area",
    shortName: "Mandvi Heritage Core",
    category: "Heritage Dense Core",
    uhiClassification: "Severe UHI",
    baseTempAir: 41.5,
    baseTempSurface: 50.0,
    areaSqMeters: 1450000, // ~1.45 km²
    center: [22.3005, 73.2035],
    polygon: {
      type: "Polygon",
      coordinates: [[
        [73.1950, 22.3050],
        [73.2110, 22.3060],
        [73.2120, 22.2960],
        [73.1970, 22.2940],
        [73.1950, 22.3050]
      ]]
    },
    primarySpecies: [SPECIES_CATALOG[0], SPECIES_CATALOG[2], SPECIES_CATALOG[5]], // Bakul, Karanj, Jamun
    recommendedCount: 2200,
    populationDensity: 28500,
    imperviousCoverPct: 88,
    description: "Narrow historic avenues with high building density and minimal green cover. Creates intense heat trapping during daytime solar irradiation.",
    keyChallenges: ["Canyon effect trapping exhaust heat", "Unprotected brick & concrete rooftops", "Lack of open soil for planting"]
  },
  {
    id: "zone-2",
    name: "Makarpura GIDC Industrial Corridor",
    shortName: "Makarpura GIDC",
    category: "Heavy Industrial Estate",
    uhiClassification: "Extreme Industrial Heat",
    baseTempAir: 43.8,
    baseTempSurface: 54.2,
    areaSqMeters: 2800000, // ~2.80 km²
    center: [22.2510, 73.1910],
    polygon: {
      type: "Polygon",
      coordinates: [[
        [73.1800, 22.2610],
        [73.2020, 22.2620],
        [73.2040, 22.2410],
        [73.1810, 22.2400],
        [73.1800, 22.2610]
      ]]
    },
    primarySpecies: [SPECIES_CATALOG[1], SPECIES_CATALOG[2]], // Neem, Karanj
    recommendedCount: 4500,
    populationDensity: 8200,
    imperviousCoverPct: 92,
    description: "Extremely high surface thermal reflection from corrugated metal roofs, asphalt logistics corridors, and chemical/engineering plants.",
    keyChallenges: ["Metal roof radiation > 58°C", "Particulate emissions exacerbating air stagnation", "Low soil moisture retention"]
  },
  {
    id: "zone-3",
    name: "Alkapuri / RC Dutt Road Commercial Hub",
    shortName: "Alkapuri & RC Dutt Rd",
    category: "Commercial Business District",
    uhiClassification: "Commercial Asphalt",
    baseTempAir: 39.2,
    baseTempSurface: 47.7,
    areaSqMeters: 1850000, // ~1.85 km²
    center: [22.3125, 73.1715],
    polygon: {
      type: "Polygon",
      coordinates: [[
        [73.1620, 22.3190],
        [73.1810, 22.3195],
        [73.1800, 22.3060],
        [73.1610, 22.3050],
        [73.1620, 22.3190]
      ]]
    },
    primarySpecies: [SPECIES_CATALOG[3], SPECIES_CATALOG[0]], // Amaltas, Bakul
    recommendedCount: 2800,
    populationDensity: 14200,
    imperviousCoverPct: 81,
    description: "Major financial and retail boulevard featuring extensive vehicular parking plazas, multi-story glass facade reflections, and asphalt arteries.",
    keyChallenges: ["Reflective glass façade solar loading", "Heavy bumper-to-bumper AC exhaust", "Paved surface parking lots"]
  },
  {
    id: "zone-4",
    name: "Gotri & Vasna-Bhayli Residential Sprawl",
    shortName: "Gotri - Vasna Bhayli",
    category: "High-Rise Residential Sprawl",
    uhiClassification: "High-Rise Sprawl",
    baseTempAir: 38.5,
    baseTempSurface: 46.8,
    areaSqMeters: 3200000, // ~3.20 km²
    center: [22.3160, 73.1430],
    polygon: {
      type: "Polygon",
      coordinates: [[
        [73.1310, 22.3260],
        [73.1550, 22.3270],
        [73.1560, 22.3050],
        [73.1320, 22.3040],
        [73.1310, 22.3260]
      ]]
    },
    primarySpecies: [SPECIES_CATALOG[4], SPECIES_CATALOG[3]], // Peepal, Amaltas
    recommendedCount: 3800,
    populationDensity: 11500,
    imperviousCoverPct: 74,
    description: "Rapidly developing western sector with new high-rise residential towers, expanding road networks, and developing township green belts.",
    keyChallenges: ["Vegetation loss during construction phase", "Concrete paved amenity spaces", "Unshaded wide avenue boulevards"]
  },
  {
    id: "zone-5",
    name: "Waghodia Road & Sayajipura Transit Corridor",
    shortName: "Waghodia & Sayajipura",
    category: "Suburban Arterial Transit",
    uhiClassification: "Suburban Transit",
    baseTempAir: 40.1,
    baseTempSurface: 48.9,
    areaSqMeters: 2600000, // ~2.60 km²
    center: [22.3220, 73.2280],
    polygon: {
      type: "Polygon",
      coordinates: [[
        [73.2150, 22.3320],
        [73.2420, 22.3330],
        [73.2410, 22.3120],
        [73.2140, 22.3110],
        [73.2150, 22.3320]
      ]]
    },
    primarySpecies: [SPECIES_CATALOG[5], SPECIES_CATALOG[1]], // Jamun, Neem
    recommendedCount: 3200,
    populationDensity: 16800,
    imperviousCoverPct: 79,
    description: "Key eastern entry gateway connecting Vadodara to educational hubs and national highway traffic. Characterized by high dust load and wide exposed pavement.",
    keyChallenges: ["Highway vehicle heat retention", "Dust buildup clogging leaf stomata", "Unshaded pedestrian walkways"]
  },
  {
    id: "zone-6",
    name: "Nandesari Chemical GIDC Complex",
    shortName: "Nandesari Industrial",
    category: "Heavy Chemical Industrial",
    uhiClassification: "Extreme Industrial Heat",
    baseTempAir: 44.5,
    baseTempSurface: 55.8,
    areaSqMeters: 3100000, // ~3.10 km²
    center: [22.4120, 73.0900],
    polygon: {
      type: "Polygon",
      coordinates: [[
        [73.0780, 22.4210],
        [73.1020, 22.4220],
        [73.1010, 22.4020],
        [73.0770, 22.4010],
        [73.0780, 22.4210]
      ]]
    },
    primarySpecies: [SPECIES_CATALOG[1], SPECIES_CATALOG[2]], // Neem, Karanj
    recommendedCount: 5200,
    populationDensity: 4500,
    imperviousCoverPct: 94,
    description: "Major north chemical manufacturing cluster with heavy thermal emissions, extensive concrete storage yards, and metal shed roofs radiating extreme radiant heat.",
    keyChallenges: ["Toxic VOCs and chemical thermal emissions", "Massive unshaded storage yards", "Lack of natural soil moisture"]
  },
  {
    id: "zone-7",
    name: "Gorwa & Subhanpura Urban Hub",
    shortName: "Gorwa - Subhanpura",
    category: "Mixed Industrial & Residential",
    uhiClassification: "Severe UHI",
    baseTempAir: 41.0,
    baseTempSurface: 49.5,
    areaSqMeters: 2400000, // ~2.40 km²
    center: [22.3330, 73.1610],
    polygon: {
      type: "Polygon",
      coordinates: [[
        [73.1490, 22.3420],
        [73.1720, 22.3430],
        [73.1730, 22.3240],
        [73.1480, 22.3230],
        [73.1490, 22.3420]
      ]]
    },
    primarySpecies: [SPECIES_CATALOG[0], SPECIES_CATALOG[3], SPECIES_CATALOG[5]], // Bakul, Amaltas, Jamun
    recommendedCount: 2900,
    populationDensity: 22400,
    imperviousCoverPct: 85,
    description: "Densely populated northwest residential sector adjoining legacy foundry units and industrial estates. Features high rooftop heat absorption.",
    keyChallenges: ["Dense apartment rooftop solar absorption", "Narrow inter-colony access roads", "Legacy industrial heat plume drift"]
  },
  {
    id: "zone-8",
    name: "Fatehgunj & MSU University Corridor",
    shortName: "Fatehgunj MSU Corridor",
    category: "Academic & Transit Boulevard",
    uhiClassification: "Commercial Asphalt",
    baseTempAir: 39.8,
    baseTempSurface: 47.9,
    areaSqMeters: 1950000, // ~1.95 km²
    center: [22.3180, 73.1870],
    polygon: {
      type: "Polygon",
      coordinates: [[
        [73.1780, 22.3260],
        [73.1960, 22.3270],
        [73.1970, 22.3090],
        [73.1770, 22.3080],
        [73.1780, 22.3260]
      ]]
    },
    primarySpecies: [SPECIES_CATALOG[0], SPECIES_CATALOG[3], SPECIES_CATALOG[4]], // Bakul, Amaltas, Peepal
    recommendedCount: 2600,
    populationDensity: 19200,
    imperviousCoverPct: 82,
    description: "Vibrant educational and commercial arterial corridor surrounding M.S. University of Baroda, Fatehgunj flyover, and student dining arcades.",
    keyChallenges: ["Elevated flyover asphalt thermal radiating", "High student pedestrian exposure", "Bus & transit stop microclimate hot spots"]
  },
  {
    id: "zone-9",
    name: "Sayaji Baug & Laxmi Vilas Palace Heritage Reserve",
    shortName: "Sayaji Baug & Palace",
    category: "Heritage Canopy Parkland",
    uhiClassification: "Suburban Transit",
    baseTempAir: 36.2,
    baseTempSurface: 41.5,
    areaSqMeters: 2900000, // ~2.90 km²
    center: [22.2920, 73.1920],
    polygon: {
      type: "Polygon",
      coordinates: [[
        [73.1820, 22.3010],
        [73.2010, 22.3020],
        [73.2020, 22.2830],
        [73.1830, 22.2820],
        [73.1820, 22.3010]
      ]]
    },
    primarySpecies: [SPECIES_CATALOG[4], SPECIES_CATALOG[0], SPECIES_CATALOG[5]], // Peepal, Bakul, Jamun
    recommendedCount: 1200,
    populationDensity: 3100,
    imperviousCoverPct: 35,
    description: "Vadodara's primary ecological lung and historical green anchor. Features thousands of heritage trees, Kamati Baug zoo, and Vishwamitri riverbank flora.",
    keyChallenges: ["Encroachment along perimeter boundaries", "Soil erosion along riverbanks", "Need for climate-resilient understory planting"]
  }
];

export const VADODARA_CENTER: [number, number] = [22.3072, 73.1812];

/**
 * Returns whether a tree species is botanically preferable/recommended for a given municipal sector.
 */
export function isTreePreferableForZone(speciesId: string, zone?: ZoneData | null): boolean {
  if (!zone || !speciesId) return false;
  
  if (zone.primarySpecies?.some((ps) => ps && ps.id === speciesId)) {
    return true;
  }
  
  const defaultZone = VADODARA_ZONES.find((vz) => vz.id === zone.id);
  if (defaultZone?.primarySpecies?.some((ps) => ps && ps.id === speciesId)) {
    return true;
  }
  
  const sp = SPECIES_CATALOG.find((s) => s.id === speciesId);
  if (sp?.idealZones?.includes(zone.id)) {
    return true;
  }
  
  return false;
}
