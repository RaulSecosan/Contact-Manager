import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { apiRequest, refreshCsrf } from "./api";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [authPage, setAuthPage] = useState(null);
  const [error, setError] = useState("");

  // Load contacts from the database
  async function loadContacts() {
    try {
      const response = await fetch("/api/contacts");

      if (!response.ok) {
        throw new Error("Could not load contacts");
      }

      const data = await response.json();
      setContacts(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  // Load contacts and check the current session
  useEffect(() => {
    let cancelled = false;

    fetch("/api/contacts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load contacts");
        }
        return response.json();
      })
      .then((data) => {
        if (!cancelled) {
          setContacts(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
        }
      });

    fetch("/api/auth/me", { credentials: "include" })
      .then((response) => {
        if (response.redirected || !response.ok) {
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (!cancelled) {
          setUser(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Called after successful login
  async function handleLoginSuccess() {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
    });

    if (response.redirected || !response.ok) {
      throw new Error("Could not verify login");
    }

    const data = await response.json();

    setUser(data);
    setAuthPage(null);
    await refreshCsrf();
  }

  // Logout
  async function handleLogout() {
    try {
      await refreshCsrf();

      const response = await apiRequest("/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      setAuthPage(null);
      closeForm();

      await refreshCsrf();
    } catch (err) {
      alert(err.message);
    }
  }

  function openAddForm() {
    if (!user) return;

    setEditingContact(null);
    setShowForm(true);
  }

  function openEditForm(contact) {
    if (!user) return;

    setEditingContact(contact);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingContact(null);
  }

  // Add or update contact
  async function saveContact(contact) {
    if (!user) return;

    if (contact.picture?.startsWith("data:")) {
      alert("Picture upload is not available yet.");
      return;
    }

    const isEditing = editingContact !== null;

    const url = isEditing
      ? `/api/contacts/${editingContact.id}`
      : "/api/contacts";

    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await apiRequest(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contact.name,
          address: contact.address,
          picture: contact.picture,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not save contact");
      }

      await loadContacts();
      closeForm();
    } catch (err) {
      alert(err.message);
    }
  }

  // Delete contact
  async function deleteContact(id) {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?",
    );

    if (!confirmed) return;

    try {
      const response = await apiRequest(`/api/contacts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete contact");
      }

      await loadContacts();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <Navbar
        user={user}
        onLogin={() => setAuthPage("login")}
        onLogout={handleLogout}
      />

      {error && (
        <div className="container mt-3">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      <ContactList
        contacts={contacts}
        isAuthenticated={!!user}
        onAdd={openAddForm}
        onEdit={openEditForm}
        onDelete={deleteContact}
      />

      {showForm && user && (
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
          onSuccess={handleLoginSuccess}
        />
      )}

      {authPage === "register" && (
        <Register
          onClose={() => setAuthPage(null)}
          onLogin={() => setAuthPage("login")}
          onSuccess={() => setAuthPage("login")}
        />
      )}
    </>
  );
}

export default App;
