import { useState, useEffect } from 'react'

import Countries from './components/Countries'
import Country from './components/Country'
import countryService from './services/countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService.getAll().then((initialCountries) => {
      setCountries(initialCountries)
    })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase()),
  )

  const countryToDisplay =
    selectedCountry ||
    (countriesToShow.length === 1 ? countriesToShow[0] : null)

  return (
    <div>
      <div>
        find countries{' '}
        <input value={filter} onChange={handleFilterChange} />
      </div>

      {filter.length > 0 && countriesToShow.length > 10 && (
        <div>Too many matches, specify another filter</div>
      )}

      {filter.length > 0 &&
        countriesToShow.length > 1 &&
        countriesToShow.length <= 10 &&
        !selectedCountry && (
          <Countries countries={countriesToShow} onShow={setSelectedCountry} />
        )}

      {countryToDisplay && <Country country={countryToDisplay} />}
    </div>
  )
}

export default App
