import React from 'react';

interface QuickCitiesProps {
  onSelectCity: (cityName: string) => void;
  activeCity: string;
}

const POPULAR_CITIES = [
  'London',
  'Tokyo',
  'New York',
  'Paris',
  'Sydney',
  'Mumbai',
  'Seattle',
  'Berlin'
];

export function QuickCities({ onSelectCity, activeCity }: QuickCitiesProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap mr-1">
        Popular Cities:
      </span>
      {POPULAR_CITIES.map((city) => {
        const isActive = activeCity.toLowerCase() === city.toLowerCase();
        return (
          <button
            key={city}
            onClick={() => onSelectCity(city)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {city}
          </button>
        );
      })}
    </div>
  );
}
