import { useQuery } from "@tanstack/react-query";

export interface WaveData {
  waveHeight: number;
  wavePeriod: number;
  waveDirection: number;
  windSpeed: number;
  windDirection: number;
  waterTemperature: number;
  temperature: number;
  weatherCode: number;
  hourly?: {
    time: string[];
    waveHeight: number[];
    wavePeriod: number[];
    waveDirection: number[];
    windSpeed: number[];
    temperature: number[];
  };
}

const BEACH_COORDS: Record<string, { lat: number; lng: number }> = {
  itauna: { lat: -22.9204, lng: -42.4897 },
  vila: { lat: -22.9197, lng: -42.5103 },
  jacone: { lat: -22.9333, lng: -42.6167 },
  barrinha: { lat: -22.9250, lng: -42.4800 },
  "barra-nova": { lat: -22.9280, lng: -42.4700 },
};

// Default coordinates (Itaúna)
const DEFAULT_COORDS = { lat: -22.9204, lng: -42.4897 };

async function fetchWaveData(slug?: string, includeHourly = false): Promise<WaveData> {
  const coords = slug ? BEACH_COORDS[slug] ?? DEFAULT_COORDS : DEFAULT_COORDS;

  // Marine API for wave data
  const marineParams = new URLSearchParams({
    latitude: coords.lat.toString(),
    longitude: coords.lng.toString(),
    current: "wave_height,wave_period,wave_direction",
    ...(includeHourly ? {
      hourly: "wave_height,wave_period,wave_direction",
      forecast_days: "2",
    } : {}),
  });

  // Weather API for wind and temperature
  const weatherParams = new URLSearchParams({
    latitude: coords.lat.toString(),
    longitude: coords.lng.toString(),
    current: "temperature_2m,wind_speed_10m,wind_direction_10m,weather_code",
    ...(includeHourly ? {
      hourly: "temperature_2m,wind_speed_10m",
      forecast_days: "2",
    } : {}),
  });

  const [marineRes, weatherRes] = await Promise.all([
    fetch(`https://marine-api.open-meteo.com/v1/marine?${marineParams}`),
    fetch(`https://api.open-meteo.com/v1/forecast?${weatherParams}`),
  ]);

  if (!marineRes.ok || !weatherRes.ok) {
    throw new Error("Failed to fetch wave/weather data");
  }

  const marine = await marineRes.json();
  const weather = await weatherRes.json();

  const result: WaveData = {
    waveHeight: marine.current?.wave_height ?? 0,
    wavePeriod: marine.current?.wave_period ?? 0,
    waveDirection: marine.current?.wave_direction ?? 0,
    windSpeed: weather.current?.wind_speed_10m ?? 0,
    windDirection: weather.current?.wind_direction_10m ?? 0,
    waterTemperature: 23, // Open-Meteo Marine doesn't provide water temp in free tier
    temperature: weather.current?.temperature_2m ?? 0,
    weatherCode: weather.current?.weather_code ?? 0,
  };

  if (includeHourly && marine.hourly && weather.hourly) {
    result.hourly = {
      time: marine.hourly.time,
      waveHeight: marine.hourly.wave_height,
      wavePeriod: marine.hourly.wave_period,
      waveDirection: marine.hourly.wave_direction,
      windSpeed: weather.hourly.wind_speed_10m,
      temperature: weather.hourly.temperature_2m,
    };
  }

  return result;
}

export function useWaveData(slug?: string, includeHourly = false) {
  return useQuery({
    queryKey: ["wave-data", slug ?? "default", includeHourly],
    queryFn: () => fetchWaveData(slug, includeHourly),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}
