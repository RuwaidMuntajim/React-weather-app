import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import ForeignWeather from './ForeignWeather';


const HomeWeather = () => {
    const [degree, setDegree] = useState("...");
    const [condition, setCondition] = useState('loading');
    const [location, setLocation] = useState('loading');
    const [humidity, setHumidity] = useState('loading');
    const [windSpeed, setWindSpeed] = useState('loading');
    const [feelsLike, setFeelsLike] = useState('loading');
    const [pressure, setPressure] = useState('loading');
    const [uv, setUv] = useState('loading');
    const [gustMph, setGustMph] = useState('loading');
    const [icon, setIcon] = useState(null);
    const [forecasts, setForecasts] = useState([]);
    const [forecastsTime, setForecastsTime] = useState([]);
    const cities = ['London', 'Istanbul', 'Rome', 'Dhaka', 'Beijing']
    const [cityWeather, setCityWeather] = useState([]);
    const glassDesign = {
        background: 'rgba(255, 255, 255, 0.2)'
    };


    useEffect(() => {

        const getWeather = async(lat, long) => {
            const response = await Axios.get(`https://api.weatherapi.com/v1/forecast.json?key=afa25d6fe83f414ea34180854212208&q=${lat},${long}&aqi=yes`);
            const data = await response.data;
            console.log(data);
            if (response.status === 200) {

                const forecastwea = data.forecast.forecastday[0].hour;

                setDegree(data.current.temp_c);
                setCondition(data.current.condition.text);
                setLocation(`${data.location.name}, ${data.location.country}`);
                setHumidity(data.current.humidity);
                setWindSpeed(data.current.wind_mph);
                setFeelsLike(data.current.feelslike_c);
                setGustMph(data.current.gust_mph);
                setPressure(data.current.pressure_in);
                setIcon(data.current.condition.icon);
                setUv(data.current.uv);


                for (let i = 0; i <= 23; i++) {
                    forecasts.push(forecastwea[i].temp_c);
                    forecastsTime.push(forecastwea[i].time);
                };

                setForecasts(forecasts);
                setForecastsTime(forecastsTime);

            } else {
                throw new Error("There was an Error");
            };
        };

        const getMoreCityWeather = async(city) => {
            const response = await Axios.get(`https://api.weatherapi.com/v1/forecast.json?key=afa25d6fe83f414ea34180854212208&q=${city}&aqi=yes`);
            const data = response.data;
            return data;
        }



        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                let lat = position.coords.latitude;
                let long = position.coords.longitude;
                getWeather(lat, long);
            });
        }

        cities.forEach(city => {
            getMoreCityWeather(city).then((data) => {
                cityWeather.push({
                    key: Math.random() * 1000,
                    city: data.location.name,
                    temp_c: data.current.temp_c,
                    condition: data.current.condition.text,
                    icon: data.current.condition.icon
                });
            });
        });
        setCityWeather([...cityWeather]);

    }, []);

    return (

        <div className="bg-blue-500">
            <div className="homeweather h-screen w-screen bg-blue-500 text-white">
                <div className="container flex bg-blue-500 h-2/4 flex-wrap flex-1 sm:flex-nowrap">
                    <div className="weather-condition h-full flex-1 flex flex-nowrap justify-evenly items-center font-semibold text-white">
                        <div className="flex flex-col justify-center items-start mr-3">
                            <p className="lg:text-5xl mb-3 md:text-4xl text-2xl">{condition}</p>
                            <p className="lg:text-2xl md:text-2xl text-xl">{location}</p>    
                        </div>
                        <div className="flex justify-center items-center lg:text-8xl md:text-7xl sm:text-6xl text-4xl">
                            <p>{`${degree}°C`}</p>
                        </div>
                    </div>
                    <div className="weather-condition-img h-full w-2/4 flex-1 flex justify-center items-center">
                        {icon && <img src={`https://${icon}`} alt="Windy day" style={{objectFit: 'contain', height: '20vh', width: '20vh'}}/>}
                    </div>
                </div>
                <div className="container flex flex-col sm:flex-row items-center bg-blue-500 h-2/4 space-x-2">
                    <div className="flex-auto w-full h-5/6 sm:w-1/4 rounded-xl flex flex-col justify-center pl-4 font-semibold text-gray-200 lg:text-xl md:text-sm sm:text-xs mb-2" style={glassDesign}>
                        <p className="flex justify-center items-center text-2xl mb-2">Details</p>
                        <p>Humidity: {humidity}</p>
                        <p>Wind speed: {windSpeed} mph</p>
                        <p>Feels like: {feelsLike} °C</p>
                        <p>pressure: {pressure} atm</p>
                        <p>UV: {uv}</p>
                        <p>gust_mph: {gustMph} mph</p>
                    </div>
                    <div className="hidden sm:flex  flex-column items-center flex-auto w-full h-5/6 sm:w-3/4 rounded-xl space-x-1" style={glassDesign}>
                        <h2>Other cities</h2>
                        <div className="other-cities flex flex-auto justify-center items-center h-full w-full space-x-1">
                            {cityWeather.length ? 
                                cityWeather.map(cityWea => (
                                <ForeignWeather cityWeather={cityWea} key={cityWea.key}/>
                            )) : <h1>Loading...</h1>
                        }
                        </div>        
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default HomeWeather;
