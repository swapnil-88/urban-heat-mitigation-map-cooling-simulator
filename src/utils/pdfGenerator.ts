import { jsPDF } from "jspdf";
import { ZoneData, CoolingResult, TreeSpecies, SimulationParams } from "../types";
import { calculate10YearGrowthTrend } from "./microclimateEngine";

export function generateMicroclimatePdf(
  zone: ZoneData,
  coolingResult: CoolingResult,
  species: TreeSpecies,
  params: SimulationParams
): { doc: jsPDF; filename: string } {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const filename = `VMC_Cooling_Assessment_${zone.name.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;

  // --- Top Decorative Municipal Header Band ---
  doc.setFillColor(5, 150, 105); // Emerald-600
  doc.rect(0, 0, 210, 6, "F");

  doc.setFillColor(15, 23, 42); // Slate-900 thin line
  doc.rect(0, 6, 210, 0.8, "F");

  // --- Header Section ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(4, 120, 87); // Emerald-700
  doc.text("GOVERNMENT OF GUJARAT — VADODARA MUNICIPAL CORPORATION (VMC)", 14, 14);

  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text("URBAN HEAT ISLAND (UHI) MITIGATION & COOLING ASSESSMENT", 14, 21);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text("Municipal Decision Support System • Microclimate Thermodynamics & Botanical Modeling", 14, 26);

  // Meta box top right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Ref ID: VMC-UHI-2026-${zone.id.toUpperCase()}`, 196, 14, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${currentDate}`, 196, 18, { align: "right" });
  doc.setTextColor(4, 120, 87);
  doc.setFont("helvetica", "bold");
  doc.text("Status: OFFICIAL ASSESSMENT", 196, 22, { align: "right" });

  // Dividing Line
  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.setLineWidth(0.5);
  doc.line(14, 29, 196, 29);

  let currentY = 35;

  // --- 1. Target Urban Zone Baseline Metadata ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("1. TARGET URBAN SECTOR BASELINE", 14, currentY);

  currentY += 4;
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.rect(14, currentY, 182, 18, "FD");

  doc.setFontSize(8);
  // Column 1
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Sector Name:", 18, currentY + 5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(zone.name, 18, currentY + 10);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("UHI Risk Level:", 18, currentY + 15);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(185, 28, 28); // Red-700
  doc.text(zone.uhiClassification, 42, currentY + 15);

  // Column 2
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Baseline Air Temp:", 82, currentY + 5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${zone.baseTempAir} °C`, 82, currentY + 10);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Baseline Surface Temp:", 82, currentY + 15);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 83, 9); // Amber-700
  doc.text(`${zone.baseTempSurface} °C`, 116, currentY + 15);

  // Column 3
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Ward Area:", 145, currentY + 5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${(zone.areaSqMeters / 1000000).toFixed(2)} km²`, 145, currentY + 10);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Impervious Cover:", 145, currentY + 15);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${zone.imperviousCoverPct}% (Paved)`, 170, currentY + 15);

  currentY += 24;

  // --- 2. Plantation Intervention Parameters ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("2. CANOPY INTERVENTION PARAMETERS", 14, currentY);

  currentY += 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, currentY, 182, 16, "FD");

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Tree Quantity:", 18, currentY + 5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(4, 120, 87);
  doc.text(`${params.treeCount.toLocaleString()} Trees`, 18, currentY + 11);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Botanical Species:", 65, currentY + 5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${species.name} (${species.scientificName})`, 65, currentY + 11);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Canopy Area / Tree:", 145, currentY + 5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${species.canopyArea} m² (LAI: ${species.lai})`, 145, currentY + 11);

  currentY += 22;

  // --- 3. Simulated Microclimate Cooling Results ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("3. SIMULATED MICROCLIMATE COOLING RESULTS", 14, currentY);

  currentY += 4;
  // Green highlighted card
  doc.setFillColor(236, 253, 245); // Emerald-50
  doc.setDrawColor(167, 243, 208); // Emerald-200
  doc.rect(14, currentY, 182, 26, "FD");

  // Box 1: Air Temp
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(4, 120, 87);
  doc.text(`-${coolingResult.deltaTAir} °C`, 22, currentY + 9);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Air Cooling (ΔT_air)", 22, currentY + 15);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Simulated Air: ${coolingResult.currentAirTemp} °C (was ${zone.baseTempAir} °C)`, 22, currentY + 20);

  // Box 2: Surface Temp
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(180, 83, 9);
  doc.text(`-${coolingResult.deltaTSurface} °C`, 85, currentY + 9);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Surface Drop (ΔT_surface)", 85, currentY + 15);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Shaded Ground: ${coolingResult.currentSurfaceTemp} °C (was ${zone.baseTempSurface} °C)`, 85, currentY + 20);

  // Box 3: Shaded Canopy & Comfort
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(3, 105, 161);
  doc.text(`${coolingResult.canopyCoveragePct}%`, 148, currentY + 8);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Ward Canopy Coverage", 148, currentY + 14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`${coolingResult.canopyCoverageSqM.toLocaleString()} m² active shade`, 148, currentY + 19);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(4, 120, 87);
  doc.text(`Comfort: ${coolingResult.heatIndexLevel}`, 148, currentY + 23);

  currentY += 32;

  // --- 4. 10-Year Growth Stage Forecast Table ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("4. 10-YEAR PREDICTED GROWTH STAGE COOLING PROGRESSION", 14, currentY);

  currentY += 4;
  const trend = calculate10YearGrowthTrend(zone, species, params.treeCount, params.timeOfDay);
  const milestoneYears = [0, 2, 5, 8, 10];
  const milestones = trend.filter((t) => milestoneYears.includes(t.year));

  // Table Header
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(14, currentY, 182, 6, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Year", 18, currentY + 4.2);
  doc.text("Tree Growth Stage", 36, currentY + 4.2);
  doc.text("Canopy Size", 82, currentY + 4.2);
  doc.text("Air Temp", 112, currentY + 4.2);
  doc.text("Air Cooling Drop", 136, currentY + 4.2);
  doc.text("Surface Drop", 168, currentY + 4.2);

  currentY += 6;

  milestones.forEach((m, idx) => {
    const rowBg = idx % 2 === 0 ? 255 : 248;
    doc.setFillColor(rowBg, rowBg, rowBg);
    doc.rect(14, currentY, 182, 6, "F");
    doc.setDrawColor(226, 232, 240);
    doc.line(14, currentY + 6, 196, currentY + 6);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(m.year === 0 ? "Year 0" : `Year ${m.year}`, 18, currentY + 4.2);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(`${m.stageName} (${m.maturityPct}%)`, 36, currentY + 4.2);
    doc.text(`${m.canopyAreaSqM.toLocaleString()} m²`, 82, currentY + 4.2);

    doc.setFont("helvetica", "bold");
    doc.text(`${m.airTemp} °C`, 112, currentY + 4.2);

    doc.setTextColor(4, 120, 87);
    doc.text(`-${m.coolingDropAir} °C`, 136, currentY + 4.2);

    doc.setTextColor(180, 83, 9);
    doc.text(`-${m.coolingDropSurface} °C`, 168, currentY + 4.2);

    currentY += 6;
  });

  currentY += 5;

  // --- 5. Annual Environmental Benefits & ROI ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("5. ANNUAL ENVIRONMENTAL BENEFITS & MUNICIPAL ROI", 14, currentY);

  currentY += 4;
  doc.setFillColor(30, 41, 59);
  doc.rect(14, currentY, 182, 6, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Indicator Metric", 18, currentY + 4.2);
  doc.text("Annual Yield", 78, currentY + 4.2);
  doc.text("Municipal Impact Description", 120, currentY + 4.2);

  currentY += 6;

  const benefits = [
    {
      name: "CO2 Sequestration",
      yield: `${coolingResult.co2OffsetTonsYr} Tons / year`,
      impact: "Carbon sink absorption & particulate smog reduction"
    },
    {
      name: "Stormwater Absorption",
      yield: `${coolingResult.stormwaterRetainedM3Yr.toLocaleString()} m³ / year`,
      impact: "Monsoon street flooding mitigation & aquifer recharge"
    },
    {
      name: "Building AC Power Savings",
      yield: `${coolingResult.energySavingsKwhYr.toLocaleString()} kWh / year`,
      impact: "Electricity bill savings & peak summer power grid relief"
    },
    {
      name: "Pedestrian Shade Area",
      yield: `${coolingResult.canopyCoverageSqM.toLocaleString()} m²`,
      impact: "Safe walking conditions & reduced heatstroke vulnerability"
    }
  ];

  benefits.forEach((b, idx) => {
    const rowBg = idx % 2 === 0 ? 255 : 248;
    doc.setFillColor(rowBg, rowBg, rowBg);
    doc.rect(14, currentY, 182, 6, "F");
    doc.setDrawColor(226, 232, 240);
    doc.line(14, currentY + 6, 196, currentY + 6);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(b.name, 18, currentY + 4.2);

    doc.setTextColor(4, 120, 87);
    doc.text(b.yield, 78, currentY + 4.2);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(b.impact, 120, currentY + 4.2);

    currentY += 6;
  });

  currentY += 8;

  // --- Official Verification & Signature Footer ---
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(14, currentY, 196, currentY);

  currentY += 5;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Generated by: Vadodara Municipal Corporation Urban Heat Portal", 14, currentY);
  doc.text("Physical Engine: Microclimate ΔT Thermodynamic Equilibrium Equation", 14, currentY + 4);
  doc.text("Geographic Projection: WGS84 / EPSG:4326 (Vadodara Municipal Area)", 14, currentY + 8);

  // Signature lines
  doc.setDrawColor(148, 163, 184);
  doc.line(145, currentY + 6, 195, currentY + 6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Chief Urban Development Officer", 170, currentY + 10, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Vadodara Municipal Corporation", 170, currentY + 14, { align: "center" });

  // Page footer line
  doc.setFillColor(5, 150, 105);
  doc.rect(0, 293, 210, 4, "F");

  return { doc, filename };
}

/**
 * Triggers safe, reliable download across modern browsers, iframes, and mobile devices
 */
export function downloadMicroclimatePdf(
  zone: ZoneData,
  coolingResult: CoolingResult,
  species: TreeSpecies,
  params: SimulationParams
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const { doc, filename } = generateMicroclimatePdf(zone, coolingResult, species, params);

      // 1. Get blob
      const blob = doc.output("blob");
      const blobUrl = URL.createObjectURL(blob);

      // 2. Create invisible anchor with download attribute
      const anchor = document.createElement("a");
      anchor.style.display = "none";
      anchor.href = blobUrl;
      anchor.download = filename;
      anchor.target = "_blank"; // Helps iframes handle downloads
      document.body.appendChild(anchor);

      // 3. Trigger download
      anchor.click();

      // 4. Cleanup after slight delay
      setTimeout(() => {
        try {
          if (document.body.contains(anchor)) {
            document.body.removeChild(anchor);
          }
          URL.revokeObjectURL(blobUrl);
        } catch {
          // ignore cleanup errors
        }
      }, 2000);

      resolve(filename);
    } catch (error) {
      console.error("PDF generation or download failed:", error);
      reject(error);
    }
  });
}
