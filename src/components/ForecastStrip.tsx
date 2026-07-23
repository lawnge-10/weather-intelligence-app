import React, { useState } from 'react';
import { WeatherData } from '../types';
import { Calendar, Clock } from 'lucide-react';

interface ForecastStripProps {
  weather: WeatherData;
  tempUnit: 'C' | 'F';
}

export function ForecastStrip({ weather, tempUnit }: ForecastStripProps) {
  const [forecastMode, setForecastMode] = useState<'daily' | 'hourly'>('daily');
  const { dailyForecast, hourlyForecast } = weather;

  return (
    <div className="bg-slate-900 rounded-[32px] p-6 text-white flex-1 flex flex-col justify-between shadow-xl border border-slate-800">
      {/* Forecast Header & Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-sm md:text-base text-slate-100">
            {forecastMode === 'daily' ? '7-Day Forecast' : '24-Hour Hourly Trend'}
          </h3>
        </div>

        <div className="bg-slate-800 p-1 rounded-full flex items-center gap-1 border border-slate-700">
          <button
            onClick={() => setForecastMode('daily')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              forecastMode === 'daily'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setForecastMode('hourly')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
              forecastMode === 'hourly'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            24 Hours
          </button>
        </div>
      </div>

      {/* 7-Day Forecast View */}
      {forecastMode === 'daily' && (
        <div className="flex-1 flex items-center justify-between overflow-x-auto gap-2 md:gap-4 px-1 py-2 scrollbar-none">
          {dailyForecast.map((day, idx) => {
            const maxTemp = tempUnit === 'F' ? Math.round((day.tempMax * 9) / 5 + 32) : day.tempMax;
            const minTemp = tempUnit === 'F' ? Math.round((day.tempMin * 9) / 5 + 32) : day.tempMin;

            return (
              <React.Fragment key={day.date}>
                {idx > 0 && <div className="w-[1px] h-12 bg-white/10 shrink-0 hidden sm:block"></div>}
                <div className="flex flex-col items-center gap-2 min-w-[60px] group transition-transform hover:-translate-y-1">
                  <span className="text-slate-400 text-[10px] md:text-xs font-medium uppercase tracking-wider">
                    {day.dayName}
                  </span>
                  <span className="text-2xl md:text-3xl transition-transform group-hover:scale-110">
                    {day.icon}
                  </span>
                  <span className="font-bold text-sm md:text-base text-slate-100">{maxTemp}°</span>
                  <span className="text-slate-500 text-xs">{minTemp}°</span>
                  {day.precipProbMax > 20 && (
                    <span className="text-[9px] text-sky-400 font-bold bg-sky-950/80 px-1.5 py-0.5 rounded-full border border-sky-800">
                      {day.precipProbMax}%
                    </span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* 24-Hour Forecast View */}
      {forecastMode === 'hourly' && (
        <div className="flex-1 flex items-center gap-4 overflow-x-auto px-1 py-2 scrollbar-none">
          {hourlyForecast.slice(0, 12).map((item, idx) => {
            const hTemp = tempUnit === 'F' ? Math.round((item.temp * 9) / 5 + 32) : item.temp;
            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 min-w-[65px] bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors"
              >
                <span className="text-slate-400 text-[10px] font-medium">{item.time}</span>
                <span className="text-xl">{item.icon}</span>
                <span className="font-bold text-xs text-slate-100">{hTemp}°</span>
                <span className="text-[9px] text-sky-400 font-semibold">{item.precipProb}% rain</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
