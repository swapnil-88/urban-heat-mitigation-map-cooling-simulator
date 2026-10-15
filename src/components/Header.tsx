import React from "react";
import { ShieldCheck, Download, Calculator, BarChart3, Map } from "lucide-react";

interface HeaderProps {
  onOpenReport: () => void;
  onOpenMethodology: () => void;
  onScrollToMatrix: () => void;
  onScrollToSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenReport,
  onOpenMethodology,
  onScrollToMatrix,
  onScrollToSimulator
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-[1100] text-slate-900 shadow-2xs font-sans">
      {/* Official Government of Gujarat Top Ribbon (National Tricolor) */}
      <div className="w-full h-1 flex">
        <div className="w-1/3 bg-[#FF9933] h-full" />
        <div className="w-1/3 bg-white h-full" />
        <div className="w-1/3 bg-[#138808] h-full" />
      </div>

      {/* Official Government Top Micro-Bar */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-4 lg:px-8 py-1 text-[11px] font-mono text-slate-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">ગુજરાત સરકાર</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">Government of Gujarat</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-slate-500">
            <span>Vadodara Municipal Corporation (VMC)</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-800 font-semibold">Urban Forestry &amp; Climate Cell</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Authority Emblem & Title */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-800 border border-emerald-900 flex items-center justify-center text-white shadow-xs shrink-0">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-baseline space-x-2">
              <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
                Vadodara Urban Heat Simulator
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                VMC-GIS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none">
              Urban Heat Island (UHI) Mitigation &amp; Tree Canopy Decision Portal
            </p>
          </div>
        </div>

        {/* Minimal Government Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
          <button
            onClick={onScrollToSimulator}
            className="hover:text-emerald-800 transition flex items-center space-x-1.5 cursor-pointer py-1"
          >
            <Map className="w-3.5 h-3.5 text-slate-400" />
            <span>GIS Map</span>
          </button>
          <button
            onClick={onScrollToMatrix}
            className="hover:text-emerald-800 transition flex items-center space-x-1.5 cursor-pointer py-1"
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
            <span>Ward Heat Matrix</span>
          </button>
          <button
            onClick={onOpenMethodology}
            className="hover:text-emerald-800 transition flex items-center space-x-1.5 cursor-pointer py-1"
          >
            <Calculator className="w-3.5 h-3.5 text-slate-400" />
            <span>Methodology</span>
          </button>
        </nav>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenMethodology}
            className="md:hidden flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Methodology</span>
          </button>
          <button
            onClick={onOpenReport}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
            title="Download Municipal Microclimate Assessment Report (PDF)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report (PDF)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
