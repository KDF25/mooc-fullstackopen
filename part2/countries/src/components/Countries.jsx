const Countries = ({ countries, onShow }) => {
  return (
    <div>
      {countries.map((country) => (
        <div key={country.name.common}>
          {country.name.common}{' '}
          <button onClick={() => onShow(country)}>show</button>
        </div>
      ))}
    </div>
  )
}

export default Countries
