import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existing = persons.find((person) => person.name === newName)

    if (existing) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        const changedPerson = { ...existing, number: newNumber }

        personService
          .update(existing.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === existing.id ? returnedPerson : person,
              ),
            )
            setNewName('')
            setNewNumber('')
            showNotification(`Updated ${returnedPerson.name}`, 'success')
          })
          .catch((error) => {
            if (error.response?.data?.error) {
              showNotification(error.response.data.error, 'error')
              return
            }

            showNotification(
              `Information of '${existing.name}' was already removed from server`,
              'error',
            )
            setPersons(persons.filter((person) => person.id !== existing.id))
          })
      }
      return
    }

    personService
      .create({ name: newName, number: newNumber })
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`Added ${returnedPerson.name}`, 'success')
      })
      .catch((error) => {
        showNotification(error.response.data.error, 'error')
      })
  }

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id)

    if (window.confirm('Delete this person?')) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id))
        })
        .catch(() => {
          showNotification(
            `Information of '${person.name}' was already removed from server`,
            'error',
          )
          setPersons(persons.filter((p) => p.id !== id))
        })
    }
  }

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification
        message={notification.message}
        type={notification.type}
      />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App
