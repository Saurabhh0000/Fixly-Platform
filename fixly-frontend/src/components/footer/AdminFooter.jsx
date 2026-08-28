import { FaXTwitter, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";
import {
  FaShieldAlt,
  FaUsersCog,
  FaChartLine,
  FaDatabase,
  FaUserShield,
  FaClipboardList,
  FaTools,
  FaChartBar,
  FaCogs,
} from "react-icons/fa";
import "../../styles/fixly-admin-footer.css";

/**
 * Placeholder constants — replace with real Fixly account URLs when available.
 * Do not treat these as live/official accounts.
 */
const SOCIAL_LINKS = [
  {
    key: "x",
    label: "X (Twitter)",
    href: "https://x.com/fixly_placeholder",
    icon: <FaXTwitter />,
  },
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/fixly-placeholder",
    icon: <FaGithub />,
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://instagram.com/fixly_placeholder",
    icon: <FaInstagram />,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com/company/fixly-placeholder",
    icon: <FaLinkedin />,
  },
];

/**
 * Informational only — no routes exist for these yet, so they render
 * as non-clickable items rather than fake links.
 */
const ADMINISTRATION_ITEMS = [
  { key: "security", label: "Security & Access", icon: <FaUserShield /> },
  { key: "analytics", label: "Platform Analytics", icon: <FaChartLine /> },
  { key: "data", label: "Data Management", icon: <FaDatabase /> },
  { key: "monitoring", label: "System Monitoring", icon: <FaCogs /> },
];

const PLATFORM_ITEMS = [
  { key: "users", label: "Users", icon: <FaUsersCog /> },
  { key: "providers", label: "Providers", icon: <FaTools /> },
  { key: "bookings", label: "Bookings", icon: <FaClipboardList /> },
  { key: "services", label: "Services", icon: <FaChartBar /> },
];

const AdminFooter = () => {
  return (
    <footer className="admin-footer">
      <div className="admin-footer-inner">
        {/* ================= TOP: BRAND + STATUS/SECURITY ================= */}
        <div className="admin-footer-top">
          <div className="admin-brand">
            <h3 className="admin-brand-name">
              Fix<span>ly</span> Admin
            </h3>
            <p className="admin-brand-tagline">Platform Operations &amp; Management</p>

            <p className="admin-desc">
              Centralized administration for managing the Fixly marketplace —
              users, providers, bookings, services and platform analytics.
            </p>

            <div className="admin-badges">
              <span>
                <FaShieldAlt /> Secure Platform
              </span>
              <span>
                <FaChartLine /> Analytics
              </span>
              <span>
                <FaUsersCog /> User Management
              </span>
              <span>
                <FaTools /> Provider Management
              </span>
            </div>
          </div>

          <div className="admin-status-panel">
            <div className="admin-status-row">
              <span className="admin-status-dot" aria-hidden="true" />
              <span className="admin-status-text">Platform Status: Operational</span>
            </div>
            <div className="admin-security-row">
              <FaShieldAlt aria-hidden="true" />
              <div>
                <p className="admin-security-title">Admin Operations</p>
                <p className="admin-security-sub">Protected administrative environment</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COLUMNS ================= */}
        <div className="admin-footer-columns">
          <nav className="admin-footer-col" aria-label="Administration">
            <h4 className="admin-col-title">Administration</h4>
            <ul className="admin-col-list">
              {ADMINISTRATION_ITEMS.map((item) => (
                <li key={item.key} className="admin-col-item admin-col-item-static">
                  <span className="admin-col-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </nav>

          <nav className="admin-footer-col" aria-label="Platform">
            <h4 className="admin-col-title">Platform</h4>
            <ul className="admin-col-list">
              {PLATFORM_ITEMS.map((item) => (
                <li key={item.key} className="admin-col-item admin-col-item-static">
                  <span className="admin-col-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </nav>

          <div className="admin-footer-col">
            <h4 className="admin-col-title">Connect</h4>
            <div className="admin-social-icons">
              {SOCIAL_LINKS.map((social) => (
                
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Fixly on ${social.label}`}
                  title={social.label}
                  className="admin-social-btn"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="admin-footer-bottom">
          <p className="admin-footer-copyright">
            © {new Date().getFullYear()} Fixly Technologies Pvt. Ltd.
          </p>
          <p className="admin-footer-mid">Administration Console</p>
          <p className="admin-footer-right">Secure Admin Environment</p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;