"use client";

import { useState } from "react";

export default function SearchBar({
  onSearch,
  onLocationSearch,
}: {
  onSearch: (city: string) => void;
  onLocationSearch: (lat: number, lon: number) => void;
}) {
  const [city, setCity] = useState("");

  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSearch(latitude, longitude);
      },
      () => {
        alert("Failed to get location");
      }
    );
  };

  return (
    <div className="flex flex-wrap gap-2 w-full max-w-md">
      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 border p-2 rounded"
      />

      <button
        onClick={() => onSearch(city)}
        className="bg-blue-600 text-white px-4 rounded"
      >
        Search
      </button>

      <button
        onClick={handleLocation}
        className="bg-green-600 text-white px-3 rounded"
      >
        Use Location
      </button>
    </div>
  );
}
