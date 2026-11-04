function ContactCard({ contact, onEdit, onDelete, isAuthenticated }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100">
        <div className="card-body d-flex align-items-center gap-3">
          {contact.picture ? (
            <img
              src={contact.picture}
              alt={contact.name}
              className="contact-avatar"
            />
          ) : (
            <div className="contact-avatar">{contact.name.charAt(0)}</div>
          )}

          <div className="flex-grow-1">
            <h2 className="h6 mb-1">{contact.name}</h2>
            <p className="text-muted small mb-0">{contact.address}</p>
          </div>

          {isAuthenticated && (
            <div className="dropdown">
              <button
                className="btn btn-sm btn-light"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label={`Options for ${contact.name}`}
              >
                ⋮
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => onEdit(contact)}
                  >
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => onDelete(contact.id)}
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactCard;
