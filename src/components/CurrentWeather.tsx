/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
  Wind, 
  Droplet, 
  Gauge, 
  Compass, 
  MapPin, 
  SunDim,
  Activity
} from 'lucide-react';
import { WeatherData, City } from '../types';
import { getWeatherCondition } from '../utils/weatherUtils';

interface CurrentWeatherProps {
  weather: WeatherData;
  city: City;
}

// Named mapper to dynamically assign correct Lucide icon elements
function WeatherIcon({ name, className }: { name: string; className?: string }) {
  const props = { className: className || "h-12 w-12 text-slate-800" };
  switch (name) {
    case 'Sun': return <Sun {...props} id="icon-sun" />;
    case 'Moon': return <Moon {...props} id="icon-moon" />;
    case 'CloudSun': return <CloudSun {...props} id="icon-cloud-sun" />;
    case 'CloudMoon': return <CloudMoon {...props} id="icon-cloud-moon" />;
    case 'Cloud': return <Cloud {...props} id="icon-cloud" />;
    case 'CloudFog': return <CloudFog {...props} id="icon-cloud-fog" />;
    case 'CloudDrizzle': return <CloudDrizzle {...props} id="icon-cloud-drizzle" />;
    case 'CloudRain': return <CloudRain {...props} id="icon-cloud-rain" />;
    case 'CloudRainWind': return <CloudRainWind {...props} id="icon-cloud-rain-wind" />;
    case 'CloudLightning': return <CloudLightning {...props} id="icon-cloud-lightning" />;
    case 'Zap': return <Zap {...props} id="icon-zap" />;
    case 'Snowflake': return <Snowflake {...props} id="icon-snowflake" />;
    default: return <Cloud {...props} id="icon-default-cloud" />;
  }
}

export default function CurrentWeather({ weather, city }: CurrentWeatherProps) {
  const current = weather.current;
  const condition = getWeatherCondition(current.weather_code, current.is_day);
  const tempMax = weather.daily.temperature_2m_max[0];
  const tempMin = weather.daily.temperature_2m_min[0];
  const uvIndex = weather.daily.uv_index_max?.[0] ?? 0;

  // Convert wind direction to points
  const getWindDirectionLabel = (deg: number) => {
    const sectors = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return sectors[Math.round(deg / 45) % 8];
  };

  return (
    <div 
      id="current-weather-card"
      className={`relative overflow-hidden rounded-[32px] p-6 md:p-8 shadow-2xl transition-all duration-700 bg-gradient-to-br ${condition.bgGradient} backdrop-blur-2xl border border-white/20 text-white`}
    >
      {/* Abstract Blur blobs for glowing overlay */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header section with city and state name */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/15 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <MapPin className="h-5 w-5 text-white/80 shrink-0" id="current-location-pin" />
            <h2 id="current-city-title" className="font-display text-2xl font-bold tracking-tight">
              {city.name}
            </h2>
          </div>
          <p id="current-region-text" className="text-xs text-white/70 font-semibold tracking-wide uppercase font-mono">
            {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-md border border-white/10 rounded-full px-4.5 py-2 text-[11px] font-mono font-bold tracking-wider">
          LOCAL SYNC: {new Date(current.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Core Numbers - Temperature and Condition Description */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex items-center gap-6">
          <div className="bg-white/20 backdrop-blur-xl p-5 rounded-[24px] border border-white/25 shadow-2xl flex items-center justify-center">
            <WeatherIcon name={condition.iconName} className="h-16 w-16 text-white drop-shadow-[0_4px_12px_rgba(255,255,255,0.4)]" />
          </div>
          <div>
            <div className="flex items-start">
              <span id="current-temp" className="font-display text-6xl md:text-7xl font-extrabold tracking-tighter leading-none select-none drop-shadow-sm">
                {Math.round(current.temperature_2m)}
              </span>
              <span className="text-3xl font-bold pt-1">°C</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p id="current-condition-label" className="font-sans font-bold text-lg text-white">
                {condition.label}
              </p>
              <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
              <p className="text-xs text-white/80 font-medium">
                Feels like {Math.round(current.apparent_temperature)}°C
              </p>
            </div>
          </div>
        </div>

        {/* Extended highlights */}
        <div className="bg-white/10 backdrop-blur-lg rounded-[24px] p-5 border border-white/15 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/50 font-mono tracking-wider uppercase mb-1 font-bold">Today's Range</span>
            <span className="text-lg font-bold tracking-tight">
              {Math.round(tempMin)}°C to {Math.round(tempMax)}°C
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/50 font-mono tracking-wider uppercase mb-1 font-bold">UV Intensity</span>
            <span className="text-lg font-bold tracking-tight flex items-center gap-1.5">
              <SunDim className="h-4 w-4 text-amber-250 animate-pulse" />
              {uvIndex.toFixed(1)} <span className="text-xs font-normal text-white/70">({uvIndex > 6 ? 'High' : uvIndex > 3 ? 'Mod' : 'Low'})</span>
            </span>
          </div>
          <div className="flex flex-col col-span-2 border-t border-white/10 pt-2.5 mt-1">
            <span className="text-xs text-white/85 italic font-medium leading-relaxed">
              "{condition.description}"
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Meteorological Attributes */}
      <div id="weather-attributes-grid" className="relative grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 border-t border-white/15 pt-6">
        {/* Humidity */}
        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-xl transition duration-300 rounded-2xl p-4 border border-white/10 flex items-center gap-3 shadow-lg">
          <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-105 border border-white/10">
            <Droplet className="h-5 w-5" id="humidity-icon" />
          </div>
          <div>
            <span className="block text-[10px] font-mono text-white/50 uppercase font-bold">Humidity</span>
            <span className="text-base font-bold">{current.relative_humidity_2m}%</span>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-xl transition duration-300 rounded-2xl p-4 border border-white/10 flex items-center gap-3 shadow-lg">
          <div className="p-2.5 bg-sky-500/20 rounded-xl text-sky-105 border border-white/10">
            <Wind className="h-5 w-5" id="wind-icon" />
          </div>
          <div>
            <span className="block text-[10px] font-mono text-white/50 uppercase font-bold">Wind</span>
            <span className="text-base font-bold">{current.wind_speed_10m} km/h</span>
            <span className="block text-[9.5px] font-mono text-white/60">Dir: {current.wind_direction_10m}° {getWindDirectionLabel(current.wind_direction_10m)}</span>
          </div>
        </div>

        {/* Atmospheric Pressure */}
        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-xl transition duration-300 rounded-2xl p-4 border border-white/10 flex items-center gap-3 shadow-lg">
          <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-105 border border-white/10">
            <Gauge className="h-5 w-5" id="pressure-icon" />
          </div>
          <div>
            <span className="block text-[10px] font-mono text-white/50 uppercase font-bold">Barometer</span>
            <span className="text-base font-bold">{current.pressure_msl} hPa</span>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-xl transition duration-300 rounded-2xl p-4 border border-white/10 flex items-center gap-3 shadow-lg">
          <div className="p-2.5 bg-gray-500/25 rounded-xl text-slate-105 border border-white/10">
            <Cloud className="h-5 w-5" id="clouds-icon" />
          </div>
          <div>
            <span className="block text-[10px] font-mono text-white/50 uppercase font-bold">Cloud Cover</span>
            <span className="text-base font-bold">{current.cloud_cover}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
