import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  FaChevronDown,
  FaKey,
  FaCog,
  FaSignOutAlt,
  FaQuestionCircle,
  FaEnvelope,
  FaTachometerAlt,
  FaSearch,
  FaClipboardList,
  FaUserTie,
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaListAlt,
} from "react-icons/fa";
import "../styles/fixly-navbar.css";
import NotificationBell from "./notifications/NotificationBell";

const FixlyNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileRef = useRef(null);
  const navRef = useRef(null);

  /* ===== CLOSE ON OUTSIDE CLICK ===== */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (navRef.current && !navRef.current.contains(e.target))
        setMobileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ===== CLOSE MOBILE ON RESIZE ===== */
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth > 900) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  /* ===== CLOSE DROPDOWN/DRAWER ON ESCAPE ===== */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* ===== LOCK BODY SCROLL WHILE MOBILE SHEET IS OPEN ===== */
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    toast.success("You've been signed out. See you soon! 👋", {
      duration: 3500,
    });
    navigate("/login");
  };

  const go = (path) => {
    setProfileOpen(false);
    setMobileOpen(false);
    navigate(path);
  };

  /* ===== ACTIVE ROUTE (UI only — no routing changes) ===== */
  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  /* ===== ROLE HELPERS ===== */
  const dashboardPath = !user
    ? "/"
    : user.role === "ADMIN"
      ? "/admin/dashboard"
      : user.role === "PROVIDER"
        ? "/provider/dashboard"
        : "/user/dashboard";

  const roleLabel =
    user?.role === "ADMIN"
      ? "Administrator"
      : user?.role === "PROVIDER"
        ? "Service Provider"
        : "User";

  const initial = user?.fullName?.charAt(0)?.toUpperCase() || "U";

  /* ================================================================
     NOT LOGGED IN
     ================================================================ */
  if (!user) {
    return (
      <div className="fnav-shell" ref={navRef}>
        <nav className="fnav-bar">
          <div className="fnav-inner">
            {/* LEFT — LOGO */}
            <div className="fnav-zone fnav-zone-left">
              <Link
                to="/"
                className="fnav-logo"
                onClick={() => setMobileOpen(false)}>
                <span className="fnav-logo-fix">Fix</span>
                <span className="fnav-logo-ly">ly</span>
              </Link>
            </div>

            {/* CENTER — NAV */}
            <div className="fnav-zone fnav-zone-center">
              <div className="fnav-desktop-links">
                <Link
                  to="/"
                  className={`fnav-link ${isActive("/") ? "fnav-link-active" : ""}`}>
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`fnav-link ${isActive("/about") ? "fnav-link-active" : ""}`}>
                  About
                </Link>
                <Link
                  to="/how-it-works"
                  className={`fnav-link ${isActive("/how-it-works") ? "fnav-link-active" : ""}`}>
                  How It Works
                </Link>
                <Link
                  to="/contact"
                  className={`fnav-link ${isActive("/contact") ? "fnav-link-active" : ""}`}>
                  Contact
                </Link>
              </div>
            </div>

            {/* RIGHT — ACTIONS */}
            <div className="fnav-zone fnav-zone-right">
              <div className="fnav-desktop-actions">
                <Link to="/login" className="fnav-btn fnav-btn-ghost">
                  Sign In
                </Link>
                <Link to="/register" className="fnav-btn fnav-btn-solid">
                  Get Started
                </Link>
              </div>

              {/* MOBILE HAMBURGER (no bell — user isn't logged in) */}
              <div className="fnav-mobile-controls">
                <button
                  className="fnav-hamburger"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                  aria-expanded={mobileOpen}>
                  {mobileOpen ? <FaTimes /> : <FaBars />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* MOBILE SHEET */}
        {mobileOpen && (
          <>
            <div
              className="fnav-sheet-overlay"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div className="fnav-mobile-sheet">
              <div className="fnav-sheet-head">
                <span className="fnav-sheet-title">Menu</span>
                <button
                  className="fnav-sheet-close"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu">
                  <FaTimes />
                </button>
              </div>

              <div className="fnav-mobile-nav">
                <Link
                  to="/"
                  className={`fnav-mobile-link ${isActive("/") ? "fnav-mobile-link-active" : ""}`}
                  onClick={() => setMobileOpen(false)}>
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`fnav-mobile-link ${isActive("/about") ? "fnav-mobile-link-active" : ""}`}
                  onClick={() => setMobileOpen(false)}>
                  About
                </Link>
                <Link
                  to="/how-it-works"
                  className={`fnav-mobile-link ${isActive("/how-it-works") ? "fnav-mobile-link-active" : ""}`}
                  onClick={() => setMobileOpen(false)}>
                  How It Works
                </Link>
                <Link
                  to="/contact"
                  className={`fnav-mobile-link ${isActive("/contact") ? "fnav-mobile-link-active" : ""}`}
                  onClick={() => setMobileOpen(false)}>
                  Contact
                </Link>
              </div>

              <div className="fnav-mobile-auth-row">
                <Link
                  to="/login"
                  className="fnav-btn fnav-btn-ghost fnav-btn-full"
                  onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="fnav-btn fnav-btn-solid fnav-btn-full"
                  onClick={() => setMobileOpen(false)}>
                  Get Started
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  /* ================================================================
     LOGGED IN
     ================================================================ */
  return (
    <div className="fnav-shell" ref={navRef}>
      <nav className="fnav-bar">
        <div className="fnav-inner">
          {/* LEFT — LOGO */}
          <div className="fnav-zone fnav-zone-left">
            <Link
              to={dashboardPath}
              className="fnav-logo"
              onClick={() => setMobileOpen(false)}>
              <span className="fnav-logo-fix">Fix</span>
              <span className="fnav-logo-ly">ly</span>
            </Link>
          </div>

          {/* CENTER — NAV */}
          <div className="fnav-zone fnav-zone-center">
            <div className="fnav-desktop-links">
              <button
                className={`fnav-link ${isActive(dashboardPath) ? "fnav-link-active" : ""}`}
                onClick={() => go(dashboardPath)}>
                <FaTachometerAlt className="fnav-link-icon" /> Dashboard
              </button>

              {user.role === "USER" && (
                <>
                  <Link
                    to="/search"
                    className={`fnav-link ${isActive("/search") ? "fnav-link-active" : ""}`}>
                    <FaSearch className="fnav-link-icon" /> Book Service
                  </Link>
                  <Link
                    to="/user/bookings"
                    className={`fnav-link ${isActive("/user/bookings") ? "fnav-link-active" : ""}`}>
                    <FaClipboardList className="fnav-link-icon" /> My Bookings
                  </Link>
                </>
              )}

              {user.role === "ADMIN" && (
                <>
                  <Link
                    to="/admin/providers"
                    className={`fnav-link ${isActive("/admin/providers") ? "fnav-link-active" : ""}`}>
                    <FaShieldAlt className="fnav-link-icon" /> Providers
                  </Link>

                  <Link
                    to="/admin/categories"
                    className={`fnav-link ${isActive("/admin/categories") ? "fnav-link-active" : ""}`}>
                    <FaListAlt className="fnav-link-icon" /> Categories
                  </Link>

                  <Link
                    to="/admin/contact"
                    className={`fnav-link ${isActive("/admin/contact") ? "fnav-link-active" : ""}`}>
                    <FaEnvelope className="fnav-link-icon" /> Contact
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* RIGHT — ACTIONS */}
          <div className="fnav-zone fnav-zone-right">
            <div className="fnav-desktop-actions">
              {/* Role status pill (mirrors the reference's "Available" dot) */}
              <span className="fnav-status-pill">
                <span className="fnav-status-dot" aria-hidden="true" />
                {roleLabel}
              </span>

              {user.role === "USER" && (
                <button
                  className="fnav-btn fnav-btn-solid"
                  onClick={() => go("/become-provider")}>
                  <FaUserTie /> Become Provider
                </button>
              )}

              {/* Notification bell (desktop) */}
              <NotificationBell />

              {/* PROFILE DROPDOWN */}
              <div className="fnav-profile-wrap" ref={profileRef}>
                <button
                  className={`fnav-profile-trigger ${profileOpen ? "fnav-trigger-active" : ""}`}
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu">
                  <div className="fnav-avatar">{initial}</div>
                  <FaChevronDown
                    className={`fnav-chevron ${profileOpen ? "fnav-chevron-up" : ""}`}
                  />
                </button>

                {profileOpen && (
                  <div className="fnav-dropdown" role="menu">
                    {/* DROPDOWN HEADER */}
                    <div className="fnav-dd-head">
                      <div className="fnav-dd-avatar">{initial}</div>
                      <div className="fnav-dd-meta">
                        <p className="fnav-dd-name">{user.fullName}</p>
                        <div className="fnav-dd-pills">
                          <span className="fnav-pill fnav-pill-role">
                            <FaUserCircle /> {roleLabel}
                          </span>
                          <span className="fnav-pill fnav-pill-email">
                            <FaEnvelope /> {user.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* DROPDOWN ITEMS */}
                    <div className="fnav-dd-items">
                      <button
                        className="fnav-dd-item"
                        role="menuitem"
                        onClick={() => go("/change-password")}>
                        <span className="fnav-dd-icon fnav-icon-violet">
                          <FaKey />
                        </span>
                        <div className="fnav-dd-item-text">
                          <span className="fnav-dd-item-title">
                            Change Password
                          </span>
                          <span className="fnav-dd-item-sub">
                            Update your account password
                          </span>
                        </div>
                      </button>

                      <button
                        className="fnav-dd-item"
                        role="menuitem"
                        onClick={() => go("/profile")}>
                        <span className="fnav-dd-icon fnav-icon-slate">
                          <FaCog />
                        </span>
                        <div className="fnav-dd-item-text">
                          <span className="fnav-dd-item-title">Settings</span>
                          <span className="fnav-dd-item-sub">
                            Manage your profile
                          </span>
                        </div>
                      </button>

                      <button
                        className="fnav-dd-item"
                        role="menuitem"
                        onClick={() => go("/help-support")}>
                        <span className="fnav-dd-icon fnav-icon-teal">
                          <FaQuestionCircle />
                        </span>
                        <div className="fnav-dd-item-text">
                          <span className="fnav-dd-item-title">
                            Help &amp; Support
                          </span>
                          <span className="fnav-dd-item-sub">
                            Get assistance
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* LOGOUT */}
                    <div className="fnav-dd-footer">
                      <button
                        className="fnav-logout-btn"
                        role="menuitem"
                        onClick={handleLogout}>
                        <span className="fnav-dd-icon fnav-icon-red">
                          <FaSignOutAlt />
                        </span>
                        <div className="fnav-dd-item-text">
                          <span className="fnav-dd-item-title">Sign Out</span>
                          <span className="fnav-dd-item-sub">
                            End your session
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* MOBILE-ONLY CLUSTER: bell + hamburger grouped together so
                flex space-between treats them as one right-aligned unit
                instead of centering the bell between logo and hamburger. */}
            <div className="fnav-mobile-controls">
              <div className="fnotif-mobile-trigger">
                <NotificationBell />
              </div>

              <button
                className="fnav-hamburger"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}>
                {mobileOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE SHEET ===== */}
      {mobileOpen && (
        <>
          <div
            className="fnav-sheet-overlay"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fnav-mobile-sheet">
            {/* USER CARD */}
            <div className="fnav-mobile-user">
              <div className="fnav-mobile-avatar">{initial}</div>
              <div className="fnav-mobile-user-meta">
                <p className="fnav-mobile-uname">{user.fullName}</p>
                <p className="fnav-mobile-uemail">{user.email}</p>
              </div>
              <button
                className="fnav-sheet-close"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu">
                <FaTimes />
              </button>
            </div>

            <span className="fnav-mobile-role-pill">
              <span className="fnav-status-dot" aria-hidden="true" />
              {roleLabel}
            </span>

            {/* NAV LINKS */}
            <div className="fnav-mobile-nav">
              <p className="fnav-mobile-section-label">Navigation</p>

              <button
                className={`fnav-mobile-link ${isActive(dashboardPath) ? "fnav-mobile-link-active" : ""}`}
                onClick={() => go(dashboardPath)}>
                <FaTachometerAlt className="fnav-ml-icon" /> Dashboard
              </button>

              {user.role === "USER" && (
                <>
                  <button
                    className={`fnav-mobile-link ${isActive("/search") ? "fnav-mobile-link-active" : ""}`}
                    onClick={() => go("/search")}>
                    <FaSearch className="fnav-ml-icon" /> Book Service
                  </button>
                  <button
                    className={`fnav-mobile-link ${isActive("/user/bookings") ? "fnav-mobile-link-active" : ""}`}
                    onClick={() => go("/user/bookings")}>
                    <FaClipboardList className="fnav-ml-icon" /> My Bookings
                  </button>
                  <button
                    className="fnav-mobile-link fnav-ml-blue"
                    onClick={() => go("/become-provider")}>
                    <FaUserTie className="fnav-ml-icon" /> Become a Provider
                  </button>
                </>
              )}

              {user.role === "ADMIN" && (
                <>
                  <button
                    className={`fnav-mobile-link ${isActive("/admin/providers") ? "fnav-mobile-link-active" : ""}`}
                    onClick={() => go("/admin/providers")}>
                    <FaShieldAlt className="fnav-ml-icon" />
                    Provider Requests
                  </button>

                  <button
                    className={`fnav-mobile-link ${isActive("/admin/categories") ? "fnav-mobile-link-active" : ""}`}
                    onClick={() => go("/admin/categories")}>
                    <FaListAlt className="fnav-ml-icon" />
                    Service Categories
                  </button>

                  <button
                    className={`fnav-mobile-link ${isActive("/admin/contact") ? "fnav-mobile-link-active" : ""}`}
                    onClick={() => go("/admin/contact")}>
                    <FaEnvelope className="fnav-ml-icon" />
                    Contact Management
                  </button>
                </>
              )}
            </div>

            {/* ACCOUNT LINKS */}
            <div className="fnav-mobile-account">
              <p className="fnav-mobile-section-label">Account</p>
              <button
                className={`fnav-mobile-link ${isActive("/change-password") ? "fnav-mobile-link-active" : ""}`}
                onClick={() => go("/change-password")}>
                <FaKey className="fnav-ml-icon fnav-ml-violet" /> Change
                Password
              </button>

              <button
                className={`fnav-mobile-link ${isActive("/profile") ? "fnav-mobile-link-active" : ""}`}
                onClick={() => go("/profile")}>
                <FaCog className="fnav-ml-icon fnav-ml-slate" /> Settings
              </button>

              <button
                className={`fnav-mobile-link ${isActive("/help-support") ? "fnav-mobile-link-active" : ""}`}
                onClick={() => go("/help-support")}>
                <FaQuestionCircle className="fnav-ml-icon" />
                Help &amp; Support
              </button>
            </div>

            {/* LOGOUT */}
            <button className="fnav-mobile-logout" onClick={handleLogout}>
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FixlyNavbar;
