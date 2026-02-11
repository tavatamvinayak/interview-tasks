import { useQuery } from "@tanstack/react-query";
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  fetchForecast,
} from "@/services/weatherApi";

export const useWeather = (
  city?: string,
  coords?: { lat: number; lon: number }
) => {
  const weatherQuery = useQuery({
    queryKey: ["weather", city, coords],
    queryFn: () => {
      if (coords) {
        return fetchWeatherByCoords(coords.lat, coords.lon);
      }
      if (city) {
        return fetchWeatherByCity(city);
      }
    },
    enabled: !!city || !!coords,
  });

  const forecastQuery = useQuery({
    queryKey: ["forecast", city],
    queryFn: () => fetchForecast(city!),
    enabled: !!city, // forecast only works with city
  });

  return { weatherQuery, forecastQuery };
};
