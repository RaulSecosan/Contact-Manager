import { useState } from "react";

function ContactForm({ contact, onSave, onClose }) {
  const [name, setName] = useState(contact?.name || "");
  const [address, setAddress] = useState(contact?.address || "");
  const [picture, setPicture] = useState(contact?.picture || "");
  const [fileError, setFileError] = useState("");

  const isEditing = Boolean(contact);

  function handlePicture(event) {
    const file = event.target.files[0];

    setFileError("");
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setFileError("Please select a JPG or PNG image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("The image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPicture(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !address.trim()) return;

    onSave({
      id: contact?.id || crypto.randomUUID(),
      name: name.trim(),
      address: address.trim(),
      picture,
    });
  }

  return (
    <div className="modal-backdrop-custom">
      <div
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-form-title"
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 id="contact-form-title" className="h4 mb-0">
            {isEditing ? "Edit Contact" : "Add Contact"}
          </h2>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="contact-name" className="form-label">
              Name *
            </label>
            <input
              id="contact-name"
              className="form-control"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contact-address" className="form-label">
              Address *
            </label>
            <input
              id="contact-address"
              className="form-control"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              maxLength={255}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contact-picture" className="form-label">
              Picture (optional)
            </label>
            <input
              id="contact-picture"
              type="file"
              className="form-control"
              accept="image/png,image/jpeg"
              onChange={handlePicture}
            />
            {fileError && (
              <div className="alert alert-danger mt-2" role="alert">
                ✕ {fileError}
              </div>
            )}
            {picture && (
              <div className="d-flex align-items-center gap-3 mt-3">
                <img src={picture} alt="Preview" className="contact-avatar" />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setPicture("")}
                >
                  Remove picture
                </button>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Save Changes" : "Save Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
