import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to interpret WMO weather codes
function getWmoWeatherInfo(code: number): { description: string; icon: string } {
  switch (code) {
    case 0:
      return { description: 'Clear sky', icon: '☀️' };
    case 1:
      return { description: 'Mainly clear', icon: '🌤️' };
    case 2:
      return { description: 'Partly cloudy', icon: '⛅' };
    case 3:
      return { description: 'Overcast', icon: '☁️' };
    case 45:
    case 48:
      return { description: 'Foggy', icon: '🌫️' };
    case 51:
    case 53:
    case 55:
      return { description: 'Drizzle', icon: '🌦️' };
    case 61:
      return { description: 'Light rain', icon: '🌧️' };
    case 63:
      return { description: 'Moderate rain', icon: '🌧️' };
    case 65:
      return { description: 'Heavy rain', icon: '🌧️' };
    case 71:
    case 73:
    case 75:
      return { description: 'Snowfall', icon: '❄️' };
    case 80:
    case 81:
    case 82:
      return { description: 'Rain showers', icon: '🌦️' };
    case 95:
    case 96:
    case 99:
      return { description: 'Thunderstorm', icon: '⛈️' };
    default:
      return { description: 'Variable weather', icon: '🌤️' };
  }
}

// Helper function to build planning recommendations
function generateRecommendations(data: {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitationProb: number;
  uvIndex: number;
  weatherCode: number;
}): { text: string; action: string; category: string }[] {
  const recommendations: { text: string; action: string; category: string }[] = [];

  // Rain / Precipitation logic
  if (data.precipitationProb >= 50 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(data.weatherCode)) {
    recommendations.push({
      text: `High probability of rain (${data.precipitationProb}%). Don't forget your umbrella today!`,
      action: 'Carry an umbrella ☔',
      category: 'Weather Protection'
    });
  }

  // UV logic
  if (data.uvIndex >= 6) {
    recommendations.push({
      text: `Very high UV Index (${data.uvIndex.toFixed(1)}). Wear SPF 30+ sunscreen and UV-blocking sunglasses.`,
      action: 'Wear Sunscreen & Sunglasses 🕶️',
      category: 'Sun Safety'
    });
  } else if (data.uvIndex >= 3) {
    recommendations.push({
      text: `Moderate UV levels (${data.uvIndex.toFixed(1)}). Moderate sun protection recommended for extended outdoor exposure.`,
      action: 'Moderate Sun Exposure ☀️',
      category: 'Sun Safety'
    });
  }

  // Wind logic
  if (data.windSpeed >= 25) {
    recommendations.push({
      text: `Strong wind gusts up to ${data.windSpeed} km/h. Secure loose items outdoors and hold onto hats!`,
      action: 'Caution: Strong Winds 💨',
      category: 'Wind Advisory'
    });
  }

  // Temperature / Outdoor activities
  if (data.temp >= 18 && data.temp <= 25 && data.precipitationProb < 20 && data.windSpeed < 20) {
    recommendations.push({
      text: `Optimal temperature (${Math.round(data.temp)}°C) and clear skies. Perfect conditions for outdoor sports, cycling, or walking!`,
      action: 'Great day for outdoor activities 🚴‍♂️',
      category: 'Outdoor Planning'
    });
  } else if (data.temp > 30) {
    recommendations.push({
      text: `Hot temperatures (${Math.round(data.temp)}°C). Stay hydrated, wear lightweight clothing, and seek shade during noon hours.`,
      action: 'Stay Hydrated & Cool 💧',
      category: 'Temperature Alert'
    });
  } else if (data.temp < 8) {
    recommendations.push({
      text: `Cold weather (${Math.round(data.temp)}°C). Dress in warm thermal layers, gloves, and a cozy coat.`,
      action: 'Dress Warmly 🧥',
      category: 'Temperature Alert'
    });
  } else if (recommendations.length === 0) {
    recommendations.push({
      text: `Mild weather conditions (${Math.round(data.temp)}°C). Suitable for standard daily routines and light outdoor walks.`,
      action: 'Good day for a walk 🚶',
      category: 'General Advice'
    });
  }

  return recommendations;
}

// API Health Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Weather Intelligence API',
    timestamp: new Date().toISOString()
  });
});

// API Geocoding Search Endpoint
app.get('/api/geocode', async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string;
    if (!city || city.trim().length === 0) {
      res.status(400).json({ error: 'City query parameter is required.' });
      return;
    }

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=5&language=en&format=json`;
    const response = await fetch(geoUrl);

    if (!response.ok) {
      throw new Error(`Open-Meteo Geocoding HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      res.status(404).json({ error: `No matching cities found for "${city}". Please check spelling.` });
      return;
    }

    const results = data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      country: item.country,
      countryCode: item.country_code,
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto'
    }));

    res.json({ results });
  } catch (error: any) {
    console.error('Geocoding API error:', error);
    res.status(500).json({ error: error.message || 'Failed to search location.' });
  }
});

