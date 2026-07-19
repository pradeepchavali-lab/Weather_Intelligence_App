/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, ActivityFeedback, WeatherConditionInfo, WeatherData } from '../types';

/**
 * Translates WMO weather codes into rich descriptive metadata, gradients, and icon keys.
 */
export function getWeatherCondition(code: number, isDay: number = 1): WeatherConditionInfo {
  // WMO Weather interpretation codes
  switch (code) {
    case 0: // Clear sky
      return {
        label: 'Clear Sky',
        description: isDay ? 'Sun-drenched skylines, ideal for outdoor engagement.' : 'Crisp, crystal clear stellar canopy.',
        iconName: isDay ? 'Sun' : 'Moon',
        bgGradient: isDay 
          ? 'from-amber-400 via-orange-400 to-sky-500' 
          : 'from-slate-950 via-slate-900 to-indigo-950',
        textColor: isDay ? 'text-slate-900' : 'text-slate-100',
        cardBg: isDay ? 'bg-white/80' : 'bg-slate-900/85',
      };

    case 1: // Mainly clear
    case 2: // Partly cloudy
      return {
        label: code === 1 ? 'Mainly Clear' : 'Partly Cloudy',
        description: 'Ample sunshine punctuated by high-altitude clouds.',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        bgGradient: isDay 
          ? 'from-sky-400 via-blue-400 to-indigo-500' 
          : 'from-slate-900 via-indigo-950 to-slate-950',
        textColor: isDay ? 'text-slate-900' : 'text-slate-100',
        cardBg: isDay ? 'bg-white/80' : 'bg-slate-900/85',
      };

    case 3: // Overcast
      return {
        label: 'Overcast',
        description: 'Complete cloud blanket. Ambient lighting is flat and cool.',
        iconName: 'Cloud',
        bgGradient: isDay 
          ? 'from-sky-300 via-slate-300 to-slate-400' 
          : 'from-slate-900 via-slate-800 to-zinc-800',
        textColor: isDay ? 'text-slate-900' : 'text-slate-100',
        cardBg: isDay ? 'bg-white/80' : 'bg-slate-900/85',
      };

    case 45: // Fog
    case 48: // Depositing rime fog
      return {
        label: 'Foggy Conditions',
        description: 'Condensed vapor restricting sightlines. Safe speeds recommended.',
        iconName: 'CloudFog',
        bgGradient: 'from-zinc-300 via-neutral-200 to-slate-400',
        textColor: 'text-slate-800',
        cardBg: 'bg-white/80',
      };

    case 51: // Light drizzle
    case 53: // Moderate drizzle
    case 55: // Dense drizzle
      return {
        label: 'Drizzling Mist',
        description: 'Persistent minute water droplets. A light windbreaker should suffice.',
        iconName: 'CloudDrizzle',
        bgGradient: 'from-sky-450 via-slate-300 to-blue-400',
        textColor: 'text-slate-850',
        cardBg: 'bg-white/80',
      };

    case 61: // Slight rain
    case 63: // Moderate rain
      return {
        label: 'Steady Rain',
        description: 'Active rain system. Carry a reliable umbrella or hood.',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-400 via-slate-400 to-slate-600',
        textColor: 'text-slate-900',
        cardBg: 'bg-white/85',
      };

    case 65: // Heavy rain
      return {
        label: 'Heavy Downpour',
        description: 'High precipitation rate. Seek indoor cover and watch for surface puddles.',
        iconName: 'CloudRainWind',
        bgGradient: 'from-slate-700 via-blue-900 to-cyan-950',
        textColor: 'text-slate-100',
        cardBg: 'bg-slate-900/85',
      };

    case 66: // Light freezing rain
    case 67: // Heavy freezing rain
    case 56: // Light freezing drizzle
    case 57: // Dense freezing drizzle
      return {
        label: 'Freezing Precipitation',
        description: 'Sub-zero drizzle forming a slick glaze. Exercise extreme traction care.',
        iconName: 'Snowflake',
        bgGradient: 'from-blue-200 via-sky-100 to-slate-450',
        textColor: 'text-slate-900',
        cardBg: 'bg-white/90',
      };

    case 71: // Slight snowfall
    case 73: // Moderate snowfall
    case 75: // Heavy snowfall
    case 77: // Snow grains
      return {
        label: 'Snowfall Active',
        description: 'Crisp winter landscape accumulation. Bundle up in proper layers.',
        iconName: 'Snowflake',
        bgGradient: 'from-blue-100 via-slate-50 to-indigo-100',
        textColor: 'text-slate-800',
        cardBg: 'bg-white/90',
      };

    case 80: // Slight rain showers
    case 81: // Moderate rain showers
    case 82: // Violent rain showers
      return {
        label: 'Passing Showers',
        description: 'Sudden, intense localized precipitation followed by clear spells.',
        iconName: 'CloudLightning',
        bgGradient: 'from-blue-500 via-indigo-400 to-slate-500',
        textColor: 'text-slate-900',
        cardBg: 'bg-white/85',
      };

    case 85: // Slight snow showers
    case 86: // Heavy snow showers
      return {
        label: 'Blustery Snow Showers',
        description: 'Flurries accompanied by sharp gusts. Limit freezing exposure.',
        iconName: 'Snowflake',
        bgGradient: 'from-indigo-100 via-sky-200 to-slate-400',
        textColor: 'text-slate-800',
        cardBg: 'bg-indigo-50/90',
      };

    case 95: // Thunderstorm
    case 96: // Thunderstorm with slight hail
    case 99: // Thunderstorm with heavy hail
      return {
        label: 'Thunderstorm Warning',
        description: 'Unstable cells producing lightning and loud thunder. Stay indoors.',
        iconName: 'Zap',
        bgGradient: 'from-stone-900 via-purple-950 to-slate-950',
        textColor: 'text-slate-100',
        cardBg: 'bg-slate-950/90',
      };

    default:
      return {
        label: 'Stable Conditions',
        description: 'Current readings indicate light, unremarkable local activity.',
        iconName: 'Cloud',
        bgGradient: 'from-sky-300 via-slate-200 to-blue-400',
        textColor: 'text-slate-900',
        cardBg: 'bg-white/85',
      };
  }
}

