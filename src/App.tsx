import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { WeatherData } from './types';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { MetricsGrid } from './components/MetricsGrid';
import { ForecastStrip } from './components/ForecastStrip';
import { QuickCities } from './components/QuickCities';
import { SkeletonLoader } from './components/SkeletonLoader';
import { MentorGuide } from './components/MentorGuide';
import { Footer } from './components/Footer';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<string>('London');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isMentorOpen, setIsMentorOpen] = useState<boolean>(false);

  // Fetch weather data from Express Proxy Backend using Axios
  const fetchWeatherData = useCallback(
    async (location: { name: string; country?: string; lat?: number; lng?: number }) => {
      setIsLoading(true);
      setError(null);

      try {
        let url = '';
        if (location.lat && location.lng && !isNaN(location.lat) && !isNaN(location.lng)) {
          url = `/api/weather?lat=${location.lat}&lng=${location.lng}&cityName=${encodeURIComponent(
            location.name
          )}&countryName=${encodeURIComponent(location.country || '')}`;
        } else {
          url = `/api/weather?city=${encodeURIComponent(location.name)}`;
        }

        const response = await axios.get(url);
        setWeather(response.data);
        setCurrentCity(response.data.location.name);
      } catch (err: any) {
        console.error('Fetch weather error:', err);
        const errMsg =
          err.response?.data?.error ||
          `Failed to load weather for "${location.name}". Please check the city spelling and try again.`;
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load: Fetch London weather
  useEffect(() => {
    fetchWeatherData({ name: 'London' });
  }, [fetchWeatherData]);

  const handleSelectQuickCity = (cityName: string) => {
    fetchWeatherData({ name: cityName });
  };

  const handleToggleUnit = () => {
    setTempUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden">
      {/* 1. Header Navigation Bar */}
      <Header
        currentCity={currentCity}
        onSelectLocation={fetchWeatherData}
        currentStep={currentStep}
        onOpenMentor={() => setIsMentorOpen(true)}
        tempUnit={tempUnit}
        onToggleUnit={handleToggleUnit}
        isLoading={isLoading}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-4 max-w-7xl w-full mx-auto">
        {/* Quick Popular Cities Pills Bar */}
        <div className="flex items-center justify-between">
          <QuickCities onSelectCity={handleSelectQuickCity} activeCity={currentCity} />
          <button
            onClick={() => fetchWeatherData({ name: currentCity })}
            disabled={isLoading}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer shrink-0 ml-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-2xl flex items-center justify-between shadow-2xs animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-xs md:text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-800 font-bold text-xs bg-rose-100 hover:bg-rose-200 px-2.5 py-1 rounded-lg transition-colors ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Grid Content */}
        {isLoading && !weather ? (
          <SkeletonLoader />
        ) : weather ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 flex-1 min-h-0">
            {/* Left Hero Panel (Col 4 on desktop): Current Weather & Recommendation Engine */}
            <div className="col-span-12 md:col-span-4 flex flex-col gap-4 md:gap-6">
              <CurrentWeatherCard weather={weather} tempUnit={tempUnit} />
            </div>

            {/* Right Dashboard Panel (Col 8 on desktop): Metric Grid & 7-Day Forecast */}
            <div className="col-span-12 md:col-span-8 flex flex-col gap-4 md:gap-6">
              {/* 6 Utility Metrics Cards */}
              <MetricsGrid weather={weather} tempUnit={tempUnit} />

              {/* 7-Day / 24-Hour Forecast Strip */}
              <ForecastStrip weather={weather} tempUnit={tempUnit} />
            </div>
          </div>
        ) : null}
      </main>

      {/* Interactive Mentor Curriculum Drawer / Modal */}
      {isMentorOpen && (
        <MentorGuide
          currentStep={currentStep}
          onSetStep={(s) => setCurrentStep(s)}
          onClose={() => setIsMentorOpen(false)}
        />
      )}

      {/* Status Footer */}
      <Footer onOpenMentor={() => setIsMentorOpen(true)} currentStep={currentStep} />
    </div>
  );
}
