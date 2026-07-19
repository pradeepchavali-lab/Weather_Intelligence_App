/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Footprints, 
  Bike, 
  Utensils, 
  Wind, 
  Sparkles, 
  Camera, 
  ChevronsRight, 
  CheckCircle,
  AlertTriangle,
  Flame,
  Info,
  Calendar,
  Layers,
  Heart,
  Droplets
} from 'lucide-react';
import { WeatherData, Activity, ActivityFeedback } from '../types';
import { DEFAULT_ACTIVITIES, calculateSuitability } from '../utils/weatherUtils';

interface PlanningAdvisorProps {
  weather: WeatherData;
}

// Activity icon renderer mapping names to SVG icons
function ActivityIcon({ name, className }: { name: string; className?: string }) {
  const props = { className: className || "h-5 w-5 text-indigo-600" };
  switch (name) {
    case 'Footprints': return <Footprints {...props} id="act-footprints" />;
    case 'Bike': return <Bike {...props} id="act-bike" />;
    case 'Utensils': return <Utensils {...props} id="act-utensils" />;
    case 'Wind': return <Wind {...props} id="act-wind" />;
    case 'Sparkles': return <Sparkles {...props} id="act-sparkles" />;
    case 'Camera': return <Camera {...props} id="act-camera" />;
    default: return <Layers {...props} id="act-layers" />;
  }
}

