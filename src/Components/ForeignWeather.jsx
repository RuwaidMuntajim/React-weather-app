import React from 'react'

const ForeignWeather = ({cityWeather}) => {
    return (
        <div className="flex-auto h-3/4">
            <img src={`https://${cityWeather.icon}`} alt="icon" />
            <h2>{cityWeather.temp_c}°C</h2>
            <p>{cityWeather.city}</p>
            <p>{cityWeather.condition}</p>
        </div>
    )
}

export default ForeignWeather
