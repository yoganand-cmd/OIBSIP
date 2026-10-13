
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `nav-link px-3 py-2 rounded-3 ${
      isActive ? "active fw-semibold" : ""
    }`;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top"
      style={{
        background: "#211613",
        borderBottom: "1px solid rgba(255, 179, 71, 0.2)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
      }}
    >
      <div className="container py-2">
        {/* Brand */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2 me-lg-4"
          to="/"
          style={{ fontSize: "1.35rem", letterSpacing: "-0.5px" }}
        >
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-3"
            style={{
              width: "42px",
              height: "42px",
              background: "rgba(255, 173, 66, 0.13)",
              fontSize: "1.5rem",
            }}
          >
            🍕
          </span>
          <span>
            Pizza <span style={{ color: "#ffb347" }}>Delivery</span>
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="navbar-toggler shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: "rgba(255,255,255,0.25)" }}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Navigation */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto my-3 my-lg-0 gap-lg-1">
            <li className="nav-item">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/pizzas" className={navLinkClass}>
                Pizzas
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/cart" className={navLinkClass}>
                <span className="me-1" aria-hidden="true">🛒</span>
                Cart
              </NavLink>
            </li>

            {user && (
              <li className="nav-item">
                <NavLink to="/orders" className={navLinkClass}>
                  My Orders
                </NavLink>
              </li>
            )}

            {user?.role === "admin" && (
              <li className="nav-item">
                <NavLink to="/admin" className={navLinkClass}>
                  Admin Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          {/* Account actions */}
          <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 pb-3 pb-lg-0">
            {user ? (
              <>
                <span
                  className="text-white-50 small me-lg-2"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Welcome,{" "}
                  <span className="text-white fw-semibold">
                    {user.name}
                  </span>
                </span>

                <button
                  className="btn btn-sm fw-semibold px-3"
                  onClick={logout}
                  style={{
                    color: "#ffcf91",
                    border: "1px solid rgba(255, 179, 71, 0.55)",
                    borderRadius: "9px",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="btn btn-sm fw-semibold px-3"
                  to="/login"
                  style={{
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.35)",
                    borderRadius: "9px",
                  }}
                >
                  Login
                </Link>

                <Link
                  className="btn btn-sm fw-bold px-3"
                  to="/register"
                  style={{
                    color: "#241512",
                    background: "#ffb347",
                    border: "1px solid #ffb347",
                    borderRadius: "9px",
                  }}
                >
                  Get Started →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .navbar .nav-link {
          color: #d5c8c2;
          transition: color 180ms ease, background 180ms ease;
        }

        .navbar .nav-link:hover,
        .navbar .nav-link.active {
          color: #ffb347;
          background: rgba(255, 179, 71, 0.10);
        }

        .navbar .navbar-brand:hover {
          color: #fffaf4;
        }

        @media (max-width: 991.98px) {
          .navbar .navbar-collapse {
            padding-top: 12px;
          }

          .navbar .nav-link {
            padding-left: 12px !important;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
