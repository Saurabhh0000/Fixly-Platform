import {
  FaCalendarCheck,
  FaSearch,
  FaHeadset,
  FaUser,
  FaHeart,
  FaShieldAlt,
  FaLock,
  FaCreditCard,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/fixly-user-footer.css";

/* Trust indicators — same three concepts as before, restyled as
   compact checkmark-style indicators rather than basic pills. */
const TRUST_INDICATORS = [
  { key: "verified", label: "Verified Professionals", icon: <FaShieldAlt /> },
  { key: "secure", label: "Secure Booking", icon: <FaLock /> },
  { key: "payments", label: "Easy Payments", icon: <FaCreditCard /> },
];

/* Existing, unchanged routes — only navigate() targets, nothing invented. */
const QUICK_ACTIONS = [
  {
    key: "search",
    label: "Search Services",
    to: "/search",
    icon: <FaSearch />,
  },
  {
    key: "bookings",
    label: "My Bookings",
    to: "/user/bookings",
    icon: <FaCalendarCheck />,
  },
  { key: "profile", label: "Profile", to: "/profile", icon: <FaUser /> },
  {
    key: "support",
    label: "Help & Support",
    to: "/help-support",
    icon: <FaHeadset />,
  },
];

const UserFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="user-footer">
      <div className="user-footer-inner">
        <div className="user-footer-top">
          {/* ===== BRAND + TRUST ===== */}
          <div className="user-footer-brand">
            <h3 className="user-footer-logo">
              Fix<span>ly</span>
            </h3>

            <p className="user-footer-tagline">
              Trusted home services, made simple.
            </p>

            <p className="user-footer-desc">
              Book verified professionals for plumbing, electrical, cleaning,
              and more — fast, reliable, and stress-free.
            </p>

            <ul className="user-footer-trust">
              {TRUST_INDICATORS.map((item) => (
                <li key={item.key} className="user-footer-trust-item">
                  <span className="user-footer-trust-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* ===== QUICK ACTIONS ===== */}
          <nav className="user-footer-actions" aria-label="Account quick links">
            <h4 className="user-footer-actions-title">Quick Links</h4>
            <ul className="user-footer-action-list">
              {QUICK_ACTIONS.map((action) => (
                <li key={action.key}>
                  <button
                    type="button"
                    className="user-footer-action-btn"
                    onClick={() => navigate(action.to)}
                    aria-label={action.label}>
                    <span
                      className="user-footer-action-icon"
                      aria-hidden="true">
                      {action.icon}
                    </span>
                    {action.label}
                  </button>
                </li>
              ))}
            </ul>

            <p className="user-footer-support-note">
              Need help with a booking? Our support team is here to help.
            </p>
          </nav>
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="user-footer-bottom">
          <p className="user-footer-bottom-text">
            Made with{" "}
            <FaHeart className="user-footer-heart" aria-hidden="true" /> for
            happier homes
          </p>
          <p className="user-footer-bottom-text">
            © {new Date().getFullYear()} Fixly
          </p>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