export default function PlanningAdvisor({ weather }: PlanningAdvisorProps) {
  const [selectedActivityId, setSelectedActivityId] = useState<string>('running');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const selectedActivity = useMemo(() => {
    return DEFAULT_ACTIVITIES.find(a => a.id === selectedActivityId) || DEFAULT_ACTIVITIES[0];
  }, [selectedActivityId]);

  // Feedbacks computed dynamically
  const currentFeedback = useMemo(() => {
    return calculateSuitability(selectedActivity, weather);
  }, [selectedActivity, weather]);

  // Best Day Optimization Scanner
  // Scans the 7-day weather forecast array and calculates which days are best suited for the selected task.
  const optimalWeekPlan = useMemo(() => {
    const list: { dateStr: string; score: 'excellent' | 'good' | 'fair' | 'poor'; scoreWeight: number; reason: string }[] = [];
    const daily = weather.daily;

    for (let i = 0; i < daily.time.length; i++) {
      // Simulate parameters for each day of the forecast to evaluate suitability
      const dayWeather: WeatherData = {
        ...weather,
        current: {
          time: daily.time[i],
          temperature_2m: daily.temperature_2m_max[i], // use high temperature as typical day value
          relative_humidity_2m: i === 0 ? weather.current.relative_humidity_2m : 55, // placeholder proxy for future humidity
          apparent_temperature: daily.apparent_temperature_max?.[i] ?? daily.temperature_2m_max[i],
          is_day: 1, // Assume daytime checking
          precipitation: daily.precipitation_sum?.[i] ?? 0,
          rain: daily.precipitation_sum?.[i] ?? 0,
          showers: 0,
          snowfall: 0,
          weather_code: daily.weather_code[i],
          cloud_cover: daily.weather_code[i] === 0 ? 5 : daily.weather_code[i] < 3 ? 35 : 85, // estimate cloud cover from code
          pressure_msl: 1013,
          wind_speed_10m: daily.wind_speed_10m_max?.[i] ?? 12,
          wind_direction_10m: 180,
        }
      };

      const evalResult = calculateSuitability(selectedActivity, dayWeather);
      
      let weight = 0;
      if (evalResult.score === 'excellent') weight = 4;
      else if (evalResult.score === 'good') weight = 3;
      else if (evalResult.score === 'fair') weight = 2;
      else weight = 1;

      list.push({
        dateStr: daily.time[i],
        score: evalResult.score,
        scoreWeight: weight,
        reason: evalResult.reason
      });
    }

    // Sort to locate highest matches
    const sorted = [...list].sort((a, b) => b.scoreWeight - a.scoreWeight);
    return {
      allDays: list,
      bestDay: sorted[0],
      secondaryOptions: sorted.slice(0, 3)
    };
  }, [selectedActivity, weather]);

  const filteredActivities = useMemo(() => {
    if (activeCategoryFilter === 'all') return DEFAULT_ACTIVITIES;
    return DEFAULT_ACTIVITIES.filter(a => a.category === activeCategoryFilter);
  }, [activeCategoryFilter]);

  const getScoreBadgeColor = (score: 'excellent' | 'good' | 'fair' | 'poor') => {
    switch (score) {
      case 'excellent':
        return 'bg-emerald-550 text-white shadow-emerald-100 border-emerald-600';
      case 'good':
        return 'bg-sky-500 text-white shadow-sky-100 border-sky-600';
      case 'fair':
        return 'bg-amber-500 text-white shadow-amber-100 border-amber-600';
      case 'poor':
        return 'bg-rose-500 text-white shadow-rose-100 border-rose-600';
    }
  };

  const getDayNameShort = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDateShort = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div id="advisor-block" className="bg-white/10 backdrop-blur-2xl rounded-[32px] p-6 shadow-2xl border border-white/20 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/15 pb-5 mb-5">
        <div>
          <h3 id="panel-advisor-title" className="font-display font-bold text-lg text-white flex items-center gap-2">
            <span>🧠</span> Intelligence Planning Advisor
          </h3>
          <p className="text-xs text-white/50 mt-1">
            Real-time suitability modeling and optimal scheduling suggestions.
          </p>
        </div>

        {/* Categories togglers */}
        <div className="flex flex-wrap gap-1.5 bg-white/10 border border-white/10 p-1.5 rounded-2xl w-full md:w-auto">
          {['all', 'fitness', 'household', 'leisure'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl capitalize transition-all duration-205 cursor-pointer ${
                activeCategoryFilter === cat
                  ? 'bg-white/20 text-white border border-white/15 shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Activities' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid containing activities selector list vs the selected activity diagnostic view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Activities List */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          <span className="text-[10px] font-mono tracking-wider uppercase text-white/40 font-bold block mb-1">
            Select Your Planned Task
          </span>
          <div className="space-y-2 max-h-[365px] overflow-y-auto pr-1">
            {filteredActivities.map((act) => {
              const isSelected = selectedActivityId === act.id;
              const feedback = calculateSuitability(act, weather);
              const scoreText = feedback.score;
              
              return (
                <button
                  type="button"
                  key={act.id}
                  onClick={() => setSelectedActivityId(act.id)}
                  className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between gap-3 border transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'border-sky-400/60 bg-white/15 shadow-xl' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-sky-500/20 text-sky-200 border border-white/15' : 'bg-white/5 text-white/75 border border-white/5'}`}>
                      <ActivityIcon name={act.iconName} className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white">{act.name}</span>
                      <span className="text-[11px] block text-white/50 line-clamp-1">{act.description}</span>
                    </div>
                  </div>

                  {/* Dot status score indicator */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      scoreText === 'excellent' ? 'bg-emerald-400' :
                      scoreText === 'good' ? 'bg-sky-400' :
                      scoreText === 'fair' ? 'bg-amber-400' : 'bg-rose-455'
                    }`} />
                    <span className="text-[11px] font-bold font-mono text-white/60 capitalize leading-none">{scoreText}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: intelligence Diagnosis */}
        <div className="lg:col-span-7 bg-white/5 border border-white/15 rounded-[32px] p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
              <div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-white/40 block font-bold">Suitability Diagnosis</span>
                <h4 className="text-xl font-extrabold font-display text-white mt-0.5">{selectedActivity.name}</h4>
              </div>

              {/* Score badge with nice shadow */}
              <div id="suitability-badge" className={`px-4 py-1.5 rounded-full font-sans font-bold text-xs select-none shadow-xl uppercase tracking-wider border ${getScoreBadgeColor(currentFeedback.score)}`}>
                {currentFeedback.score} Suitability
              </div>
            </div>

            {/* Assessment phrase */}
            <div id="criteria-explanation" className="bg-slate-950/40 rounded-2xl p-4 border border-white/10 shadow-2xl flex gap-3 items-start mb-6">
              <span className="text-xl">
                {currentFeedback.score === 'excellent' ? '✨' : 
                 currentFeedback.score === 'good' ? '👍' : 
                 currentFeedback.score === 'fair' ? '⚠️' : '❌'}
              </span>
              <div>
                <p className="text-sky-200/95 text-xs font-bold leading-relaxed">
                  {currentFeedback.reason}
                </p>
              </div>
            </div>

            {/* Weather rules parameters scorecard */}
            <div className="mb-6">
              <span className="text-[10px] font-mono tracking-wider uppercase text-white/40 font-bold block mb-2.5">
                Physical Constraint Checklist
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                
                {/* Temperature Checker */}
                <div className="bg-slate-950/25 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/60 block">Comfort Temp Limit</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">
                      {Math.round(weather.current.temperature_2m)}°C
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      Need: {selectedActivity.idealTempMin}-{selectedActivity.idealTempMax}°C
                    </span>
                  </div>
                </div>

                {/* Wind restriction */}
                <div className="bg-slate-950/25 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/60 block">Wind Velocity</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">
                      {weather.current.wind_speed_10m} km/h
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      Ideal: &lt; {selectedActivity.maxWindSpeed} km/h
                    </span>
                  </div>
                </div>

                {/* Precipitation restriction */}
                <div className="bg-slate-950/25 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/60 block">Precip Probability</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">
                      {weather.daily.precipitation_probability_max?.[0] ?? 0}%
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      Safer: &lt; {selectedActivity.maxPrecipProbability}%
                    </span>
                  </div>
                </div>

                {/* Active wet index */}
                <div className="bg-slate-950/25 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/60 block">Solar Requirement</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">
                      {weather.current.is_day === 1 ? 'Daylight Light' : 'Night Sky'}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      {selectedActivity.id === 'stargazing' ? 'Requires Night' : 'Sun Preferred'}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Calendar Optimization suggestion block */}
          <div className="border-t border-white/15 pt-4 mt-3">
            <span className="text-[10px] font-mono tracking-wider uppercase text-sky-300 font-bold block mb-2.5">
              📅 Best Day Scheduler Advisor
            </span>
            
            {optimalWeekPlan.bestDay.dateStr === weather.daily.time[0] && optimalWeekPlan.bestDay.scoreWeight >= 3 ? (
              <div className="bg-emerald-950/40 text-emerald-200 border border-emerald-550/30 rounded-2xl p-3.5 flex gap-3 items-center">
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                <p className="text-[11.5px] leading-normal font-bold">
                  <strong>Today is optimal!</strong> Our intelligence simulator reports today has the absolute best physical conditions for <strong>{selectedActivity.name}</strong> this week. Get out and enjoy!
                </p>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                <p className="text-[11.5px] leading-relaxed text-white/80 mb-2 font-medium">
                  Not feeling today's weather? Our scheduling engine scanned the forecast. The absolute premium day for <strong>{selectedActivity.name}</strong> is:
                </p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950/40 rounded-xl p-2.5 border border-white/10 shadow-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-white/10 border border-white/10 p-2 rounded-lg text-white flex flex-col items-center justify-center font-mono leading-none shrink-0 min-w-[50px]">
                      <span className="text-[10px] uppercase font-bold text-sky-305 mb-0.5">{getDayNameShort(optimalWeekPlan.bestDay.dateStr)}</span>
                      <span className="text-[11px] font-bold">{formatDateShort(optimalWeekPlan.bestDay.dateStr).split(' ')[1]}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white capitalize">
                        Rating: {optimalWeekPlan.bestDay.score} Conditions
                      </span>
                      <span className="block text-[10.5px] text-white/50 line-clamp-1">
                        {optimalWeekPlan.bestDay.reason}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-[11px] font-bold text-sky-200 bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg shrink-0 self-end sm:self-center">
                    Top Calendar Pick
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
