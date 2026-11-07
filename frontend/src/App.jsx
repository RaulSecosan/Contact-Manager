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
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification]);

  function notify(message, type = "success") {
    setNotification({ message, type });
  }

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

    const isEditing = editingContact !== null;

    const url = isEditing
      ? `/api/contacts/${editingContact.id}`
      : "/api/contacts";

    const method = isEditing ? "PUT" : "POST";

    try {
      let pictureUrl = contact.picture || "";

      // Upload a new picture if one was selected
      if (pictureUrl.startsWith("data:")) {
        const imageResponse = await fetch(pictureUrl);
        const imageBlob = await imageResponse.blob();

        const formData = new FormData();
        const filename =
          imageBlob.type === "image/png" ? "contact.png" : "contact.jpg";

        formData.append("file", imageBlob, filename);

        const uploadResponse = await apiRequest("/api/uploads", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Could not upload picture");
        }

        const uploadData = await uploadResponse.json();
        pictureUrl = uploadData.url;
      }

      // Save contact information
      const response = await apiRequest(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contact.name,
          address: contact.address,
          picture: pictureUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not save contact");
      }

      await loadContacts();
      closeForm();
      notify(
        isEditing
          ? "Contact updated successfully!"
          : "Contact added successfully!",
      );
    } catch (err) {
      notify(err.message, "danger");
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
      notify("Contact deleted successfully!");
    } catch (err) {
      notify(err.message, "danger");
    }
  }

  return (
    <>
      <Navbar
        user={user}
        onLogin={() => setAuthPage("login")}
        onLogout={handleLogout}
      />

      {notification && (
        <div className="container mt-3">
          <div
            className={`alert alert-${notification.type} d-flex align-items-center gap-2`}
            role={notification.type === "danger" ? "alert" : "status"}
          >
            <span aria-hidden="true">
              {notification.type === "success" ? "✓" : "✕"}
            </span>

            <span className="flex-grow-1">{notification.message}</span>

            <button
              type="button"
              className="btn-close"
              aria-label="Close notification"
              onClick={() => setNotification(null)}
            />
          </div>
        </div>
      )}

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
