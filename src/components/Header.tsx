import React, { useState, useEffect, useRef } from 'react';
import { Search, CloudRain, GraduationCap, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface HeaderProps {
  currentCity: string;
  onSelectLocation: (location: { name: string; country: string; lat: number; lng: number }) => void;
  currentStep: number;
  onOpenMentor: () => void;
  tempUnit: 'C' | 'F';
  onToggleUnit: () => void;
  isLoading: boolean;
}

export function Header({
  currentCity,
  onSelectLocation,
  currentStep,
  onOpenMentor,
  tempUnit,
  onToggleUnit,
  isLoading
}: HeaderProps) {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingGeo, setIsSearchingGeo] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debouncing geocoding search input
  useEffect(() => {
    if (searchInput.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingGeo(true);
      try {
        const response = await axios.get(`/api/geocode?city=${encodeURIComponent(searchInput.trim())}`);
        if (response.data.results) {
          setSuggestions(response.data.results);
          setShowSuggestions(true);
        }
      } catch (err) {
        setSuggestions([]);
      } finally {
        setIsSearchingGeo(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    if (suggestions.length > 0) {
      const top = suggestions[0];
      onSelectLocation({ name: top.name, country: top.country, lat: top.latitude, lng: top.longitude });
      setShowSuggestions(false);
      setSearchInput('');
    } else {
      // Fallback search by string name directly
      onSelectLocation({ name: searchInput.trim(), country: '', lat: NaN, lng: NaN });
      setSearchInput('');
      setShowSuggestions(false);
    }
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 flex-shrink-0 relative z-30 shadow-xs">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <CloudRain className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Weather<span className="text-indigo-600">Intel</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Open-Meteo Engine</p>
        </div>
      </div>

      {/* City Search Bar with Autocomplete */}
      <div className="flex-1 max-w-md mx-4 md:mx-12 relative" ref={dropdownRef}>
        <form onSubmit={handleFormSubmit} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => searchInput.trim().length >= 2 && setShowSuggestions(true)}
            placeholder={`Search city (current: ${currentCity})...`}
            className="w-full bg-slate-100 text-slate-900 border-none rounded-full py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
          />
          <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
          {isSearchingGeo || isLoading ? (
            <RefreshCw className="absolute right-3.5 top-3 text-indigo-500 w-4 h-4 animate-spin" />
          ) : null}
        </form>

        {/* Autocomplete Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-12 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 max-h-60 overflow-y-auto">
            {suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectLocation({ name: item.name, country: item.country, lat: item.latitude, lng: item.longitude });
                  setShowSuggestions(false);
                  setSearchInput('');
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 flex items-center justify-between transition-colors border-b border-slate-50 last:border-0"
              >
                <div>
                  <span className="font-semibold text-slate-900">{item.name}</span>
                  {item.admin1 && <span className="text-slate-400 text-xs ml-1">({item.admin1})</span>}
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {item.country}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Unit Toggle & Mentor Mode Badge */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Temperature Unit Toggle Button */}
        <button
          onClick={onToggleUnit}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors flex items-center gap-1 border border-slate-200"
          title="Toggle Temperature Unit"
        >
          <span className={tempUnit === 'C' ? 'text-indigo-600 font-extrabold' : 'text-slate-400'}>°C</span>
          <span className="text-slate-300">/</span>
          <span className={tempUnit === 'F' ? 'text-indigo-600 font-extrabold' : 'text-slate-400'}>°F</span>
        </button>

        {/* Mentor Mode Step Badge */}
        <button
          onClick={onOpenMentor}
          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-indigo-200 transition-all flex items-center gap-2 cursor-pointer shadow-xs hover:shadow-sm"
        >
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span>Step {currentStep} Active</span>
        </button>
      </div>
    </header>
  );
}
