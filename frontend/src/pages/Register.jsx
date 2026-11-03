import { useState } from "react";

function Register({ onClose, onLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    // Registration will be connected to Spring Boot later
    alert("Registration will be available after backend integration.");
  }

  return (
    <div className="modal-backdrop-custom">
      <div
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 id="register-title" className="h4 mb-0">
            Create Account
          </h2>
          <button className="btn-close" onClick={onClose} aria-label="Close" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="register-username" className="form-label">
              Username
            </label>
            <input
              id="register-username"
              className="form-control"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              maxLength={50}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="register-email" className="form-label">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              className="form-control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="register-password" className="form-label">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="register-confirm" className="form-label">
              Confirm Password
            </label>
            <input
              id="register-confirm"
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100" type="submit">
            Create Account
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <button className="btn btn-link p-0" onClick={onLogin}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
