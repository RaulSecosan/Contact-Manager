
function Navbar({ onLogin }) {
  return (
    <nav className="navbar navbar-dark bg-primary">
      <div className="container">
        <span className="navbar-brand mb-0 h1">
          Contact Manager
        </span>

        <button
          className="btn btn-outline-light"
          onClick={onLogin}
        >
          Login
        </button>
      </div>
    </nav>
  )
}

export default Navbar
