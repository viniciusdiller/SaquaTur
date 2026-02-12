"use client";

import { useEffect, useState } from "react";
import { defaultWaveData, type WaveData } from "@/lib/static-data";

export function useWaveData() {
  const [data, setData] = useState<WaveData>(defaultWaveData);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const res = await fetch("https://marine-api.open-meteo.com/v1/marine?latitude=-22.93&longitude=-42.51&current=wave_height,wave_direction,wave_period");
        const weatherRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-22.93&longitude=-42.51&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m");
        const marine = await res.json();
        const weather = await weatherRes.json();

        if (!mounted) return;
        setData({
          waveHeight: marine?.current?.wave_height ?? defaultWaveData.waveHeight,
          waveDirection: marine?.current?.wave_direction ?? defaultWaveData.waveDirection,
          wavePeriod: marine?.current?.wave_period ?? defaultWaveData.wavePeriod,
          temperature: weather?.current?.temperature_2m ?? defaultWaveData.temperature,
          weatherCode: weather?.current?.weather_code ?? defaultWaveData.weatherCode,
          windSpeed: weather?.current?.wind_speed_10m ?? defaultWaveData.windSpeed,
          windDirection: weather?.current?.wind_direction_10m ?? defaultWaveData.windDirection
        });
      } catch {
        setData(defaultWaveData);
      }
    }

    loadData();
  }, []);

  return { data };
}
