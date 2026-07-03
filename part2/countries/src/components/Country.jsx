import { useState, useEffect } from 'react'

import weatherService from '../services/weather'

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (country.capital) {
      weatherService.getWeather(country.capital[0]).then((data) => {
        setWeather(data)
      })
    }
  }, [country])

  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>capital {country.capital.join(', ')}</p>
      <p>area {country.area}</p>

      <h2>languages</h2>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.svg}
        alt={`flag of ${country.name.common}`}
        height="100"
      />

      {weather && (
        <div>
          <h2>Weather in {country.capital[0]}</h2>
          <p>temperature {weather.main.temp} Celcius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default Country
