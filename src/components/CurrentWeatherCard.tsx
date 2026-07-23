import React from 'react';
import { WeatherData } from '../types';
import { Sparkles, MapPin } from 'lucide-react';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  tempUnit: 'C' | 'F';
}

export function CurrentWeatherCard({ weather, tempUnit }: CurrentWeatherCardProps) {
  const { location, current, recommendations } = weather;

  const displayTemp = tempUnit === 'F' ? Math.round((current.temp * 9) / 5 + 32) : current.temp;

  // Format today's date
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  });

  const primaryRecommendation = recommendations.length > 0 ? recommendations[0] : null;

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-slate-100 flex-1 flex flex-col justify-between relative overflow-hidden group">
      {/* Background Accent Mesh */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-100/50 transition-all duration-500"></div>

      <div>
        {/* Location & Date Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {location.country ? `${location.country}` : 'Current Location'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {location.name}
            </h2>
            <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">{todayDate}</p>
          </div>
          <span className="text-5xl md:text-6xl drop-shadow-xs transition-transform duration-300 group-hover:scale-110">
            {current.icon}
          </span>
        </div>

        {/* Big Hero Temperature */}
        <div className="mt-8">
          <div className="text-6xl md:text-7xl font-light tracking-tighter text-slate-900 flex items-start">
            <span>{displayTemp}</span>
            <span className="text-3xl font-normal align-top mt-2 ml-1 text-slate-500">
              °{tempUnit}
            </span>
          </div>
          <p className="text-lg font-semibold text-slate-700 mt-1 capitalize">
            {current.condition}
          </p>
        </div>
      </div>

      {/* Intelligence Engine Box */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Intelligence Engine
          </span>
        </div>

        <div className="bg-indigo-50/90 rounded-2xl p-4 border border-indigo-100/80 transition-all hover:bg-indigo-50">
          {primaryRecommendation ? (
            <div>
              <p className="text-indigo-950 text-xs md:text-sm leading-relaxed font-medium">
                "{primaryRecommendation.text}"
              </p>
              <div className="mt-2.5 pt-2 border-t border-indigo-100/60 flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-full border border-indigo-100 shadow-2xs">
                  {primaryRecommendation.action}
                </span>
                <span className="text-[10px] font-semibold text-indigo-400 uppercase">
                  {primaryRecommendation.category}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-indigo-900 text-xs md:text-sm font-medium">
              "Favorable weather conditions today. Great time for outdoor activities."
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
