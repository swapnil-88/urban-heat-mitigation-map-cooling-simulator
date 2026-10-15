import React from "react";
import { ShieldCheck, MapPin, Phone, Mail, Globe, ExternalLink, Award, FileText } from "lucide-react";

export const GovernmentFooter: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 font-sans border-t border-slate-800 text-xs mt-12 print:hidden">
      {/* Indian National Tricolor Top Ribbon */}
      <div className="w-full h-1.5 flex">
        <div className="w-1/3 bg-[#FF9933] h-full" />
        <div className="w-1/3 bg-white h-full" />
        <div className="w-1/3 bg-[#138808] h-full" />
      </div>

      {/* Main Government Portal Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Government Authority & Seal */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center p-1.5 text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 block font-mono">
                  ગુજરાત સરકાર • Govt of Gujarat
                </span>
                <h3 className="font-bold text-sm text-white tracking-tight leading-tight">
                  Vadodara Municipal Corporation
                </h3>
                <span className="text-[11px] text-slate-400 block">
                  વડોદરા મહાનગરપાલિકા (VMC)
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Official Urban Heat Island (UHI) Mitigation, Tree Canopy Planning & Microclimate Decision Support System. Established under the Gujarat Urban Development & Urban Forestry Initiative.
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-mono bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/80 w-fit">
              <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>MoEF&amp;CC Urban Climate Framework Compliant</span>
            </div>
          </div>

          {/* Column 2: Government Portals & Initiatives */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white border-b border-slate-800 pb-1.5 font-mono">
              Related Government Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <a
                  href="https://vmc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition flex items-center justify-between"
                >
                  <span>Vadodara Municipal Corporation (VMC)</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://gujaratindia.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition flex items-center justify-between"
                >
                  <span>Government of Gujarat Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://smartcities.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition flex items-center justify-between"
                >
                  <span>Smart Cities Mission — Vadodara</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://moef.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition flex items-center justify-between"
                >
                  <span>Ministry of Environment, Forest &amp; Climate</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://digitalindia.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition flex items-center justify-between"
                >
                  <span>Digital India Geospatial Initiative</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Municipal Headquarters & Helpline */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white border-b border-slate-800 pb-1.5 font-mono">
              Municipal Office &amp; Helpdesk
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Mahanagar Seva Sadan, Khanderao Market Building, Rajmahal Road, Vadodara, Gujarat — 390001
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  VMC Toll-Free Helpline: <strong>1800-233-0266</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Control Room: (0265) 2420000 / 2420001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>climate-gis@vmc.gov.in</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono pt-1">
                Office Hours: Mon–Sat: 10:30 AM to 06:10 PM IST
              </div>
            </div>
          </div>

          {/* Column 4: Standards, Policies & Geospatial Verification */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white border-b border-slate-800 pb-1.5 font-mono">
              Standards &amp; Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-1.5">
                <FileText className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Hyperlinking &amp; Copyright Policy</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <FileText className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Data Privacy &amp; Terms of Use</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <FileText className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Accessibility Statement (WCAG 2.1 AA)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Geodetic Projection: WGS84 / EPSG:4326</span>
              </li>
            </ul>

            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="text-white font-semibold flex items-center justify-between">
                <span>VMC GIS Portal v3.8</span>
                <span className="text-emerald-400">Online</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Real-time meteorological &amp; aerodynamic thermodynamic modeling engine
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
          <div>
            <p>
              &copy; {new Date().getFullYear()} Vadodara Municipal Corporation, Government of Gujarat. All Rights Reserved.
            </p>
            <p className="text-slate-400 text-[10px] mt-0.5">
              Content Owned, Maintained and Updated by Vadodara Municipal Corporation (VMC).
            </p>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Security Audited</span>
            <span>&bull;</span>
            <span>Digital India</span>
            <span>&bull;</span>
            <span>NIC Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
