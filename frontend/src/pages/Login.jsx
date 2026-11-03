import { useState } from "react";

function Login({ onClose, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    // Login will be connected to Spring Boot later
    alert("Login will be available after backend integration.");
  }

  return (
    <div className="modal-backdrop-custom">
      <div
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 id="login-title" className="h4 mb-0">
            Login
          </h2>
          <button className="btn-close" onClick={onClose} aria-label="Close" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="login-email" className="form-label">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100" type="submit">
            Login
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Don't have an account?{" "}
          <button className="btn btn-link p-0" onClick={onRegister}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
