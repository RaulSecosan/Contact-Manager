
function Navbar({ user, onLogin, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg bg-primary navbar-dark">
      <div className="container">
        <span className="navbar-brand fw-bold">
          Contact Manager
        </span>

        <div className="d-flex align-items-center gap-3">
          {user ? (
            <>
              <span className="text-white small">
                {user.email}
              </span>
              <button
                className="btn btn-light btn-sm"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="btn btn-light btn-sm"
              onClick={onLogin}
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