/**
 * List of standard intelligence activities to support planning suitability checks.
 */
export const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: 'running',
    name: 'Jogging & Running',
    category: 'fitness',
    iconName: 'Footprints',
    description: 'Outdoor cardio session on trails or sidewalk layout.',
    idealTempMin: 8,
    idealTempMax: 26,
    maxWindSpeed: 25,
    maxPrecipProbability: 25,
    requireSun: false,
    allowCold: true,
  },
  {
    id: 'cycling',
    name: 'Bicycle Cycling',
    category: 'fitness',
    iconName: 'Bike',
    description: 'Road or trail cycling. High requirements on surface friction and low winds.',
    idealTempMin: 12,
    idealTempMax: 30,
    maxWindSpeed: 20,
    maxPrecipProbability: 15,
    requireSun: false,
    allowCold: false,
  },
  {
    id: 'picnic',
    name: 'Outdoor Picnic',
    category: 'leisure',
    iconName: 'Utensils',
    description: 'Socializing, eating, or reading outside on park blankets.',
    idealTempMin: 17,
    idealTempMax: 28,
    maxWindSpeed: 15,
    maxPrecipProbability: 10,
    requireSun: true,
    allowCold: false,
  },
  {
    id: 'laundry',
    name: 'Air Drying Laundry',
    category: 'household',
    iconName: 'Wind',
    description: 'Hanging garments on a line to dry naturally without automated heat.',
    idealTempMin: 15,
    idealTempMax: 40,
    maxWindSpeed: 30,
    maxPrecipProbability: 15,
    requireSun: false,
    allowCold: false,
  },
  {
    id: 'carwash',
    name: 'Washing the Car',
    category: 'household',
    iconName: 'Sparkles',
    description: 'Manual car washing. Best done when no precipitation is forecast for 36 hours.',
    idealTempMin: 10,
    idealTempMax: 32,
    maxWindSpeed: 25,
    maxPrecipProbability: 15,
    requireSun: false,
    allowCold: false,
  },
  {
    id: 'stargazing',
    name: 'Night Stargazing',
    category: 'leisure',
    iconName: 'Sparkles',
    description: 'Observing constellations, planets, or meteors. Requires cloudless night sky.',
    idealTempMin: 2,
    idealTempMax: 28,
    maxWindSpeed: 20,
    maxPrecipProbability: 10,
    requireSun: false,
    allowCold: true,
  },
  {
    id: 'photography',
    name: 'Landscape Photography',
    category: 'leisure',
    iconName: 'Camera',
    description: 'Capturing clear skylines, rich golden hours, or high drama clouds.',
    idealTempMin: 0,
    idealTempMax: 35,
    maxWindSpeed: 35,
    maxPrecipProbability: 25,
    requireSun: false,
    allowCold: true,
  }
];

