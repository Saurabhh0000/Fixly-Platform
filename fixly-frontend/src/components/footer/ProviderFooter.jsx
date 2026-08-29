import {
  FaTools,
  FaClock,
  FaWallet,
  FaStar,
  FaRocket,
  FaClipboardList,
  FaCalendarCheck,
  FaChartLine,
  FaChartBar,
  FaBriefcase,
  FaShieldAlt,
  FaUsers,
  FaTrophy,
} from "react-icons/fa";
import { FaLinkedin, FaGithub, FaXTwitter, FaInstagram } from "react-icons/fa6";
import "../../styles/fixly-provider-footer.css";

/* Provider capability highlights shown as badges under the brand blurb. */
const CAPABILITY_BADGES = [
  { key: "jobs", label: "More Jobs", icon: <FaTools /> },
  { key: "schedule", label: "Flexible Schedule", icon: <FaClock /> },
  { key: "payouts", label: "Secure Payouts", icon: <FaWallet /> },
  { key: "ratings", label: "Ratings & Reviews", icon: <FaStar /> },
];

/*
 * These map to real areas of the Provider Dashboard, but since no
 * dedicated routes for each sub-section were confirmed, they're rendered
 * as informational list items rather than fake navigation links.
 */
const PLATFORM_ITEMS = [
  { key: "bookings", label: "Manage Bookings", icon: <FaClipboardList /> },
  { key: "availability", label: "Availability", icon: <FaCalendarCheck /> },
  { key: "earnings", label: "Earnings", icon: <FaChartLine /> },
  { key: "performance", label: "Service Performance", icon: <FaChartBar /> },
];

const BENEFIT_ITEMS = [
  { key: "more-jobs", label: "More Jobs", icon: <FaBriefcase /> },
  { key: "secure-payments", label: "Secure Payments", icon: <FaShieldAlt /> },
  { key: "trusted-customers", label: "Trusted Customers", icon: <FaUsers /> },
  { key: "reputation", label: "Build Reputation", icon: <FaTrophy /> },
];

const SOCIAL_LINKS = [
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
  {
    key: "x",
    label: "X",
    href: "https://x.com/Saurabh75660541",
    icon: <FaXTwitter />,
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/_._saurabh.__/",
    icon: <FaInstagram />,
  },
];

const ProviderFooter = () => {
  return (
    <footer className="provider-footer">
      <div className="provider-footer-top">
        {/* ===== BRAND ===== */}
        <div className="provider-footer-brand">
          <h3 className="provider-footer-brand-title">
            Fix<span>ly</span> Provider
          </h3>

          <p className="provider-footer-desc">
            Grow your service business with Fixly. Get consistent bookings,
            trusted customers, and timely payouts — all in one platform.
          </p>

          <ul className="provider-footer-badges">
            {CAPABILITY_BADGES.map((badge) => (
              <li key={badge.key} className="provider-footer-badge">
                <span className="provider-footer-badge-icon" aria-hidden="true">
                  {badge.icon}
                </span>
                {badge.label}
              </li>
            ))}
          </ul>
        </div>

        {/* ===== LINK-STYLE SECTIONS ===== */}
        <div className="provider-footer-sections">
          <div className="provider-footer-section">
            <h4 className="provider-footer-section-title">Provider Platform</h4>
            <ul className="provider-footer-list">
              {PLATFORM_ITEMS.map((item) => (
                <li key={item.key} className="provider-footer-list-item">
                  <span
                    className="provider-footer-list-icon"
                    aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="provider-footer-section">
            <h4 className="provider-footer-section-title">Provider Benefits</h4>
            <ul className="provider-footer-list">
              {BENEFIT_ITEMS.map((item) => (
                <li key={item.key} className="provider-footer-list-item">
                  <span
                    className="provider-footer-list-icon"
                    aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="provider-footer-section provider-footer-social">
            <h4 className="provider-footer-section-title">Connect</h4>
            <ul className="provider-footer-social-list">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.key}>
                  <a
                    className="provider-footer-social-btn"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit Fixly on ${social.label}`}
                    title={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM ===== */}
      <div className="provider-footer-bottom">
        <p className="provider-footer-bottom-text">
          © {new Date().getFullYear()} Fixly Technologies Pvt. Ltd. • Provider
          Dashboard
        </p>
        <p className="provider-footer-bottom-text provider-footer-tagline">
          <span>Empowering service professionals</span>
          <FaRocket
            className="provider-footer-tagline-icon"
            aria-hidden="true"
          />
        </p>
      </div>
    </footer>
  );
};

export default ProviderFooter;
