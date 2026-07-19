/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, History, X, AlertCircle } from 'lucide-react';
import { City } from '../types';

interface SearchHeaderProps {
  onSelectCity: (city: City) => void;
  currentCity: City | null;
}

const SEED_CITIES: City[] = [
  { id: 1850147, name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, country: 'Japan', country_code: 'JP', admin1: 'Tokyo' },
  { id: 5128581, name: 'New York', latitude: 40.7143, longitude: -74.006, country: 'United States', country_code: 'US', admin1: 'New York' },
  { id: 2988507, name: 'Paris', latitude: 48.8534, longitude: 2.3488, country: 'France', country_code: 'FR', admin1: 'Île-de-France' },
  { id: 2147714, name: 'Sydney', latitude: -33.8679, longitude: 151.2073, country: 'Australia', country_code: 'AU', admin1: 'New South Wales' }
];

export default function SearchHeader({ onSelectCity, currentCity }: SearchHeaderProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<City[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('weather_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse recent searches', e);
    }
  }, []);

  // Handle outside click to collapse dropdown list
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch geocoding recommendations when user types (debounced)
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setErrorText(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setErrorText(null);
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error('Geocoding network fetch failed');
        }
        
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setSuggestions(data.results);
        } else {
          setSuggestions([]);
          if (query.trim().length >= 3) {
            setErrorText('No geographical locations found with that name.');
          }
        }
      } catch (err) {
        console.error('Geocoding search failure', err);
        setErrorText('Connection error fetching geographic metadata.');
      } finally {
        setIsLoading(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle selection of a city
  const selectCity = (city: City) => {
    onSelectCity(city);
    setQuery('');
    setSuggestions([]);
    setIsFocused(false);

    // Save to recents log
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== city.id);
      const updated = [city, ...filtered].slice(0, 5);
      localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearQuery = () => {
    setQuery('');
    setSuggestions([]);
    setErrorText(null);
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('weather_recent_searches');
    setRecentSearches([]);
  };

  return (
    <div id="search-section" className="relative z-40 max-w-2xl mx-auto w-full mb-8">
      {/* Title block */}
      <div className="text-center mb-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2 drop-shadow-[0_2px_12px_rgba(255,255,255,0.05)]">
          <span>🌦️</span> Weather Intelligence
        </h1>
        <p className="text-sm text-white/60 mt-2 font-medium">
          WMO Condition Mapping, 7-Day Forecasting, and Rule-Based Suitability Advisor
        </p>
      </div>

      {/* Main Bar Search form container */}
      <div className="relative" ref={dropdownRef}>
        <div className={`relative flex items-center bg-white/10 backdrop-blur-xl border p-1 rounded-2xl shadow-2xl transition-all duration-300 ${isFocused ? 'border-sky-400/60 ring-4 ring-sky-500/10' : 'border-white/15'}`}>
          <div className="pl-3.5 text-white/50">
            <Search className="h-5 w-5" id="search-input-icon" />
          </div>
          
          <input
            id="city-search-input"
            type="text"
            className="w-full pl-2.5 pr-10 py-3 text-white text-sm placeholder-white/40 bg-transparent border-none outline-none font-medium focus:ring-0"
            placeholder="Search city (e.g. San Francisco, Tokyo, London...)"
            value={query}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Icon states in search bar */}
          <div className="absolute right-4 flex items-center gap-2">
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" id="loading-spinner">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : query ? (
              <button
                type="button"
                onClick={clearQuery}
                className="p-1 hover:bg-white/15 rounded-full text-white/60 hover:text-white transition cursor-pointer animate-fade-in"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Autocomplete dynamic floating overlay dropdown */}
        {isFocused && (suggestions.length > 0 || errorText || recentSearches.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2.5 bg-slate-950/85 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 py-3.5 max-h-[380px] overflow-y-auto z-50 text-white animate-fade-in">
            
            {/* Auto suggestions from API */}
            {suggestions.length > 0 && (
              <div className="px-2 pb-2">
                <span className="block px-3 text-[10px] font-mono tracking-wider text-white/40 uppercase font-bold mb-1.5">
                  Matching Locations found
                </span>
                <div className="space-y-0.5">
                  {suggestions.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => selectCity(item)}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 transition duration-150 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-sky-500/20 text-sky-205 rounded-lg border border-white/10">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-white block leading-tight">{item.name}</span>
                          <span className="text-[10.5px] text-white/60 block mt-0.5">
                            {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                          </span>
                        </div>
                      </div>
                      
                      {item.country_code && (
                        <span className="bg-white/10 text-sky-200 text-[10px] font-mono font-bold uppercase py-0.5 px-2 rounded-md border border-white/5">
                          {item.country_code}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error messaging inside autocomplete drop frame */}
            {errorText && (
              <div className="px-5 py-4 text-center text-white/70 text-xs flex flex-col items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-450" />
                <p className="font-medium leading-relaxed">{errorText}</p>
              </div>
            )}

            {/* Recent Searches Log Section */}
            {recentSearches.length > 0 && (
              <div className="border-t border-white/10 pt-2 px-2 mt-2">
                <div className="flex justify-between items-center px-3 mb-1">
                  <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase font-bold flex items-center gap-1">
                    <History className="h-3.5 w-3.5" />
                    Recent Searches
                  </span>
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-[10.5px] text-rose-400 hover:text-rose-305 font-bold cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="space-y-0.5">
                  {recentSearches.map((item) => (
                    <button
                      type="button"
                      key={`recent-${item.id}-${item.latitude}`}
                      onClick={() => selectCity(item)}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 transition duration-150 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-white/40" />
                        <div>
                          <span className="text-xs font-semibold text-white/90 leading-none">{item.name}</span>
                          <span className="text-[10.5px] text-white/50 block mt-0.5">
                            {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        )}
      </div>

      {/* Recommended Starter Locations Chips */}
      <div id="seed-location-chips" className="flex flex-wrap gap-2 items-center justify-center mt-4">
        <span className="text-xs font-medium text-white/50 flex items-center gap-1.5 mr-1">
          Explore Popular Areas:
        </span>
        {SEED_CITIES.map((city) => (
          <button
            type="button"
            key={city.id}
            onClick={() => onSelectCity(city)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
              currentCity?.id === city.id
                ? 'bg-sky-505/20 text-sky-200 border-sky-400 font-bold shadow-lg shadow-sky-500/10'
                : 'bg-white/5 hover:bg-white/12 text-white/80 hover:text-white border-white/10 hover:border-white/20'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
}
