import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";



function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [authPage, setAuthPage] = useState(null);

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadContacts() {
      try {
        const response = await fetch("/api/contacts");

        if (!response.ok) {
          throw new Error("Failed to load contacts");
        }

        const data = await response.json();
        setContacts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadContacts();
  }, []);

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
      <Navbar onLogin={() => setAuthPage("login")} />

      {loading && <p className="text-center mt-4">Loading contacts...</p>}

      {error && (
        <div className="container mt-4">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {!loading && !error && (
        <ContactList
          contacts={contacts}
          onAdd={openAddForm}
          onEdit={openEditForm}
          onDelete={deleteContact}
        />
      )}

      {showForm && (
        <ContactForm
          contact={editingContact}
          onSave={saveContact}
          onClose={closeForm}
        />
      )}

      {authPage === "login" && (
        <Login
          onClose={() => setAuthPage(null)}
          onRegister={() => setAuthPage("register")}
        />
      )}

      {authPage === "register" && (
        <Register
          onClose={() => setAuthPage(null)}
          onLogin={() => setAuthPage("login")}
        />
      )}
    </>
  );
}

export default App;
