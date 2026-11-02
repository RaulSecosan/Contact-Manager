import { useState } from "react";
import "./App.css";

const initialContacts = [
  { id: 1, name: "Alex Popescu", address: "Timisoara, Romania", picture: "" },
  { id: 2, name: "Maria Ionescu", address: "Bucuresti, Romania", picture: "" },
  { id: 3, name: "Andrei Marin", address: "Cluj-Napoca, Romania", picture: "" },
];

function App() {
  const [contacts] = useState(initialContacts);
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand mb-0 h1">Contact Manager</span>
          <button className="btn btn-outline-light">Login</button>
        </div>
      </nav>

      <main className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3">Contacts</h1>
            <p className="text-muted mb-0">Manage your address book</p>
          </div>
          <button className="btn btn-primary" disabled>
            + Add Contact
          </button>
        </div>

        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search contacts by name..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="row g-3">
          {filteredContacts.map((contact) => (
            <div className="col-md-6 col-lg-4" key={contact.id}>
              <div className="card h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="contact-avatar">{contact.name.charAt(0)}</div>
                  <div>
                    <h2 className="h6 mb-1">{contact.name}</h2>
                    <p className="text-muted small mb-0">{contact.address}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <p className="text-center text-muted mt-5">No contacts found.</p>
        )}
      </main>
    </>
  );
}

export default App;
