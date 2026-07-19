/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { City, WeatherData } from './types';
import SearchHeader from './components/SearchHeader';
import CurrentWeather from './components/CurrentWeather';
import Forecast7Day from './components/Forecast7Day';
import PlanningAdvisor from './components/PlanningAdvisor';
import { getWeatherAlerts } from './utils/weatherUtils';
import { AlertTriangle, RefreshCw, X, Heart, Sparkles, CloudRainWind } from 'lucide-react';

const DEFAULT_CITY: City = {
  id: 1850147,
  name: 'Tokyo',
  latitude: 35.6895,
  longitude: 139.6917,
  country: 'Japan',
  country_code: 'JP',
  admin1: 'Tokyo'
};

export default function App() {
  const [currentCity, setCurrentCity] = useState<City>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const fetchWeather = async (city: City) => {
    setIsLoading(true);
    setErrorText(null);
    setDismissedAlerts([]);
    try {
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
      
      const res = await fetch(forecastUrl);
      if (!res.ok) {
        throw new Error('Forecast fetch failure');
      }

      const data: WeatherData = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather data', err);
      setErrorText('Failed to pull live forecast telemetry. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial pull on start
  useEffect(() => {
    fetchWeather(currentCity);
  }, [currentCity]);

  // Compute active weather alerts
  const activeAlerts = React.useMemo(() => {
    if (!weatherData) return [];
    const rawAlerts = getWeatherAlerts(weatherData);
    return rawAlerts.filter(alert => !dismissedAlerts.includes(alert));
  }, [weatherData, dismissedAlerts]);

  const handleDismissAlert = (alertText: string) => {
    setDismissedAlerts(prev => [...prev, alertText]);
  };

  const handleRetry = () => {
    fetchWeather(currentCity);
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-955 text-white font-sans antialiased pb-16">
      
      {/* Outer elegant wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Header & Search Area */}
        <SearchHeader 
          currentCity={currentCity}
          onSelectCity={(city) => setCurrentCity(city)} 
        />

        {/* Global Loading overlay */}
        {isLoading && !weatherData ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4" id="main-loading-state">
            <div className="relative">
              <div className="h-14 w-14 border-4 border-white/20 border-t-sky-400 rounded-full animate-spin" />
              <CloudRainWind className="h-6 w-6 text-sky-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-white text-sm">Gathering Climate Intelligence...</p>
              <p className="text-xs text-white/60 mt-1">Downloading live WMO radar signals for {currentCity.name}</p>
            </div>
          </div>
        ) : errorText ? (
          
          /* Error recovery state screen */
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center my-12" id="main-error-state">
            <div className="p-4 bg-orange-500/20 text-orange-200 rounded-full inline-block mb-4">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="font-display font-semibold text-lg text-white">Weather Sync Delayed</h3>
            <p className="text-xs text-white/70 mt-2.5 leading-relaxed">{errorText}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-6 inline-flex items-center gap-2 bg-sky-505 hover:bg-sky-600 border border-white/15 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Attempt Telemetry Retry
            </button>
          </div>
        ) : weatherData ? (
          
          /* Loaded Dashboard container screen */
          <div className="space-y-6" id="dashboard-content-layer">
            
            {/* Warnings Advisory Board */}
            {activeAlerts.length > 0 && (
              <div className="space-y-2.5" id="alerts-container">
                {activeAlerts.map((alert) => (
                  <div 
                    key={alert} 
                    className="bg-amber-950/40 backdrop-blur-lg border border-amber-500/30 rounded-2xl p-4 flex justify-between items-start gap-4 shadow-xl"
                  >
                    <div className="flex gap-3 items-start text-amber-200">
                      <AlertTriangle className="h-5 w-5 text-amber-450 shrink-0 mt-0.5" />
                      <p className="text-[11.5px] leading-relaxed font-semibold">{alert}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleDismissAlert(alert)}
                      className="text-amber-450 hover:text-white p-0.5 hover:bg-white/10 rounded-lg shrink-0 transition cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Custom mini loader during minor background changes */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-[11px] font-semibold text-white/80 px-3.5 py-1.5 rounded-full w-max mx-auto shadow-sm border border-white/10">
                <svg className="animate-spin h-3.5 w-3.5 text-sky-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Syncing {currentCity.name}...
              </div>
            )}

            {/* Multi-grid high balanced column dashboard interface rules */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Diagnostics (Col span 7) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Current Weather Details Card */}
                <CurrentWeather 
                  weather={weatherData} 
                  city={currentCity} 
                />

                {/* 2. intelligence Suitability Checklist Selection */}
                <PlanningAdvisor 
                  weather={weatherData} 
                />

              </div>

              {/* Right Column: Extended forecast list (Col span 5) */}
              <div className="lg:col-span-5 h-full">
                <Forecast7Day 
                  weather={weatherData} 
                />
              </div>

            </div>

            {/* Core Footer section */}
            <footer className="text-center text-[11px] text-slate-400 mt-12 border-t border-slate-205 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="font-mono">
                Data generated via open-access Open-Meteo forecasts • Latitude: {currentCity.latitude}° • Longitude: {currentCity.longitude}°
              </p>
              <p className="flex items-center gap-1">
                <span>Weather Intelligence Client</span>
                <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                <span>2.0</span>
              </p>
            </footer>

          </div>
        ) : null}

      </div>
    </div>
  );
}
