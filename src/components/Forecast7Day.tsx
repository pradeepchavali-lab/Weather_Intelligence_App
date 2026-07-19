/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudSun, 
  CloudMoon, 
  CloudRain, 
  CloudRainWind, 
  CloudFog, 
  CloudDrizzle, 
  CloudLightning, 
  Zap, 
  Snowflake, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Droplet, 
  Wind, 
  SunDim,
  PartyPopper
} from 'lucide-react';
import { WeatherData } from '../types';
import { getWeatherCondition } from '../utils/weatherUtils';

interface Forecast7DayProps {
  weather: WeatherData;
}

// Map condition string to icon component dynamically
function WeatherIconMini({ name, className }: { name: string; className?: string }) {
  const props = { className: className || "h-6 w-6 text-slate-600" };
  switch (name) {
    case 'Sun': return <Sun {...props} id="mini-sun" />;
    case 'Moon': return <Moon {...props} id="mini-moon" />;
    case 'CloudSun': return <CloudSun {...props} id="mini-cloud-sun" />;
    case 'CloudMoon': return <CloudMoon {...props} id="mini-cloud-moon" />;
    case 'Cloud': return <Cloud {...props} id="mini-cloud" />;
    case 'CloudFog': return <CloudFog {...props} id="mini-cloud-fog" />;
    case 'CloudDrizzle': return <CloudDrizzle {...props} id="mini-cloud-drizzle" />;
    case 'CloudRain': return <CloudRain {...props} id="mini-cloud-rain" />;
    case 'CloudRainWind': return <CloudRainWind {...props} id="mini-cloud-rain-wind" />;
    case 'CloudLightning': return <CloudLightning {...props} id="mini-cloud-lightning" />;
    case 'Zap': return <Zap {...props} id="mini-zap" />;
    case 'Snowflake': return <Snowflake {...props} id="mini-snowflake" />;
    default: return <Cloud {...props} id="mini-default" />;
  }
}

export default function Forecast7Day({ weather }: Forecast7DayProps) {
  const daily = weather.daily;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // First day open by default

  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPlanningAdvice = (
    maxTemp: number, 
    minTemp: number, 
    code: number, 
    precipProb: number,
    windMax: number
  ) => {
    if (precipProb > 50) {
      return 'High likelihood of rain today. Emphasize indoor schedules and keep dry clothing handy.';
    }
    if (maxTemp > 32) {
      return 'Heat peak midday. Plan hydration breaks and schedule jogging/exercise early evening or dawn.';
    }
    if (minTemp < 4) {
      return 'Freezing temperatures. Frost hazard early morning; bundle up with thick outer layers.';
    }
    if (windMax > 30) {
      return 'Brisk head winds. Uncomfortable for cycling or light umbrella systems. Secure loose belongings.';
    }
    if (precipProb < 15 && maxTemp >= 18 && maxTemp <= 27) {
      return 'Spectacular outdoor window! Splendid atmosphere for driving, sports, or family picnics.';
    }
    return 'Comfortable meteorological atmosphere. Recommended for standard commute and day planning.';
  };

  return (
    <div id="forecast-block" className="bg-white/10 backdrop-blur-2xl rounded-[32px] p-6 shadow-2xl border border-white/20 flex flex-col h-full text-white">
      <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/15">
        <Calendar className="h-5 w-5 text-white/60" id="forecast-calendar-icon" />
        <h3 id="forecast-panel-title" className="font-display font-bold text-lg text-white">
          7-Day Intelligent Forecast
        </h3>
      </div>

      <div className="space-y-2 flex-grow overflow-y-auto pr-1">
        {daily.time.map((time, index) => {
          const isExpanded = expandedIndex === index;
          const code = daily.weather_code[index];
          const maxTemp = daily.temperature_2m_max[index];
          const minTemp = daily.temperature_2m_min[index];
          const precipProb = daily.precipitation_probability_max?.[index] ?? 0;
          const windMax = daily.wind_speed_10m_max?.[index] ?? 0;
          const uvMax = daily.uv_index_max?.[index] ?? 0;
          const condition = getWeatherCondition(code, 1);

          return (
            <div 
              key={time}
              className={`rounded-2xl border transition-all duration-300 ${
                isExpanded 
                  ? 'border-white/20 bg-white/15 shadow-xl' 
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              {/* Summary Header of Day Card */}
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="w-full text-left p-4 flex items-center justify-between gap-4 cursor-pointer"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3.5">
                  <div className="bg-white/10 p-2 rounded-xl flex items-center justify-center shrink-0 border border-white/5">
                    <WeatherIconMini name={condition.iconName} className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="block font-bold text-white leading-tight">
                      {getDayName(time)}
                    </span>
                    <span className="text-xs font-mono text-white/50">
                      {formatDate(time)}
                    </span>
                  </div>
                </div>

                {/* Status elements badge */}
                <div className="flex items-center gap-4 text-right">
                  {/* Rain Prob */}
                  {precipProb > 15 ? (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-sky-200 bg-sky-500/20 px-2 py-1 rounded-full font-bold border border-white/10">
                      <Droplet className="h-3.5 w-3.5" />
                      {precipProb}%
                    </span>
                  ) : null}

                  {/* Temp High / Low */}
                  <div className="flex items-baseline gap-1.5 min-w-[70px] justify-end">
                    <span className="font-bold text-white text-sm">
                      {Math.round(maxTemp)}°
                    </span>
                    <span className="text-white/50 text-xs">
                      {Math.round(minTemp)}°
                    </span>
                  </div>

                  {/* Arrow toggler */}
                  <div className="text-white/60">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Collapsible Details Body */}
              {isExpanded ? (
                <div className="px-4 pb-4.5 pt-1.5 border-t border-white/10 text-xs text-white/80 grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-950/45 rounded-xl p-2.5 border border-white/5 flex flex-col justify-center">
                      <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-wider block mb-0.5 font-bold">Rain Risk</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <Droplet className="h-3 w-3 text-sky-305" />
                        {precipProb}%
                      </span>
                    </div>

                    <div className="bg-slate-950/45 rounded-xl p-2.5 border border-white/5 flex flex-col justify-center">
                      <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-wider block mb-0.5 font-bold">Wind gust</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <Wind className="h-3 w-3 text-teal-300" />
                        {Math.round(windMax)} <span className="text-[9px] font-normal text-white/50">km/h</span>
                      </span>
                    </div>

                    <div className="bg-slate-950/45 rounded-xl p-2.5 border border-white/5 flex flex-col justify-center">
                      <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-wider block mb-0.5 font-bold">UV Peak</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <SunDim className="h-3 w-3 text-amber-250 animate-pulse" />
                        {uvMax.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Detailed summary of the day's meteorological state */}
                  <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10">
                    <p className="font-bold text-sky-300 mb-1 flex items-center gap-1.5 text-xs">
                      <span>💡</span> Weather Intelligence Recommendation:
                    </p>
                    <p className="leading-relaxed text-white/90 text-xs">
                      {getPlanningAdvice(maxTemp, minTemp, code, precipProb, windMax)}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
