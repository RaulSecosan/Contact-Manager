import { useState } from "react";
import ContactCard from "./ContactCard";
import ExportButton from "./ExportButton";

function ContactList({ contacts, isAuthenticated, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3">Contacts</h1>
          <p className="text-muted mb-0">Manage your address book</p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <ExportButton contacts={contacts} />

          {isAuthenticated && (
            <button className="btn btn-primary" onClick={onAdd}>
              Add Contact
            </button>
          )}
        </div>
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
          <ContactCard
            key={contact.id}
            contact={contact}
            isAuthenticated={isAuthenticated}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <p className="text-center text-muted mt-5">No contacts found.</p>
      )}
    </main>
  );
}

export default ContactList;
