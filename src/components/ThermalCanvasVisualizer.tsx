import React, { useRef, useEffect, useState } from "react";
import { ZoneData, CoolingResult, TreeSpecies, SimulationParams } from "../types";
import { Eye, Flame, RefreshCcw, Sparkles, Activity } from "lucide-react";

interface ThermalCanvasVisualizerProps {
  zone: ZoneData;
  coolingResult: CoolingResult;
  species: TreeSpecies;
  params: SimulationParams;
}

export const ThermalCanvasVisualizer: React.FC<ThermalCanvasVisualizerProps> = ({
  zone,
  coolingResult,
  species,
  params
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; temp: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const width = canvas.width;
    const height = canvas.height;

    // Generate deterministic heat plume nodes for the selected zone
    const numPlumes = 12;
    const plumes: Array<{ x: number; y: number; baseHeat: number; radius: number }> = [];
    for (let i = 0; i < numPlumes; i++) {
      plumes.push({
        x: (0.15 + (i * 0.071) % 0.7) * width,
        y: (0.2 + (i * 0.113) % 0.6) * height,
        baseHeat: zone.baseTempSurface + (i % 3) * 1.5,
        radius: 40 + (i % 4) * 15
      });
    }

    // Generate tree cooling sink locations based on tree count
    const numTreeSinks = Math.min(Math.max(Math.floor(params.treeCount / 120), 4), 35);
    const treeSinks: Array<{ x: number; y: number; coolRadius: number }> = [];
    for (let j = 0; j < numTreeSinks; j++) {
      treeSinks.push({
        x: (0.2 + (j * 0.137) % 0.6) * width,
        y: (0.18 + (j * 0.091) % 0.64) * height,
        coolRadius: 25 + (params.treeCount / 5000) * 35
      });
    }

    const renderFrame = () => {
      tick += 0.02;

      // 1. Dark thermal infrared background
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, width, height);

      // 2. Render Zone Heat Surface Gradient (Infrared Thermal IR Map)
      const heatGrad = ctx.createRadialGradient(
        width / 2, height / 2, 10,
        width / 2, height / 2, width * 0.6
      );

      // Color mapping based on baseline temperature
      if (zone.baseTempSurface > 50) {
        heatGrad.addColorStop(0, "rgba(239, 68, 68, 0.85)"); // Severe Red
        heatGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.6)"); // Amber
        heatGrad.addColorStop(1, "rgba(15, 23, 42, 0.9)");
      } else {
        heatGrad.addColorStop(0, "rgba(245, 158, 11, 0.8)"); // Amber
        heatGrad.addColorStop(0.6, "rgba(234, 179, 8, 0.4)");
        heatGrad.addColorStop(1, "rgba(15, 23, 42, 0.9)");
      }

      ctx.fillStyle = heatGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Urban Hotspot Heat Plumes
      plumes.forEach((p, idx) => {
        const pulse = Math.sin(tick + idx) * 5;
        const grad = ctx.createRadialGradient(
          p.x, p.y, 2,
          p.x, p.y, p.radius + pulse
        );
        grad.addColorStop(0, "rgba(255, 255, 255, 0.9)"); // White hot core
        grad.addColorStop(0.3, "rgba(239, 68, 68, 0.7)"); // Intense Red
        grad.addColorStop(0.7, "rgba(245, 158, 11, 0.3)"); // Amber outer plume
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Render Digital Tree Canopy Cooling Sinks (Cyan / Emerald Pulsing Waves)
      treeSinks.forEach((sink, sIdx) => {
        const coolPulse = Math.sin(tick * 1.5 + sIdx) * 6;
        const sinkGrad = ctx.createRadialGradient(
          sink.x, sink.y, 2,
          sink.x, sink.y, sink.coolRadius + coolPulse
        );

        // Transition towards vibrant emerald cooling sinks as cooling increases
        sinkGrad.addColorStop(0, "rgba(16, 185, 129, 0.9)"); // Emerald core
        sinkGrad.addColorStop(0.4, "rgba(56, 189, 248, 0.6)"); // Cyan air cooling
        sinkGrad.addColorStop(0.8, "rgba(6, 182, 212, 0.2)");
        sinkGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = sinkGrad;
        ctx.beginPath();
        ctx.arc(sink.x, sink.y, sink.coolRadius + coolPulse, 0, Math.PI * 2);
        ctx.fill();

        // Draw canopy perimeter ring
        ctx.strokeStyle = "rgba(52, 211, 153, 0.5)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(sink.x, sink.y, sink.coolRadius * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 5. Grid Overlay (Thermal GIS Reticle)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 6. Draw Zone Boundary Contour
      ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
      ctx.lineWidth = 2;
      ctx.strokeRect(15, 15, width - 30, height - 30);

      // Watermark Text
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "10px monospace";
      ctx.fillText(`THERMAL IR MATRIX: ${zone.shortName.toUpperCase()}`, 25, 32);
      ctx.fillText(`TREE SINK CANOPY FACTOR: ${(params.treeCount / 5000).toFixed(2)}x`, 25, 46);

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [zone, coolingResult, species, params]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Estimate local surface temp based on distance from canvas center and cooling delta
    const distFromCenter = Math.sqrt(Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2));
    const normalizedDist = Math.min(distFromCenter / (canvas.width / 2), 1.0);
    const estimatedLocalTemp = zone.baseTempSurface - (coolingResult.deltaTSurface * (1 - normalizedDist * 0.3));

    setHoverCoord({ x, y, temp: Number(estimatedLocalTemp.toFixed(1)) });
  };

  const handleMouseLeave = () => {
    setHoverCoord(null);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-sky-100 border border-sky-200 rounded-lg text-sky-800">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              IR Thermal Plume Shader Matrix
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">Live Microclimate Heat Plumes & Tree Canopy Cooling Sinks</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-mono">
          <span className="flex items-center space-x-1 text-red-600">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Heat Plumes</span>
          </span>
          <span className="flex items-center space-x-1 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Tree Sinks</span>
          </span>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={560}
          height={260}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-auto block"
        />

        {/* Hover Crosshair Inspector Tooltip */}
        {hoverCoord && (
          <div
            className="absolute z-20 pointer-events-none bg-white/95 border border-slate-200 text-slate-900 p-2 rounded-lg text-[10px] font-mono shadow-md space-y-0.5"
            style={{ left: Math.min(hoverCoord.x + 12, 380), top: Math.min(hoverCoord.y + 12, 180) }}
          >
            <div className="text-emerald-800 font-bold">Inspect Pixel ({Math.round(hoverCoord.x)}, {Math.round(hoverCoord.y)})</div>
            <div>Surface Temp: <strong className="text-amber-700">{hoverCoord.temp}°C</strong></div>
            <div>Air Delta (&Delta;T_air): <strong className="text-emerald-700">-{coolingResult.deltaTAir}°C</strong></div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
        <span>Hover over visualizer to inspect local pixel microclimate temperatures</span>
        <span className="text-emerald-800 font-bold">{params.treeCount} Canopy Sinks Active</span>
      </div>
    </div>
  );
};
