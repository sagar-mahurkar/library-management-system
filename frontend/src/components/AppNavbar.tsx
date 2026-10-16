import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function AppNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/books", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container-fluid px-4 px-lg-5">
        <Link className="navbar-brand fw-semibold" to="/books">
          <i className="bi bi-book-half me-2" aria-hidden="true" />
          Library Management
        </Link>

        <div className="d-flex align-items-center gap-2 gap-md-3">
          <Link className="nav-link" to="/books">
            Catalogue
          </Link>

          {isAuthenticated && user ? (
            <>
              <span className="small text-secondary d-none d-md-inline">
                {user.name}
              </span>
              <Link
                className="btn btn-sm btn-outline-primary"
                to={user.role === "LIBRARIAN" ? "/librarian" : "/student"}
              >
                Dashboard
              </Link>
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                onClick={signOut}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-sm btn-outline-primary" to="/login">
                Sign in
              </Link>
              <Link className="btn btn-sm btn-primary" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
