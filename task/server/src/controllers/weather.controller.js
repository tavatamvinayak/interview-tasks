const {
    fetchCurrentWeather,
    fetchForecast
} = require('../services/openWeather.service');
const { isValidCoordinates } = require('../utils/validate');

const getCurrentWether = async (req, res) => {
    try {
        const { city, lat, lon } = req.query;
        if (!city && (!lat || !lon)) {
            return res.status(400).json({
                error: "City or latitude & longitude are reqquired"
            })
        }
        if (lat && lon && !isValidCoordinates(lat, lon)) {
            return res.status(400).json({
                error: "invalid latitude or longitude"
            })
        }
        const data = await fetchCurrentWeather({ city, lat, lon });
        const normalizedResponse = {
            location: {
                city: data?.name,
                country: data?.sys?.country
            },
            current: {
                tempC: data?.main?.temp,
                feelsLikeC: data?.main?.feels_like,
                condition: data?.weather[0]?.main,
                humidity: data?.main?.humidity,
                windKph: data?.wind?.speed * 3.6,
                updatedAt: new Date(data.dt * 1000).toISOString()
            }
        }
        res.json(normalizedResponse);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch weather data"
        });
    }
}

const getForecast = async (req,res)=>{
    try {
        const {city}= req.query;
        if(!city){
            return res.status(400).json({
                error:"city is required"
            })
        }
        const data = await fetchForecast(city);
        const forecastList = data?.list.map(item =>({
            time:new Date(item?.dt * 1000).toISOString(),
            tempC:item?.main?.temp,
            condition:item?.weather[0]?.main
        }));
        res.json({
            location:{
                city:data?.city?.name,
                country:data.city.country
            },
            forecast:forecastList
        });
    } catch (error) {
        res.status(500).json({
            error:"Failed to fetch forecast data"
        });
    }
}

module.exports = {
    getCurrentWether,
    getForecast
}