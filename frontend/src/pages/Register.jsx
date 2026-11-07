import { useState } from "react";
import { apiRequest, refreshCsrf } from "../api";

function Register({ onClose, onLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await refreshCsrf();

      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.status === 409) {
        throw new Error("Username or email already exists");
      }

      if (!response.ok) {
        throw new Error("Could not create account");
      }

      setSuccess(true);
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Create account</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center gap-2"
                  role="alert"
                >
                  <span aria-hidden="true">✕</span>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div
                  className="alert alert-success d-flex align-items-center gap-2"
                  role="status"
                >
                  <span aria-hidden="true">✓</span>
                  <span>Account created successfully!</span>
                </div>
              )}

              {!success && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      maxLength={50}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={8}
                      required
                    />
                  </div>

                  <p className="mb-0">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={onLogin}
                    >
                      Login
                    </button>
                  </p>
                </>
              )}

              {success && (
                <p className="text-muted mb-0">
                  You can now log in with your account.
                </p>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
              >
                Close
              </button>

              {success ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onLogin}
                >
                  Go to Login
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Register"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