/**
 * Calculates current suitability feedback for a given activity based on the weather model.
 */
export function calculateSuitability(activity: Activity, weather: WeatherData): ActivityFeedback {
  const currentTemp = weather.current.temperature_2m;
  const currentApparent = weather.current.apparent_temperature;
  const currentWind = weather.current.wind_speed_10m;
  const cloudCover = weather.current.cloud_cover;
  const isDay = weather.current.is_day;
  
  // Try to find expected max precip probability today
  const rainProbToday = weather.daily.precipitation_probability_max?.[0] ?? 0;
  
  // Custom check for Stargazing which MUST occur at night and requires very low cloud cover
  if (activity.id === 'stargazing') {
    if (isDay === 1) {
      return {
        activityId: activity.id,
        score: 'poor',
        reason: 'Currently daylight. Stargazing requires the night sky canopy to be visible.'
      };
    }
    if (cloudCover > 40) {
      return {
        activityId: activity.id,
        score: 'poor',
        reason: `Overwhelming cloud cover (${cloudCover}%). Constellations will be entirely obscured.`
      };
    }
    if (rainProbToday > 20) {
      return {
        activityId: activity.id,
        score: 'fair',
        reason: 'Scattered moisture predicted. High risk of rain or dew disrupting telescopes.'
      };
    }
    if (cloudCover <= 15) {
      return {
        activityId: activity.id,
        score: 'excellent',
        reason: `Pristine dark skies! Exquisite low cloud cover (${cloudCover}%) and friendly wind.`
      };
    }
    return {
      activityId: activity.id,
      score: 'good',
      reason: `Fair stargazing conditions. Clouds are scattered (${cloudCover}%).`
    };
  }

  // Active raining or snowing
  const isPrecipitatingActive = weather.current.precipitation > 0.1;
  const isFreezing = weather.current.weather_code >= 56 && weather.current.weather_code <= 57 || currentTemp < 0;

  if (isPrecipitatingActive) {
    if (activity.id === 'laundry' || activity.id === 'picnic' || activity.id === 'carwash') {
      return {
        activityId: activity.id,
        score: 'poor',
        reason: 'Active rain/snow detected. Garments, blankets, or fresh paint will get wet immediately.'
      };
    }
    if (activity.id === 'cycling') {
      return {
        activityId: activity.id,
        score: 'poor',
        reason: 'Wet lanes drop bicycle traction severely. Consider an indoor trainer session.'
      };
    }
  }

  // Check temperature bounds
  const lowTemp = currentTemp < activity.idealTempMin;
  const highTemp = currentTemp > activity.idealTempMax;
  
  // Severe checks
  if (currentWind > activity.maxWindSpeed) {
    return {
      activityId: activity.id,
      score: 'poor',
      reason: `Severe wind gusts are currently ${currentWind} km/h, exceeding safer bounds (${activity.maxWindSpeed} km/h).`
    };
  }

  if (rainProbToday > 50 && (activity.id === 'picnic' || activity.id === 'laundry')) {
    return {
      activityId: activity.id,
      score: 'poor',
      reason: `High precipitation index of ${rainProbToday}% today. Unsafe to plan outdoor gatherings or dry linen.`
    };
  }

  // Specific check for car washing - if rain tomorrow is high, we mark poor/fair
  if (activity.id === 'carwash' && rainProbToday > 30) {
    return {
      activityId: activity.id,
      score: 'fair',
      reason: `Washing today is discouraged as there is a ${rainProbToday}% chance of rain in the immediate forecast.`
    };
  }

  // Score calculation
  if (lowTemp) {
    if (activity.allowCold && currentTemp >= activity.idealTempMin - 6) {
      return {
        activityId: activity.id,
        score: 'good',
        reason: `Slightly cold (${currentTemp}°C) but fully manageable if you wear thermal layers.`
      };
    } else {
      return {
        activityId: activity.id,
        score: 'poor',
        reason: `Too freezing cold (${currentTemp}°C) to enjoy this activity comfortably.`
      };
    }
  }

  if (highTemp) {
    if (currentTemp > activity.idealTempMax + 5) {
      return {
        activityId: activity.id,
        score: 'poor',
        reason: `Intense heat index (${currentTemp}°C). Risk of dehydration and overexertion.`
      };
    }
    return {
      activityId: activity.id,
      score: 'fair',
      reason: `Warm conditions (${currentTemp}°C). Ensure you stay well hydrated in the shade.`
    };
  }

  // Picnic require sun or low clouds
  if (activity.id === 'picnic' && cloudCover > 75) {
    return {
      activityId: activity.id,
      score: 'fair',
      reason: 'Heavy cloud layers make it chilly and grey for a picnic, though dry.'
    };
  }

  // Photography
  if (activity.id === 'photography') {
    if (cloudCover >= 30 && cloudCover <= 70) {
      return {
        activityId: activity.id,
        score: 'excellent',
        reason: `Spectacular lighting skies! Dynamic clouds (${cloudCover}%) create ideal contrast for photography.`
      };
    }
    if (cloudCover > 85) {
      return {
        activityId: activity.id,
        score: 'fair',
        reason: 'Flat, diffused lighting due to thick overcast. Lacks dramatic shadows.'
      };
    }
  }

  // Laundry drying parameters
  if (activity.id === 'laundry') {
    const relativeHumidity = weather.current.relative_humidity_2m;
    if (relativeHumidity > 75) {
      return {
        activityId: activity.id,
        score: 'fair',
        reason: `Dry time will be sluggish due to dense relative humidity (${relativeHumidity}%).`
      };
    }
    if (currentWind < 4) {
      return {
        activityId: activity.id,
        score: 'good',
        reason: 'Dry conditions but calm winds means slightly stagnant cycle time.'
      };
    }
  }

  // Default optimal state
  return {
    activityId: activity.id,
    score: 'excellent',
    reason: `Absolutely pristine! Friendly climate (${currentTemp}°C), soft wind (${currentWind} km/h), and no rain risks.`
  };
}

/**
 * Iterates over current conditions and returns active safety alerts or warnings
 */
export function getWeatherAlerts(weather: WeatherData): string[] {
  const alerts: string[] = [];
  const current = weather.current;
  const temp = current.temperature_2m;
  const wind = current.wind_speed_10m;
  const uv = weather.daily.uv_index_max?.[0] ?? 0;

  if (wind > 45) {
    alerts.push(`High Wind Advisory: Extreme gusts detected up to ${wind} km/h. Secure loose outdoor furnishings.`);
  }
  if (temp > 36) {
    alerts.push(`Extreme Heat Warning: Current temperature has scaled to ${temp}°C. Reduce heavy outdoor physical work.`);
  }
  if (temp < 0) {
    alerts.push(`Frost and Freeze Warning: Sub-zero temperature (${temp}°C) could freeze water pipes or damage flora.`);
  }
  if (current.precipitation > 1.5) {
    alerts.push(`Active Precipitation Alert: Heavy falling water detected. Expect water puddles and slow transit networks.`);
  }
  if (uv > 7) {
    alerts.push(`Very High UV Index today (${uv}). Ultraviolet radiation is aggressive; apply SPF 30+ and wear eye cover.`);
  }

  return alerts;
}
