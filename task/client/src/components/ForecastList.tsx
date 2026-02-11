export default function ForecastList({ data }: { data: any }) {
  const firstFive = data.forecast.slice(0, 5);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
      {firstFive.map((item: any, index: number) => (
        <div key={index} className="bg-gray-100 p-4 rounded text-center">
          <p className="text-sm">
            {new Date(item.time).toLocaleTimeString()}
          </p>
          <p className="font-semibold">{item.tempC}°C</p>
          <p className="text-sm">{item.condition}</p>
        </div>
      ))}
    </div>
  );
}
