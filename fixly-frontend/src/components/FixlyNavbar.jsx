import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  FaChevronDown,
  FaKey,
  FaCog,
  FaSignOutAlt,
  FaQuestionCircle,
  FaEnvelope,
  FaBolt,
  FaTachometerAlt,
  FaSearch,
  FaClipboardList,
  FaUserTie,
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import "../styles/fixly-navbar.css";

const FixlyNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
      <nav className="fnav-bar" ref={navRef}>
        <div className="fnav-inner">
          {/* LOGO */}
          <Link
            to="/"
            className="fnav-logo"
            onClick={() => setMobileOpen(false)}>
            <div className="fnav-logo-badge">
              <span className="fnav-logo-fix">Fix</span>
              <span className="fnav-logo-ly">ly</span>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="fnav-desktop-links">
            <Link to="/" className="fnav-link">
              Home
            </Link>
            <Link to="/login" className="fnav-btn fnav-btn-outline">
              Sign In
            </Link>
            <Link to="/register" className="fnav-btn fnav-btn-solid">
              Get Started
            </Link>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            className="fnav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu">
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* MOBILE DRAWER */}
        {mobileOpen && (
          <div className="fnav-mobile-drawer">
            <Link
              to="/"
              className="fnav-mobile-link"
              onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <div className="fnav-mobile-auth-row">
              <Link
                to="/login"
                className="fnav-btn fnav-btn-outline fnav-btn-full"
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
        )}
      </nav>
    );
  }

  /* ================================================================
     LOGGED IN
     ================================================================ */
  return (
    <nav className="fnav-bar" ref={navRef}>
      <div className="fnav-inner">
        {/* LOGO */}
        <Link
          to={dashboardPath}
          className="fnav-logo"
          onClick={() => setMobileOpen(false)}>
          <div className="fnav-logo-badge">
            <span className="fnav-logo-fix">Fix</span>
            <span className="fnav-logo-ly">ly</span>
          </div>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="fnav-desktop-links">
          <button className="fnav-link" onClick={() => go(dashboardPath)}>
            <FaTachometerAlt className="fnav-link-icon" /> Dashboard
          </button>

          {user.role === "USER" && (
            <>
              <Link to="/search" className="fnav-link">
                <FaSearch className="fnav-link-icon" /> Book Service
              </Link>
              <Link to="/user/bookings" className="fnav-link">
                <FaClipboardList className="fnav-link-icon" /> My Bookings
              </Link>
              <button
                className="fnav-btn fnav-btn-blue"
                onClick={() => go("/become-provider")}>
                <FaUserTie /> Become Provider
              </button>
            </>
          )}

          {user.role === "ADMIN" && (
            <Link to="/admin/providers" className="fnav-link">
              <FaShieldAlt className="fnav-link-icon" /> Provider Requests
            </Link>
          )}

          {/* PROFILE DROPDOWN */}
          <div className="fnav-profile-wrap" ref={profileRef}>
            <button
              className={`fnav-profile-trigger ${profileOpen ? "fnav-trigger-active" : ""}`}
              onClick={() => setProfileOpen(!profileOpen)}>
              <div className="fnav-avatar">{initial}</div>
              <span className="fnav-trigger-name">
                {user.fullName.split(" ")[0]}
              </span>
              <FaChevronDown
                className={`fnav-chevron ${profileOpen ? "fnav-chevron-up" : ""}`}
              />
            </button>

            {profileOpen && (
              <div className="fnav-dropdown">
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
                    className="fnav-dd-item fnav-dd-item-disabled"
                    disabled>
                    <span className="fnav-dd-icon fnav-icon-teal">
                      <FaQuestionCircle />
                    </span>
                    <div className="fnav-dd-item-text">
                      <span className="fnav-dd-item-title">Help & Support</span>
                      <span className="fnav-dd-item-sub">Get assistance</span>
                    </div>
                  </button>
                </div>

                {/* LOGOUT */}
                <div className="fnav-dd-footer">
                  <button className="fnav-logout-btn" onClick={handleLogout}>
                    <span className="fnav-dd-icon fnav-icon-red">
                      <FaSignOutAlt />
                    </span>
                    <div className="fnav-dd-item-text">
                      <span className="fnav-dd-item-title">Sign Out</span>
                      <span className="fnav-dd-item-sub">End your session</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="fnav-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu">
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* ===== MOBILE DRAWER ===== */}
      {mobileOpen && (
        <div className="fnav-mobile-drawer">
          {/* USER CARD */}
          <div className="fnav-mobile-user">
            <div className="fnav-mobile-avatar">{initial}</div>
            <div>
              <p className="fnav-mobile-uname">{user.fullName}</p>
              <p className="fnav-mobile-uemail">{user.email}</p>
            </div>
            <span className="fnav-mobile-role-pill">{roleLabel}</span>
          </div>

          {/* NAV LINKS */}
          <div className="fnav-mobile-nav">
            <button
              className="fnav-mobile-link"
              onClick={() => go(dashboardPath)}>
              <FaTachometerAlt className="fnav-ml-icon" /> Dashboard
            </button>

            {user.role === "USER" && (
              <>
                <button
                  className="fnav-mobile-link"
                  onClick={() => go("/search")}>
                  <FaSearch className="fnav-ml-icon" /> Book Service
                </button>
                <button
                  className="fnav-mobile-link"
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
              <button
                className="fnav-mobile-link"
                onClick={() => go("/admin/providers")}>
                <FaShieldAlt className="fnav-ml-icon" /> Provider Requests
              </button>
            )}
          </div>

          {/* ACCOUNT LINKS */}
          <div className="fnav-mobile-account">
            <p className="fnav-mobile-section-label">Account</p>
            <button
              className="fnav-mobile-link"
              onClick={() => go("/change-password")}>
              <FaKey className="fnav-ml-icon fnav-ml-violet" /> Change Password
            </button>
            <button className="fnav-mobile-link" onClick={() => go("/profile")}>
              <FaCog className="fnav-ml-icon fnav-ml-slate" /> Settings
            </button>
          </div>

          {/* LOGOUT */}
          <button className="fnav-mobile-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default FixlyNavbar;
