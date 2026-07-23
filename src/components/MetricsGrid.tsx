import React from 'react';
import { WeatherData } from '../types';

interface MetricsGridProps {
  weather: WeatherData;
  tempUnit: 'C' | 'F';
}

export function MetricsGrid({ weather, tempUnit }: MetricsGridProps) {
  const { current, airQuality, dailyForecast } = weather;

  const displayFeelsLike =
    tempUnit === 'F' ? Math.round((current.feelsLike * 9) / 5 + 32) : current.feelsLike;

  // UV level text & badge styling
  const uvVal = current.uvIndex;
  let uvLabel = 'Low';
  let uvColorClass = 'text-emerald-600 bg-emerald-50';
  if (uvVal >= 8) {
    uvLabel = 'Very High';
    uvColorClass = 'text-rose-600 bg-rose-50';
  } else if (uvVal >= 6) {
    uvLabel = 'High';
    uvColorClass = 'text-amber-600 bg-amber-50';
  } else if (uvVal >= 3) {
    uvLabel = 'Mod';
    uvColorClass = 'text-orange-500 bg-orange-50';
  }

  // Todays precip prob max
  const todayPrecipProb =
    dailyForecast.length > 0 ? dailyForecast[0].precipProbMax : Math.round(current.precipitation * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {/* 1. Feels Like */}
      <div className="bg-white p-4 md:p-5 rounded-[24px] border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow">
        <p className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Feels Like
        </p>
        <div className="flex items-end justify-between">
          <span className="text-xl md:text-2xl font-bold text-slate-900">
            {displayFeelsLike}°{tempUnit}
          </span>
          <span className="text-2xl">🌡️</span>
        </div>
      </div>

      {/* 2. Wind Speed */}
      <div className="bg-white p-4 md:p-5 rounded-[24px] border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow">
        <p className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Wind Speed
        </p>
        <div className="flex items-end justify-between">
          <span className="text-xl md:text-2xl font-bold text-slate-900">
            {current.windSpeed}{' '}
            <span className="text-xs font-medium text-slate-500">km/h</span>
          </span>
          <span className="text-2xl">💨</span>
        </div>
      </div>

      {/* 3. Humidity */}
      <div className="bg-white p-4 md:p-5 rounded-[24px] border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow">
        <p className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Humidity
        </p>
        <div className="flex items-end justify-between">
          <span className="text-xl md:text-2xl font-bold text-slate-900">
            {current.humidity}%
          </span>
          <span className="text-2xl">💧</span>
        </div>
      </div>

      {/* 4. UV Index */}
      <div className="bg-white p-4 md:p-5 rounded-[24px] border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow">
        <p className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          UV Index
        </p>
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl md:text-2xl font-bold text-slate-900">
              {uvVal.toFixed(1)}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${uvColorClass}`}>
              {uvLabel}
            </span>
          </div>
          <span className="text-2xl">☀️</span>
        </div>
      </div>

      {/* 5. Precipitation */}
      <div className="bg-white p-4 md:p-5 rounded-[24px] border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow">
        <p className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Precipitation
        </p>
        <div className="flex items-end justify-between">
          <span className="text-xl md:text-2xl font-bold text-slate-900">
            {todayPrecipProb}%
          </span>
          <span className="text-2xl">🌧️</span>
        </div>
      </div>

      {/* 6. Pressure / Air Quality */}
      <div className="bg-white p-4 md:p-5 rounded-[24px] border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow">
        <p className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {airQuality ? 'Air Quality (AQI)' : 'Pressure'}
        </p>
        <div className="flex items-end justify-between">
          <span className="text-xl md:text-2xl font-bold text-slate-900">
            {airQuality ? (
              <span>
                {airQuality.usAqi}{' '}
                <span className="text-xs font-medium text-emerald-600">US</span>
              </span>
            ) : (
              <span>
                {current.pressure}{' '}
                <span className="text-xs font-medium text-slate-500">hPa</span>
              </span>
            )}
          </span>
          <span className="text-2xl">⏲️</span>
        </div>
      </div>
    </div>
  );
}