// API Weather Data Endpoint
app.get('/api/weather', async (req: Request, res: Response) => {
  try {
    let lat = parseFloat(req.query.lat as string);
    let lng = parseFloat(req.query.lng as string);
    let cityName = req.query.cityName as string;
    let countryName = req.query.countryName as string;

    const cityQuery = req.query.city as string;

    // If city string is provided directly, perform geocoding first
    if ((isNaN(lat) || isNaN(lng)) && cityQuery) {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery.trim())}&count=1&language=en&format=json`;
      const geoRes = await fetch(geoUrl);
      if (!geoRes.ok) throw new Error('Geocoding search failed.');
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        res.status(404).json({ error: `City "${cityQuery}" not found.` });
        return;
      }
      const topMatch = geoData.results[0];
      lat = topMatch.latitude;
      lng = topMatch.longitude;
      cityName = topMatch.name;
      countryName = topMatch.country;
    }

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({ error: 'Latitude and Longitude, or valid city name are required.' });
      return;
    }

    // Fetch Open-Meteo Weather Forecast
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

    // Fetch Air Quality in parallel
    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=european_aqi,us_aqi,pm10,pm2_5&timezone=auto`;

    const [weatherRes, aqRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(airQualityUrl).catch(() => null)
    ]);

    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo Weather HTTP error! Status: ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();
    let aqData = null;
    if (aqRes && aqRes.ok) {
      aqData = await aqRes.json();
    }

    // Extract current weather
    const current = weatherData.current || {};
    const daily = weatherData.daily || {};
    const hourly = weatherData.hourly || {};

    const currentWeatherInfo = getWmoWeatherInfo(current.weather_code || 0);

    // Todays UV Index from daily array
    const todayUvMax = daily.uv_index_max && daily.uv_index_max[0] ? daily.uv_index_max[0] : 0;
    const todayPrecipProb = daily.precipitation_probability_max && daily.precipitation_probability_max[0] ? daily.precipitation_probability_max[0] : 0;

    // Generate smart recommendations
    const recommendations = generateRecommendations({
      temp: current.temperature_2m || 0,
      feelsLike: current.apparent_temperature || current.temperature_2m || 0,
      humidity: current.relative_humidity_2m || 0,
      windSpeed: current.wind_speed_10m || 0,
      precipitationProb: todayPrecipProb,
      uvIndex: todayUvMax,
      weatherCode: current.weather_code || 0
    });

    // Format 7-Day Forecast
    const forecastDays = [];
    if (daily.time && Array.isArray(daily.time)) {
      for (let i = 0; i < Math.min(daily.time.length, 7); i++) {
        const dateStr = daily.time[i];
        const date = new Date(dateStr + 'T00:00:00');
        const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
        const fullDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const wInfo = getWmoWeatherInfo(daily.weather_code[i] || 0);

        forecastDays.push({
          date: dateStr,
          dayName,
          fullDate,
          weatherCode: daily.weather_code[i],
          condition: wInfo.description,
          icon: wInfo.icon,
          tempMax: Math.round(daily.temperature_2m_max[i]),
          tempMin: Math.round(daily.temperature_2m_min[i]),
          precipitationSum: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
          precipProbMax: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
          uvIndexMax: daily.uv_index_max ? daily.uv_index_max[i] : 0,
          windSpeedMax: daily.wind_speed_10m_max ? Math.round(daily.wind_speed_10m_max[i]) : 0,
          sunrise: daily.sunrise && daily.sunrise[i] ? daily.sunrise[i].split('T')[1] : '',
          sunset: daily.sunset && daily.sunset[i] ? daily.sunset[i].split('T')[1] : ''
        });
      }
    }

    // Format Hourly Forecast (Next 24 hours)
    const hourlyForecast = [];
    if (hourly.time && Array.isArray(hourly.time)) {
      const now = new Date();
      for (let i = 0; i < hourly.time.length && hourlyForecast.length < 24; i++) {
        const itemTime = new Date(hourly.time[i]);
        if (itemTime >= now) {
          const hInfo = getWmoWeatherInfo(hourly.weather_code[i] || 0);
          hourlyForecast.push({
            time: itemTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            temp: Math.round(hourly.temperature_2m[i]),
            feelsLike: Math.round(hourly.apparent_temperature[i]),
            humidity: hourly.relative_humidity_2m[i],
            precipProb: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
            uvIndex: hourly.uv_index ? hourly.uv_index[i] : 0,
            condition: hInfo.description,
            icon: hInfo.icon
          });
        }
      }
    }

    // Format response
    const formattedData = {
      location: {
        name: cityName || 'Selected Location',
        country: countryName || '',
        latitude: lat,
        longitude: lng,
        timezone: weatherData.timezone || 'UTC'
      },
      current: {
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        pressure: Math.round(current.pressure_msl || current.surface_pressure || 1013),
        windSpeed: Math.round(current.wind_speed_10m),
        windDirection: current.wind_direction_10m,
        precipitation: current.precipitation || 0,
        cloudCover: current.cloud_cover || 0,
        isDay: current.is_day === 1,
        weatherCode: current.weather_code,
        condition: currentWeatherInfo.description,
        icon: currentWeatherInfo.icon,
        uvIndex: todayUvMax,
        sunrise: daily.sunrise && daily.sunrise[0] ? daily.sunrise[0].split('T')[1] : '--:--',
        sunset: daily.sunset && daily.sunset[0] ? daily.sunset[0].split('T')[1] : '--:--'
      },
      airQuality: aqData && aqData.current ? {
        usAqi: aqData.current.us_aqi || 'N/A',
        europeanAqi: aqData.current.european_aqi || 'N/A',
        pm2_5: aqData.current.pm2_5 ? aqData.current.pm2_5.toFixed(1) : 'N/A',
        pm10: aqData.current.pm10 ? aqData.current.pm10.toFixed(1) : 'N/A'
      } : null,
      recommendations,
      dailyForecast: forecastDays,
      hourlyForecast
    };

    res.json(formattedData);
  } catch (error: any) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch weather data.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Weather Intelligence server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
