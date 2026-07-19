/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

export interface DailyForecast {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  uv_index_max: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  daily: DailyForecast;
  current_units: Record<string, string>;
  daily_units: Record<string, string>;
}

export interface Activity {
  id: string;
  name: string;
  category: 'outdoor' | 'household' | 'leisure' | 'fitness';
  iconName: string;
  description: string;
  // Suitability calculation thresholds
  idealTempMin: number;
  idealTempMax: number;
  maxWindSpeed: number;
  maxPrecipProbability: number;
  requireSun: boolean;
  allowCold: boolean;
}

export interface ActivityFeedback {
  activityId: string;
  score: 'excellent' | 'good' | 'fair' | 'poor';
  reason: string;
}

export interface WeatherConditionInfo {
  label: string;
  description: string;
  iconName: string;
  bgGradient: string; // Tailwind class
  textColor: string;  // Tailwind text color
  cardBg: string;      // Tailwind card bg
}
