import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

import {
  FaChevronDown,
  FaKey,
  FaCog,
  FaSignOutAlt,
  FaQuestionCircle,
  FaGraduationCap,
  FaEnvelope,
} from "react-icons/fa";

import "../styles/fixly-navbar.css";

const FixlyNavbar = () => {
  /* ================= HOOKS (ALWAYS TOP) ================= */
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const profileRef = useRef(null);
  const menuRef = useRef(null);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully 👋");
    navigate("/login");
  };

  /* ================= NOT LOGGED IN ================= */
  if (!user) {
    return (
      <Navbar expand="lg" sticky="top" className="fixly-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fixly-logo">
            Fix<span>ly</span>
          </Navbar.Brand>

          <Navbar.Toggle onClick={() => setMenuOpen(!menuOpen)} />

          <Navbar.Collapse in={menuOpen} ref={menuRef}>
            <Nav className="ms-auto gap-3">
              <Nav.Link as={Link} to="/" className="nav-link-custom">
                Home
              </Nav.Link>

              <Nav.Link as={Link} to="/login" className="nav-btn secondary">
                Login
              </Nav.Link>

              <Nav.Link as={Link} to="/register" className="nav-btn primary">
                Register
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  /* ================= LOGGED IN ================= */
  const fullName = user.fullName;
  const email = user.email;
  const role = user.role;
  const initial = fullName.charAt(0).toUpperCase();

  const dashboardPath =
    role === "ADMIN"
      ? "/admin/dashboard"
      : role === "PROVIDER"
      ? "/provider/dashboard"
      : "/user/dashboard";

  return (
    <Navbar expand="lg" sticky="top" className="fixly-navbar">
      <Container>
        <Navbar.Brand as={Link} to={dashboardPath} className="fixly-logo">
          Fix<span>ly</span>
        </Navbar.Brand>

        <Navbar.Toggle onClick={() => setMenuOpen(!menuOpen)} />

        <Navbar.Collapse in={menuOpen} ref={menuRef}>
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link
              className="nav-link-custom"
              onClick={() => navigate(dashboardPath)}>
              Dashboard
            </Nav.Link>

            {role === "USER" && (
              <>
                <Nav.Link as={Link} to="/search" className="nav-link-custom">
                  Book Service
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/user/bookings"
                  className="nav-link-custom">
                  My Bookings
                </Nav.Link>

                <button
                  className="become-provider-btn"
                  onClick={() => navigate("/become-provider")}>
                  Become Provider
                </button>
              </>
            )}

            {/* ================= PROFILE ================= */}
            <div ref={profileRef} className="profile-wrapper">
              <div
                className={`profile-trigger ${profileOpen ? "active" : ""}`}
                onClick={() => setProfileOpen(!profileOpen)}>
                <div className="profile-avatar">{initial}</div>
                <span className="profile-name">{fullName}</span>
                <FaChevronDown
                  className={`arrow ${profileOpen ? "rotate" : ""}`}
                />
              </div>

              {profileOpen && (
                <div className="profile-dropdown">
                  {/* HEADER */}
                  <div className="dropdown-header">
                    <div className="profile-avatar big">{initial}</div>

                    <div className="header-text">
                      <h4 className="profile-name">{fullName}</h4>

                      <div className="header-meta">
                        <span className="role">
                          <FaGraduationCap /> {role}
                        </span>

                        <span className="email">
                          <FaEnvelope /> {email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* LINKS */}
                  <div className="dropdown-list">
                    <div
                      className="dropdown-link"
                      onClick={() => navigate("/change-password")}>
                      <span className="icon-box password">
                        <FaKey />
                      </span>
                      <div className="link-text">
                        <span className="title">Change Password</span>
                        <span className="sub">
                          Update your account password
                        </span>
                      </div>
                    </div>

                    <div
                      className="dropdown-link"
                      onClick={() => navigate("/profile")}>
                      <span className="icon-box settings">
                        <FaCog />
                      </span>

                      <div className="link-text">
                        <span className="title">Settings</span>
                        <span className="sub">Manage your profile</span>
                      </div>
                    </div>

                    <div className="dropdown-link disabled">
                      <span className="icon-box help">
                        <FaQuestionCircle />
                      </span>
                      <div className="link-text">
                        <span className="title">Help & Support</span>
                        <span className="sub">Get assistance</span>
                      </div>
                    </div>
                  </div>

                  {/* LOGOUT */}
                  <button className="logout-btn" onClick={handleLogout}>
                    <span className="icon-box logout">
                      <FaSignOutAlt />
                    </span>
                    <div className="link-text">
                      <span className="title">Sign Out</span>
                      <span className="sub">End your session</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default FixlyNavbar;
