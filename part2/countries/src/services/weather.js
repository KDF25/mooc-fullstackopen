import axios from 'axios'

const getWeather = (capital) =>
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${import.meta.env.VITE_SOME_KEY}&units=metric`,
    )
    .then((response) => response.data)

export default { getWeather }
