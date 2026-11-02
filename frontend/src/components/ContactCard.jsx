
function ContactCard({ contact }) {
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
            <div className="contact-avatar">
              {contact.name.charAt(0)}
            </div>
          )}

          <div>
            <h2 className="h6 mb-1">{contact.name}</h2>
            <p className="text-muted small mb-0">
              {contact.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactCard
