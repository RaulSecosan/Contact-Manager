
import { useState } from 'react'
import Navbar from './components/Navbar'
import ContactList from './components/ContactList'
import ContactForm from './components/ContactForm'
import './App.css'

const initialContacts = [
  { id: 1, name: 'Alex Popescu', address: 'Timisoara, Romania', picture: '' },
  { id: 2, name: 'Maria Ionescu', address: 'Bucuresti, Romania', picture: '' },
  { id: 3, name: 'Andrei Marin', address: 'Cluj-Napoca, Romania', picture: '' }
]

function App() {
  const [contacts, setContacts] = useState(initialContacts)
  const [showForm, setShowForm] = useState(false)

  function addContact(contact) {
    setContacts(previousContacts => [...previousContacts, contact])
    setShowForm(false)
  }

  return (
    <>
      <Navbar />

      <ContactList
        contacts={contacts}
        onAdd={() => setShowForm(true)}
      />

      {showForm && (
        <ContactForm
          onSave={addContact}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  )
}

export default App
