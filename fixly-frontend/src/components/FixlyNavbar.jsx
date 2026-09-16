import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  FaArrowUp,
} from "react-icons/fa";
import "../styles/fixly-navbar.css";
import NotificationBell from "./notifications/NotificationBell";

/* Base for resolving the stored relative profileImage path. Matches the
   convention used by the Profile page: {base}/uploads/{relativePath}. */
const UPLOADS_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

/* ================================================================
   AVATAR — profile image when available, initials fallback.
   Never renders a broken image: onError flips to the initials.
   ================================================================ */
const FixlyAvatar = ({ user, initial, className }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const src =
    user?.profileImage && !imgFailed
      ? `${UPLOADS_BASE}/uploads/${user.profileImage}`
      : null;

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`${className} fnav-avatar-img`}
        onError={() => setImgFailed(true)}
      />
    );
  }
  return <div className={className}>{initial}</div>;
};

/* ================================================================
   SIGN OUT CONFIRMATION MODAL
   Centered, portal-rendered above every navbar layer. Dismissing it
   never logs out — only the explicit confirm button calls onConfirm.
   ================================================================ */
const SignOutModal = ({ open, onCancel, onConfirm }) => {
  const panelRef = useRef(null);
  const confirmRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    confirmRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;

  const handleOverlayMouseDown = (e) => {
    // Clicking inside the panel must not dismiss.
    if (panelRef.current && !panelRef.current.contains(e.target)) onCancel();
  };

  return createPortal(
    <div
      className="fnav-signout-overlay"
      onMouseDown={handleOverlayMouseDown}
      role="presentation">
      <div
        className="fnav-signout-modal"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fnav-signout-title"
        aria-describedby="fnav-signout-desc">
        <button
          type="button"
          className="fnav-signout-close"
          onClick={onCancel}
          aria-label="Close sign out confirmation">
          <FaTimes />
        </button>

        <div className="fnav-signout-icon" aria-hidden="true">
          <FaSignOutAlt />
        </div>

        <h2 id="fnav-signout-title" className="fnav-signout-title">
          Sign out?
        </h2>
        <p id="fnav-signout-desc" className="fnav-signout-desc">
          Are you sure you want to sign out of your Fixly account?
        </p>

        <div className="fnav-signout-actions">
          <button
            type="button"
            className="fnav-signout-cancel"
            onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="fnav-signout-confirm"
            onClick={onConfirm}
            ref={confirmRef}>
            Sign Out
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

/* ================================================================
   BRAND — "Fixly." with the accent dot, as in the reference.
   ================================================================ */
const FixlyWordmark = () => (
  <>
    <span className="fnav-logo-fix">Fix</span>
    <span className="fnav-logo-ly">ly</span>
    <span className="fnav-logo-dot">.</span>
  </>
);

const FixlyNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);
  const navRef = useRef(null);

  /* ===== SCROLL STATE =====
     Drives the "detach into a floating bar" transition from the
     reference video. rAF-throttled so it never thrashes on scroll. */
  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 12);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  /* ===== CLOSE DROPDOWN/DRAWER ON ESCAPE =====
     Skipped while the sign-out modal is open — the modal owns Escape
     in that state (it captures the event before this handler runs). */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && !signOutOpen) {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [signOutOpen]);

  /* ===== LOCK BODY SCROLL WHILE MOBILE SHEET IS OPEN ===== */
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  /* ===== EXISTING LOGOUT — unchanged ===== */
  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    toast.success("You've been signed out. See you soon! 👋", {
      duration: 3500,
    });
    navigate("/login");
  };

  /* Opens the confirmation modal. Does NOT log out. */
  const requestSignOut = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    setSignOutOpen(true);
  };

  /* Only this path calls the existing logout function. */
  const confirmSignOut = () => {
    setSignOutOpen(false);
    handleLogout();
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

  const shellClass = `fnav-shell ${scrolled ? "fnav-scrolled" : ""}`;

  /* ================================================================
     NOT LOGGED IN
     ================================================================ */
  if (!user) {
    return (
      <div className={shellClass} ref={navRef}>
        <nav className="fnav-bar" aria-label="Main navigation">
          <div className="fnav-inner">
            {/* LEFT — LOGO */}
            <div className="fnav-zone fnav-zone-left">
              <Link
                to="/"
                className="fnav-logo"
                onClick={() => setMobileOpen(false)}>
                <FixlyWordmark />
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
                <span className="fnav-status-pill">
                  <span className="fnav-status-dot" aria-hidden="true" />
                  Available
                </span>
                <Link to="/login" className="fnav-btn fnav-btn-ghost">
                  Sign In
                </Link>
                <Link to="/register" className="fnav-btn fnav-btn-solid">
                  Get Started
                  <FaArrowUp className="fnav-btn-arrow" aria-hidden="true" />
                </Link>
              </div>

              {/* MOBILE HAMBURGER (no bell — user isn't logged in) */}
              <div className="fnav-mobile-controls">
                <button
                  className="fnav-hamburger"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                  aria-expanded={mobileOpen}
                  aria-controls="fnav-mobile-sheet">
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
            <div className="fnav-mobile-sheet" id="fnav-mobile-sheet">
              <div className="fnav-sheet-head">
                <span className="fnav-sheet-brand">
                  <FixlyWordmark />
                </span>
                <button
                  className="fnav-sheet-close"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu">
                  <FaTimes />
                </button>
              </div>

              <div className="fnav-mobile-nav">
                <p className="fnav-mobile-section-label">Navigation</p>
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
    <div className={shellClass} ref={navRef}>
      <nav className="fnav-bar" aria-label="Main navigation">
        <div className="fnav-inner">
          {/* LEFT — LOGO */}
          <div className="fnav-zone fnav-zone-left">
            <Link
              to={dashboardPath}
              className="fnav-logo"
              onClick={() => setMobileOpen(false)}>
              <FixlyWordmark />
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
              {/* Role status pill — dot + label, as in the reference */}
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
              <div className="fnav-bell">
                <NotificationBell />
              </div>

              {/* PROFILE DROPDOWN */}
              <div className="fnav-profile-wrap" ref={profileRef}>
                <button
                  className={`fnav-profile-trigger ${profileOpen ? "fnav-trigger-active" : ""}`}
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu">
                  <FixlyAvatar
                    user={user}
                    initial={initial}
                    className="fnav-avatar"
                  />
                  <span className="fnav-trigger-name">
                    {user.fullName.split(" ")[0]}
                  </span>
                  <FaChevronDown
                    className={`fnav-chevron ${profileOpen ? "fnav-chevron-up" : ""}`}
                  />
                </button>

                {profileOpen && (
                  <div className="fnav-dropdown" role="menu">
                    {/* DROPDOWN HEADER */}
                    <div className="fnav-dd-head">
                      <FixlyAvatar
                        user={user}
                        initial={initial}
                        className="fnav-dd-avatar"
                      />
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

                    {/* SIGN OUT — opens confirmation modal, never logs out directly */}
                    <div className="fnav-dd-footer">
                      <button
                        className="fnav-logout-btn"
                        role="menuitem"
                        onClick={requestSignOut}>
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
              <div className="fnav-bell fnotif-mobile-trigger">
                <NotificationBell />
              </div>

              <button
                className="fnav-hamburger"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                aria-controls="fnav-mobile-sheet">
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
          <div className="fnav-mobile-sheet" id="fnav-mobile-sheet">
            {/* USER CARD */}
            <div className="fnav-mobile-user">
              <FixlyAvatar
                user={user}
                initial={initial}
                className="fnav-mobile-avatar"
              />
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

            {/* SIGN OUT — same confirmation modal as desktop */}
            <button className="fnav-mobile-logout" onClick={requestSignOut}>
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </>
      )}

      <SignOutModal
        open={signOutOpen}
        onCancel={() => setSignOutOpen(false)}
        onConfirm={confirmSignOut}
      />
    </div>
  );
};

export default FixlyNavbar;
