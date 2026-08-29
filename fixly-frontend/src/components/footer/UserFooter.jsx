import {
  FaCalendarCheck,
  FaSearch,
  FaHeadset,
  FaUser,
  FaHeart,
  FaShieldAlt,
  FaLock,
  FaCreditCard,
  FaStar,
  FaBell,
  FaKey,
  FaWrench,
  FaBolt,
  FaBroom,
  FaSnowflake,
  FaTools,
  FaPaintRoller,
  FaCommentDots,
  FaExchangeAlt,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { FaInstagram, FaLinkedin, FaGithub, FaXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "../../styles/fixly-user-footer.css";

/* Trust indicators — expanded with "Trusted Reviews" per the redesign brief. */
const TRUST_INDICATORS = [
  { key: "verified", label: "Verified Professionals", icon: <FaShieldAlt /> },
  { key: "secure", label: "Secure Booking", icon: <FaLock /> },
  { key: "payments", label: "Easy Payments", icon: <FaCreditCard /> },
  { key: "reviews", label: "Trusted Reviews", icon: <FaStar /> },
];

/*
 * Quick Links — every `to` here is a route confirmed elsewhere in the
 * codebase (ChatRoutes.java: SEARCH, MY_BOOKINGS, PROFILE, NOTIFICATIONS,
 * HELP_SUPPORT, CHANGE_PASSWORD all exist). Nothing invented.
 */
const QUICK_LINKS = [
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
    key: "notifications",
    label: "Notifications",
    to: "/notifications",
    icon: <FaBell />,
  },
  {
    key: "support",
    label: "Help & Support",
    to: "/help-support",
    icon: <FaHeadset />,
  },
  {
    key: "password",
    label: "Change Password",
    to: "/change-password",
    icon: <FaKey />,
  },
];

/*
 * Popular Services — no verified per-category route/search-param mechanism
 * was confirmed in this project, so these render as informational,
 * non-clickable items rather than fake navigation. (SearchService.jsx does
 * take a "?service=" query param per the Home footer's category links, but
 * that wasn't something the User footer previously used or was asked to
 * introduce here, so left as plain list items per the "don't invent, err
 * toward non-clickable" instruction.)
 */
const POPULAR_SERVICES = [
  { key: "plumbing", label: "Plumbing", icon: <FaWrench /> },
  { key: "electrical", label: "Electrical", icon: <FaBolt /> },
  { key: "cleaning", label: "Home Cleaning", icon: <FaBroom /> },
  { key: "ac", label: "AC Repair", icon: <FaSnowflake /> },
  { key: "appliance", label: "Appliance Repair", icon: <FaTools /> },
  { key: "painting", label: "Painting", icon: <FaPaintRoller /> },
];

/*
 * Need Help? — only "Help & Support" has a real route (/help-support).
 * Booking Help / Cancellation & Reschedule / Payment Help don't have
 * dedicated pages in this project (they're chatbot topics, not routes),
 * so they stay as non-clickable informational items rather than pointing
 * to a page that doesn't exist.
 */
const SUPPORT_ITEMS = [
  {
    key: "help",
    label: "Help & Support",
    to: "/help-support",
    icon: <FaHeadset />,
  },
  { key: "booking-help", label: "Booking Help", icon: <FaCommentDots /> },
  {
    key: "cancel-reschedule",
    label: "Cancellation & Reschedule",
    icon: <FaExchangeAlt />,
  },
  { key: "payment-help", label: "Payment Help", icon: <FaMoneyCheckAlt /> },
];

const SOCIAL_LINKS = [
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/_._saurabh.__/",
    icon: <FaInstagram />,
  },
  {
    key: "x",
    label: "X",
    href: "https://x.com/Saurabh75660541",
    icon: <FaXTwitter />,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/saurabh-kumar-fronted-developer/",
    icon: <FaLinkedin />,
  },
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/Saurabhh0000",
    icon: <FaGithub />,
  },
];

/*
 * Legal — no /privacy, /terms, /cancellation-policy, or /refund-policy
 * routes exist in this project, so these render as non-clickable
 * placeholders rather than broken links, per the explicit instruction
 * not to invent them.
 */
const LEGAL_ITEMS = [
  "Privacy Policy",
  "Terms & Conditions",
  "Cancellation Policy",
  "Refund Policy",
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
              Book trusted home services from verified professionals — fast,
              reliable, and stress-free.
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

          {/* ===== LINK COLUMNS ===== */}
          <div className="user-footer-columns">
            {/* Quick Links */}
            <nav className="user-footer-col" aria-label="Quick links">
              <h4 className="user-footer-col-title">Quick Links</h4>
              <ul className="user-footer-col-list">
                {QUICK_LINKS.map((link) => (
                  <li key={link.key}>
                    <button
                      type="button"
                      className="user-footer-link-btn"
                      onClick={() => navigate(link.to)}
                      aria-label={link.label}>
                      <span
                        className="user-footer-link-icon"
                        aria-hidden="true">
                        {link.icon}
                      </span>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Popular Services (informational, not linked) */}
            <div className="user-footer-col">
              <h4 className="user-footer-col-title">Popular Services</h4>
              <ul className="user-footer-col-list">
                {POPULAR_SERVICES.map((service) => (
                  <li key={service.key} className="user-footer-static-item">
                    <span className="user-footer-link-icon" aria-hidden="true">
                      {service.icon}
                    </span>
                    {service.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Need Help? */}
            <nav className="user-footer-col" aria-label="Support links">
              <h4 className="user-footer-col-title">Need Help?</h4>
              <ul className="user-footer-col-list">
                {SUPPORT_ITEMS.map((item) =>
                  item.to ? (
                    <li key={item.key}>
                      <button
                        type="button"
                        className="user-footer-link-btn"
                        onClick={() => navigate(item.to)}
                        aria-label={item.label}>
                        <span
                          className="user-footer-link-icon"
                          aria-hidden="true">
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    </li>
                  ) : (
                    <li key={item.key} className="user-footer-static-item">
                      <span
                        className="user-footer-link-icon"
                        aria-hidden="true">
                        {item.icon}
                      </span>
                      {item.label}
                    </li>
                  ),
                )}
              </ul>
            </nav>

            {/* Connect */}
            <div className="user-footer-col">
              <h4 className="user-footer-col-title">Connect with Fixly</h4>
              <div className="user-footer-social">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="user-footer-social-btn">
                    {social.icon}
                  </a>
                ))}
              </div>
              <p className="user-footer-support-note">
                Need help with a booking? Our support team is here to help.
              </p>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="user-footer-bottom">
          <p className="user-footer-bottom-text">
            © {new Date().getFullYear()} Fixly Technologies Pvt. Ltd.
          </p>

          <ul className="user-footer-legal">
            {LEGAL_ITEMS.map((label) => (
              <li key={label} className="user-footer-legal-item">
                {label}
              </li>
            ))}
          </ul>

          <p className="user-footer-bottom-text">
            Made with{" "}
            <FaHeart className="user-footer-heart" aria-hidden="true" /> for
            happy homes
          </p>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
