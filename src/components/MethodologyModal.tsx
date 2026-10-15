import React, { useState } from "react";
import { X, BookOpen, Calculator, Leaf, CheckCircle2, Layers, HelpCircle } from "lucide-react";
import { SPECIES_CATALOG } from "../data/vadodaraData";

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<"equations" | "botany" | "boundary" | "faq">("equations");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full text-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                Technical Specification
              </span>
              <span className="text-xs text-slate-500 font-mono">
                ENVI-met & Oke (1982) Microclimate Heat Transfer Framework
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Thermodynamic Modeling & Climate Physics Methodology
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 px-6 pt-3 border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab("equations")}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === "equations"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Mathematical Model</span>
          </button>
          <button
            onClick={() => setActiveTab("botany")}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === "botany"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>Botanical Trait Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab("boundary")}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === "boundary"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Boundary Conditions</span>
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === "faq"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Engineering Principles & FAQ</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          {/* TAB 1: MATHEMATICAL & THERMODYNAMIC EQUATIONS */}
          {activeTab === "equations" && (
            <div className="space-y-5">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                    1. Ambient Air Temperature Reduction Equation (&Delta;T_air)
                  </span>
                  <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Atmospheric Heat Balance
                  </span>
                </div>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                  &Delta;T_air = min(5.5, [ (N_trees &times; A_canopy &times; LAI) / A_zone ] &times; &eta;_transpiration &times; C_solar)
                </div>
                <div className="text-xs text-slate-600 space-y-1 leading-relaxed">
                  <p>Where:</p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    <li><strong>N_trees</strong>: Quantity of active planted specimens.</li>
                    <li><strong>A_canopy</strong>: Projected horizontal crown area per tree (m&sup2;).</li>
                    <li><strong>LAI</strong>: Dimensionless Leaf Area Index (total leaf surface area per unit ground area).</li>
                    <li><strong>A_zone</strong>: Total municipal ward surface area (m&sup2;).</li>
                    <li><strong>&eta;_transpiration</strong>: Species-specific latent heat flux cooling coefficient.</li>
                    <li><strong>C_solar</strong>: Diurnal solar zenith and solar radiation intensity factor.</li>
                  </ul>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                    2. Surface Radiant Temperature Reduction (&Delta;T_surface)
                  </span>
                  <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Beer-Lambert Canopy Attenuation
                  </span>
                </div>
                <div className="bg-slate-900 text-amber-300 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                  &Delta;T_surface = &Delta;T_air &times; 2.2 &times; (1 - e^(-k &times; LAI)) &times; (ImperviousPct / 100)
                </div>
                <div className="text-xs text-slate-600 space-y-1 leading-relaxed">
                  <p>
                    Surface temperature drops faster than ambient air because dense foliage intercepts direct solar beam irradiance (~900 W/m&sup2;), eliminating radiant heating of high-thermal-mass asphalt and concrete pavements.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                    3. Bioclimatic Heat Index (Rothfusz Formulation)
                  </span>
                  <span className="text-[11px] font-mono text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Apparent Thermal Comfort
                  </span>
                </div>
                <div className="bg-slate-900 text-indigo-300 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                  HI = -42.379 + 2.04901523&times;T + 10.14333127&times;R - 0.22475541&times;T&times;R - 0.00683783&times;T&sup2; - 0.05481717&times;R&sup2; ...
                </div>
                <p className="text-xs text-slate-600">
                  Calibrates human physiological comfort based on dry-bulb temperature (T) and relative humidity (R), classifying heat stress into <em>Safe</em>, <em>Caution</em>, <em>Extreme Caution</em>, and <em>Danger</em>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: BOTANICAL TRAIT MATRIX */}
          {activeTab === "botany" && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left font-mono">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-bold">Species</th>
                      <th className="p-3 font-bold">Botanical Taxon</th>
                      <th className="p-3 font-bold">Canopy (m&sup2;)</th>
                      <th className="p-3 font-bold">LAI</th>
                      <th className="p-3 font-bold">Transpiration</th>
                      <th className="p-3 font-bold">CO2 Offset</th>
                      <th className="p-3 font-bold">Water Req</th>
                      <th className="p-3 font-bold">Shade Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {SPECIES_CATALOG.map((sp) => (
                      <tr key={sp.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900 font-sans">{sp.name}</td>
                        <td className="p-3 text-slate-600 italic font-sans">{sp.scientificName}</td>
                        <td className="p-3 tabular-nums">{sp.canopyArea} m&sup2;</td>
                        <td className="p-3 font-bold text-emerald-700 tabular-nums">{sp.lai}</td>
                        <td className="p-3 tabular-nums">{sp.transpirationRate} L/hr</td>
                        <td className="p-3 tabular-nums">{sp.co2SequestrationKgYr} kg/yr</td>
                        <td className="p-3 tabular-nums">{sp.waterReqLitersDay} L/d</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            {Math.round(sp.shadeEfficiency * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 space-y-1">
                <div className="font-bold">Species Optimization Insights:</div>
                <p className="leading-relaxed">
                  <strong>Neem (Azadirachta indica)</strong> delivers an optimal balance of drought tolerance (low municipal irrigation needs) and rapid canopy establishment in semi-arid western Indian climates. <strong>Banyan (Ficus benghalensis)</strong> provides maximum absolute cooling and shade footprint (120 m&sup2; canopy, LAI 4.8) ideal for public parks and wide arterial boulevards.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: BOUNDARY CONDITIONS */}
          {activeTab === "boundary" && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Model Assumptions & Boundary Conditions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Atmospheric Canopy Layer (Oke 1982)</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Air temperature calculations assume a well-mixed urban canopy layer (z &le; 10m) with an average horizontal advection wind speed of 1.8 m/s, calibrated to Gujarat meteorological summer observations.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Diurnal Solar Angle Factor</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    At 12 PM solar altitude is near zenith (85&deg;), maximizing downward irradiance. At 3 PM, peak sensible air temperature occurs (+15% evapotranspiration efficiency). At 7 PM, pavement re-radiation dominates.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Impervious Surface Fraction</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Sectors with dense paving (Makarpura GIDC at 88%, Mandvi at 92%) retain significant thermal mass in asphalt and concrete, creating severe baseline anomalies up to 52&deg;C surface temperature.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Thermodynamic Saturation Cap</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    To maintain thermodynamic validity, the engine enforces an empirical asymptotic cooling ceiling of 5.5&deg;C maximum achievable air temperature reduction per urban ward, preventing unrealistic infinite cooling.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ENGINEERING PRINCIPLES & FAQ */}
          {activeTab === "faq" && (
            <div className="space-y-3.5 text-xs">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">
                  Why is surface temperature drop (&Delta;T_surface) higher than air temperature drop (&Delta;T_air)?
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Air is a mobile fluid characterized by turbulent advective mixing, convection, and low volumetric heat capacity. Urban ground surfaces (asphalt roads, bitumen, concrete) directly absorb direct shortwave solar radiation (~800–1000 W/m&sup2;). Intercepting this radiation with tree crowns prevents ground absorption, causing immediate 5&deg;C to 12&deg;C surface drops, whereas ambient air cools more gradually through evapotranspiration.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">
                  What does Leaf Area Index (LAI) measure and how does it drive cooling?
                </div>
                <p className="text-slate-600 leading-relaxed">
                  LAI is the dimensionless ratio of total upper leaf surface area to projected ground area. A tree species with an LAI of 4.5 (such as mature Neem or Banyan) provides 4.5 m&sup2; of active photosynthetic surface per 1 m&sup2; of shaded ground, significantly enhancing both optical shading density and stomatal transpiration flux.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">
                  How are the baseline thermal datasets calibrated?
                </div>
                <p className="text-slate-600 leading-relaxed">
                  The platform supports two baseline modes: (1) Historical peak summer heatwave baselines calibrated against high-resolution Landsat/MODIS thermal infrared radiometry across Vadodara municipal wards, and (2) Real-time meteorological telemetry synchronized with atmospheric feeds and adjusted with sector-specific microclimate offsets.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">
                  How does arboricultural maturation factor into municipal planning?
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Young saplings at Year 2 establish root architecture but provide only ~20% of mature crown spread. By Year 10–15, crown spread reaches maturity, achieving full calculated microclimate cooling benefits. This supports multi-year urban forestry budget planning rather than single-season planting drives.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Vadodara Municipal Corporation &bull; Urban Climate & Geospatial Engineering</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-sans font-medium transition shadow-xs"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
