import axios from "axios";

const Backend_url = process.env.NEXT_PUBLIC_BACKEND_URL

const API_BASE =  `${Backend_url}/api` || "http://localhost:5000/api";

export const fetchWeatherByCity = async (city: string) => {
  const res = await axios.get(`${API_BASE}/weather`, {
    params: { city },
  });
  return res.data;
};

export const fetchWeatherByCoords = async (lat: number, lon: number) => {
  const res = await axios.get(`${API_BASE}/weather`, {
    params: { lat, lon },
  });
  return res.data;
};

export const fetchForecast = async (city: string) => {
  const res = await axios.get(`${API_BASE}/forecast`, {
    params: { city },
  });
  return res.data;
};
