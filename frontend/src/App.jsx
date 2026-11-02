import { useState } from "react";
import Navbar from "./components/Navbar";
import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";
import "./App.css";

const initialContacts = [
  { id: 1, name: "Alex Popescu", address: "Timisoara, Romania", picture: "" },
  { id: 2, name: "Maria Ionescu", address: "Bucuresti, Romania", picture: "" },
  { id: 3, name: "Andrei Marin", address: "Cluj-Napoca, Romania", picture: "" },
];

function App() {
  const [contacts, setContacts] = useState(initialContacts);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  function openAddForm() {
    setEditingContact(null);
    setShowForm(true);
  }

  function openEditForm(contact) {
    setEditingContact(contact);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingContact(null);
  }

  function saveContact(contact) {
    if (editingContact) {
      setContacts((previousContacts) =>
        previousContacts.map((item) =>
          item.id === contact.id ? contact : item,
        ),
      );
    } else {
      setContacts((previousContacts) => [...previousContacts, contact]);
    }

    closeForm();
  }

  function deleteContact(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?",
    );

    if (!confirmed) return;

    setContacts((previousContacts) =>
      previousContacts.filter((contact) => contact.id !== id),
    );
  }

  return (
    <>
      <Navbar />

      <ContactList
        contacts={contacts}
        onAdd={openAddForm}
        onEdit={openEditForm}
        onDelete={deleteContact}
      />

      {showForm && (
        <ContactForm
          contact={editingContact}
          onSave={saveContact}
          onClose={closeForm}
        />
      )}
    </>
  );
}

export default App;
