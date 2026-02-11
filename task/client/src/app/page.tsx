"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";
import ForecastList from "@/components/ForecastList";
import Loader from "@/components/Loader";
import { useWeather } from "@/hooks/useWeather";

export default function Home() {
  const [city, setCity] = useState<string | undefined>();
  const [coords, setCoords] = useState<
    { lat: number; lon: number } | undefined
  >();

  const { weatherQuery, forecastQuery } = useWeather(city, coords);

  const handleCitySearch = (cityName: string) => {
    setCoords(undefined); // clear coords
    setCity(cityName);
  };

  const handleLocationSearch = (lat: number, lon: number) => {
    setCity(undefined); // clear city
    setCoords({ lat, lon });
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Weather App</h1>

      <SearchBar
        onSearch={handleCitySearch}
        onLocationSearch={handleLocationSearch}
      />

      {weatherQuery.isLoading && <Loader text="Fetching weather..." />}
      {weatherQuery.isError && (
        <p className="mt-6 text-red-500">Failed to fetch weather</p>
      )}

      {weatherQuery.data && (
        <>
          <div className="mt-6">
            <WeatherCard data={weatherQuery.data} />
          </div>

          {forecastQuery.data && city && (
            <ForecastList data={forecastQuery.data} />
          )}
        </>
      )}
    </main>
  );
}
