
import { useState } from 'react'

function ContactForm({ onSave, onClose }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [picture, setPicture] = useState('')

  function handlePicture(event) {
    const file = event.target.files[0]

    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please select a JPG, PNG or WebP image.')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('The image must be smaller than 5 MB.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => setPicture(reader.result)
    reader.readAsDataURL(file)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!name.trim() || !address.trim()) return

    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      address: address.trim(),
      picture
    })
  }

  return (
    <div className="modal-backdrop-custom">
      <div className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-form-title">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 id="contact-form-title" className="h4 mb-0">Add Contact</h2>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="contact-name" className="form-label">Name *</label>
            <input
              id="contact-name"
              className="form-control"
              value={name}
              onChange={event => setName(event.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contact-address" className="form-label">Address *</label>
            <input
              id="contact-address"
              className="form-control"
              value={address}
              onChange={event => setAddress(event.target.value)}
              maxLength={255}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contact-picture" className="form-label">Picture (optional)</label>
            <input
              id="contact-picture"
              type="file"
              className="form-control"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePicture}
            />

            {picture && (
              <img src={picture} alt="Preview" className="contact-avatar mt-3" />
            )}
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
