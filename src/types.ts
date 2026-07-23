export interface LocationData {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  admin1?: string;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection?: number;
  precipitation: number;
  cloudCover?: number;
  isDay: boolean;
  weatherCode: number;
  condition: string;
  icon: string;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

export interface AirQuality {
  usAqi: number | string;
  europeanAqi: number | string;
  pm2_5: string;
  pm10: string;
}

export interface Recommendation {
  text: string;
  action: string;
  category: string;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  fullDate: string;
  weatherCode: number;
  condition: string;
  icon: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipProbMax: number;
  uvIndexMax: number;
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  precipProb: number;
  uvIndex: number;
  condition: string;
  icon: string;
}

export interface WeatherData {
  location: LocationData;
  current: CurrentWeather;
  airQuality: AirQuality | null;
  recommendations: Recommendation[];
  dailyForecast: ForecastDay[];
  hourlyForecast: HourlyForecast[];
}

export interface CurriculumStep {
  stepNumber: number;
  title: string;
  topic: string;
  summary: string;
  theory: string;
  diagram: string;
  codeSnippet: string;
  lineByLine: string[];
  interviewQuestions: { q: string; a: string }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  exercise: string;
  bestPractices: string[];
}
