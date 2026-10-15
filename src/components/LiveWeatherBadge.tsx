import React, { useEffect, useState } from "react";
import { Sun, Cloud, Thermometer, Wind, RefreshCw, Radio } from "lucide-react";

interface LiveWeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

interface LiveWeatherBadgeProps {
  onWeatherFetched?: (temp: number) => void;
}

export const LiveWeatherBadge: React.FC<LiveWeatherBadgeProps> = ({ onWeatherFetched }) => {
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchLiveWeather = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=22.3072&longitude=73.1812&current_weather=true"
      );
      if (!res.ok) throw new Error("Weather fetch failed");
      const data = await res.json();
      if (data?.current_weather) {
        const temp = data.current_weather.temperature;
        setWeather({
          temperature: temp,
          windspeed: data.current_weather.windspeed,
          weathercode: data.current_weather.weathercode,
          time: data.current_weather.time
        });
        if (onWeatherFetched) {
          onWeatherFetched(temp);
        }
      }
    } catch (err) {
      console.warn("Live weather fetch offline, using ambient fallback:", err);
      setError(true);
      if (onWeatherFetched) {
        onWeatherFetched(32.5);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather();
    const interval = setInterval(fetchLiveWeather, 300000); // refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-mono">
      <div className="flex items-center space-x-1.5 text-amber-600">
        <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
          Live Vadodara:
        </span>
      </div>

      {loading ? (
        <span className="text-slate-600 flex items-center space-x-1">
          <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
          <span>Fetching Live...</span>
        </span>
      ) : weather ? (
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-amber-700 flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            {weather.temperature}°C
          </span>
          <span className="text-slate-600 hidden sm:inline flex items-center gap-1">
            <Wind className="w-3 h-3 text-slate-500" />
            {weather.windspeed} km/h
          </span>
        </div>
      ) : (
        <span className="text-amber-700 font-semibold">32.5°C Ambient</span>
      )}
    </div>
  );
};
