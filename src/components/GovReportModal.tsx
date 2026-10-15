import React, { useState } from "react";
import { ZoneData, CoolingResult, TreeSpecies, SimulationParams } from "../types";
import { X, Printer, ShieldCheck, Download, CheckCircle2, FileText, AlertCircle, Loader2 } from "lucide-react";
import { downloadMicroclimatePdf } from "../utils/pdfGenerator";
import { calculate10YearGrowthTrend } from "../utils/microclimateEngine";

interface GovReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: ZoneData;
  coolingResult: CoolingResult;
  species: TreeSpecies;
  params: SimulationParams;
}

export const GovReportModal: React.FC<GovReportModalProps> = ({
  isOpen,
  onClose,
  zone,
  coolingResult,
  species,
  params
}) => {
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "generating" | "success" | "error">("idle");
  const [downloadedFilename, setDownloadedFilename] = useState<string>("");

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    try {
      setDownloadStatus("generating");
      const filename = await downloadMicroclimatePdf(zone, coolingResult, species, params);
      setDownloadedFilename(filename);
      setDownloadStatus("success");
      setTimeout(() => {
        setDownloadStatus("idle");
      }, 3500);
    } catch (err) {
      console.error("PDF download failed:", err);
      setDownloadStatus("error");
      setTimeout(() => {
        setDownloadStatus("idle");
      }, 4000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const trend = calculate10YearGrowthTrend(zone, species, params.treeCount, params.timeOfDay);
  const milestoneYears = [0, 2, 5, 8, 10];
  const milestones = trend.filter((t) => milestoneYears.includes(t.year));

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-4 sm:p-6 text-slate-900 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Modal Controls Top */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-slate-900">
                Municipal Microclimate Assessment Report
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                Official UHI Mitigation & Canopy Modeling Document
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {/* Primary Action: Direct Download PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={downloadStatus === "generating"}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                downloadStatus === "success"
                  ? "bg-emerald-700 text-white"
                  : downloadStatus === "error"
                  ? "bg-red-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
              title="Download official PDF document directly to your device"
            >
              {downloadStatus === "generating" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : downloadStatus === "success" ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Downloaded!</span>
                </>
              ) : downloadStatus === "error" ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>Retry Download</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Secondary Action: Print */}
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Download Feedback Banner */}
        {downloadStatus === "success" && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center space-x-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Report successfully downloaded as <strong>{downloadedFilename}</strong>. You can open and view it anytime.
            </span>
          </div>
        )}

        {/* Printable Official Document Body */}
        <div id="printable-report" className="bg-white text-slate-900 p-5 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6 font-sans">
          {/* Letterhead Header */}
          <div className="border-b-2 border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-emerald-800 uppercase block font-mono">
                Government of Gujarat — Municipal Corporation of Vadodara
              </span>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                URBAN HEAT ISLAND (UHI) MITIGATION & COOLING ASSESSMENT
              </h1>
              <p className="text-xs text-slate-600 font-mono">
                GIS Reference: VMC-UHI-2026-{zone.id.toUpperCase()} | Coordinates: 22.3072&deg; N, 73.1812&deg; E
              </p>
            </div>
            <div className="text-left sm:text-right text-xs font-mono text-slate-600 space-y-0.5">
              <div>Date: <strong>{currentDate}</strong></div>
              <div>Status: <strong className="text-emerald-700">APPROVED SIMULATION</strong></div>
            </div>
          </div>

          {/* Section 1: Target Zone Parameters */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
              1. Urban Zone Baseline Metadata
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">Zone Name:</span>
                <strong className="text-slate-900">{zone.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">UHI Category:</span>
                <strong className="text-red-700">{zone.uhiClassification}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Baseline Air Temp:</span>
                <strong className="text-slate-900">{zone.baseTempAir}&deg;C</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Baseline Surface Temp:</span>
                <strong className="text-slate-900">{zone.baseTempSurface}&deg;C</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Intervention Microclimate Results */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
              2. Tree Plantation Intervention & Microclimate Outcomes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs">
              <div className="space-y-1">
                <span className="text-slate-600 block font-mono text-[11px]">Planted Tree Volume:</span>
                <strong className="text-xl text-emerald-800 font-mono font-bold">
                  {params.treeCount.toLocaleString()} Trees
                </strong>
                <p className="text-xs text-slate-700 font-semibold mt-1">
                  Species: {species.name} ({species.scientificName})
                </p>
                <p className="text-[11px] text-slate-600">
                  Gujarati: {species.gujaratiName} &bull; Crown Area: {species.canopyArea}m&sup2; (LAI: {species.lai})
                </p>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between border-b border-emerald-200 pb-1">
                  <span className="text-slate-700">Air Cooling (&Delta;T_air):</span>
                  <strong className="text-emerald-800 text-sm">
                    -{coolingResult.deltaTAir}&deg;C ({coolingResult.currentAirTemp}&deg;C)
                  </strong>
                </div>
                <div className="flex justify-between border-b border-emerald-200 pb-1">
                  <span className="text-slate-700">Surface Drop (&Delta;T_surface):</span>
                  <strong className="text-amber-800 text-sm">
                    -{coolingResult.deltaTSurface}&deg;C ({coolingResult.currentSurfaceTemp}&deg;C)
                  </strong>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-slate-700">Canopy Coverage:</span>
                  <strong className="text-sky-800">
                    {coolingResult.canopyCoveragePct}% ({coolingResult.canopyCoverageSqM.toLocaleString()} m&sup2;)
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 10-Year Growth Projection Milestones */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
              3. 10-Year Growth Stage Forecast Milestones
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-800 text-white text-[11px]">
                    <th className="p-2 border border-slate-700">Milestone</th>
                    <th className="p-2 border border-slate-700">Growth Stage</th>
                    <th className="p-2 border border-slate-700">Canopy Area</th>
                    <th className="p-2 border border-slate-700">Air Temp</th>
                    <th className="p-2 border border-slate-700">Air Cooling Drop</th>
                    <th className="p-2 border border-slate-700">Surface Drop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {milestones.map((m) => (
                    <tr key={m.year} className="hover:bg-slate-50">
                      <td className="p-2 border font-bold text-slate-900">
                        {m.year === 0 ? "Year 0" : `Year ${m.year}`}
                      </td>
                      <td className="p-2 border text-slate-700">
                        {m.stageName} ({m.maturityPct}%)
                      </td>
                      <td className="p-2 border text-slate-700">
                        {m.canopyAreaSqM.toLocaleString()} m&sup2;
                      </td>
                      <td className="p-2 border font-bold text-slate-900">
                        {m.airTemp}&deg;C
                      </td>
                      <td className="p-2 border font-bold text-emerald-700">
                        -{m.coolingDropAir}&deg;C
                      </td>
                      <td className="p-2 border font-bold text-amber-700">
                        -{m.coolingDropSurface}&deg;C
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Environmental ROI Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
              4. Annual Environmental Benefits & ROI
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-800 text-white text-[11px]">
                    <th className="p-2 border border-slate-700">Metric Indicator</th>
                    <th className="p-2 border border-slate-700">Calculated Yield</th>
                    <th className="p-2 border border-slate-700">Impact Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 border font-medium">CO2 Sequestration</td>
                    <td className="p-2 border text-emerald-700 font-bold">{coolingResult.co2OffsetTonsYr} Tons / year</td>
                    <td className="p-2 border text-slate-600">Air quality & carbon offset</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Stormwater Retention</td>
                    <td className="p-2 border text-sky-700 font-bold">{coolingResult.stormwaterRetainedM3Yr.toLocaleString()} m&sup3; / year</td>
                    <td className="p-2 border text-slate-600">Monsoon urban flood risk mitigation</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Building AC Energy Savings</td>
                    <td className="p-2 border text-purple-700 font-bold">{coolingResult.energySavingsKwhYr.toLocaleString()} kWh / year</td>
                    <td className="p-2 border text-slate-600">Grid demand reduction during peak summer</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Microclimate Canopy Coverage</td>
                    <td className="p-2 border text-slate-900 font-bold">{coolingResult.canopyCoverageSqM.toLocaleString()} m&sup2; ({coolingResult.canopyCoveragePct}%)</td>
                    <td className="p-2 border text-slate-600">Shade comfort for pedestrians</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Signature Footer */}
          <div className="pt-6 border-t border-slate-300 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-xs font-mono text-slate-600">
            <div>
              <p>Generated by: <strong>Vadodara GIS & Urban Climate Portal</strong></p>
              <p>Mathematical Engine: Verified &Delta;T Physics Equations</p>
            </div>
            <div className="text-center space-y-1 self-end sm:self-auto">
              <div className="w-36 border-b border-slate-400 mx-auto" />
              <p className="font-bold text-slate-800">Chief Urban Development Officer</p>
              <p className="text-[10px] text-slate-500">Vadodara Municipal Corporation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
