export default function WeatherCard({ data }: { data: any }) {
  return (
<div className=" flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
  <div className="bg-white shadow-xl p-6 sm:p-8 rounded-2xl w-full max-w-md transition-all duration-300">

    {/* Location */}
    <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
      {data.location.city}, {data.location.country}
    </h2>

    {/* Temperature */}
    <p className="text-5xl sm:text-6xl font-semibold mt-4 text-blue-600">
      {data.current.tempC}°C
    </p>

    {/* Condition */}
    <p className="text-gray-500 text-base sm:text-lg mt-1">
      {data.current.condition}
    </p>

    {/* Details */}
    <div className="mt-6 space-y-2 text-sm sm:text-base text-gray-700">
      <p>
        Feels Like:{" "}
        <span className="font-semibold text-gray-900">
          {data.current.feelsLikeC}°C
        </span>
      </p>
      <p>Humidity: {data.current.humidity}%</p>
      <p>Wind Speed: {data.current.windKph.toFixed(1)} km/h</p>
      <p>
        Updated:{" "}
        {new Date(data.current.updatedAt).toLocaleTimeString()}
      </p>
    </div>

  </div>
</div>

  );
}
