# Full Stack Weather App

A full-stack weather application built with **Next.js (client)** and **Node.js + Express (server)** that fetches real-time weather and forecast data using the **OpenWeatherMap API**.

---

#  Tech Stack

## Frontend
- Next.js (App Router)
- React
- TanStack Query
- Tailwind CSS
- Axios

## Backend
- Node.js
- Express.js
- Axios
- OpenWeatherMap API

---

#  Features

## Backend (API)

The backend service:

- Exposes endpoints:
  - `GET /api/weather?city=London`
  - `GET /api/weather?lat=..&lon=..`
  - `GET /api/forecast?city=London`

- Calls 3rd-party provider:
  - OpenWeatherMap

### Requirements Implemented

- API key is **NOT exposed** to the frontend
- Basic validation:
  - Empty city check
  - Invalid latitude/longitude check
- Returns clean, normalized JSON response
- Handles API failure and error states

---

# 📊 API Response Format

## Current Weather Example

```json
{
  "location": { "city": "London", "country": "GB" },
  "current": {
    "tempC": 14.2,
    "feelsLikeC": 13.1,
    "condition": "Cloudy",
    "humidity": 72,
    "windKph": 9.4,
    "updatedAt": "2026-01-14T10:00:00Z"
  }
}
Forecast Example
{
  "location": { "city": "London", "country": "GB" },
  "forecast": [
    { "time": "2026-01-14T12:00:00Z", "tempC": 15.0, "condition": "Rain" }
  ]
}
```

Navigate to backend folder

 ``` cd backend  ```

Install dependencies

``` npm install ``` 

Create a .env file

``` PORT=5000 ```
``` OPENWEATHER_API_KEY=your_api_key_here ```

Run Development Server

``` npm run dev```

Run Production Server

``` npm start ```

Frontend Setup
Navigate to frontend folder
cd weather-frontend

Install dependencies

``` npm install ```

Create a .env file

```NEXT_PUBLIC_BACKEND_URL= ```

Run Development Server

```npm run dev```


Frontend runs at:

``` http://localhost:3000 ```

Weather Provider
OpenWeatherMap

Website:

``` https://openweathermap.org/ ```

How to Get an API Key

Create an account
Navigate to "My API Keys"
Generate a new API key
Add it inside backend .env file

User Experience
Search weather by city name
Use browser geolocation (current location)
Loading state
Error handling (invalid city, API failure)
Responsive layout (mobile-friendly)
Displays next 5 forecast time points

⚠ Assumptions & Limitations
Forecast currently works only with city name
Free OpenWeatherMap plan may have rate limits
Geolocation requires browser permission
No backend caching implemented
No authentication required


Deployment 
Server (Vercel)

Example:
``` https://your-backend.vercel.app ```

client (Vercel)

Example:
``` https://your-frontend.vercel.app ```




