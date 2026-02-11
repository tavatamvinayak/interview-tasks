const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const fetchCurrentWeather = async ({city,lat,lon})=>{
    const params = {
        appid:API_KEY,
        units:"metric"
    }
    if(city) params.q = city;
    if(lat && lon){
        params.lat = lat;
        params.lon = lon;
    }
    const response = await axios.get(`${BASE_URL}/weather`,{params});
    return response.data
}

const fetchForecast = async(city)=>{
    const response = await axios.get(`${BASE_URL}/forecast`,{
        params:{
            q:city,
            units:"metric",
            appid:API_KEY
        }
    });
    return response.data
}

module.exports = {
    fetchCurrentWeather,
    fetchForecast
}