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

/* ============================================================
   SOCIAL LINKS
   ============================================================ */
const SOCIAL_LINKS = [
  {
    key: "x",
    label: "X (Twitter)",
    href: "https://x.com/Saurabh75660541",
    icon: <FaXTwitter />,
  },
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/Saurabhh0000",
    icon: <FaGithub />,
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/_._saurabh.__/",
    icon: <FaInstagram />,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/saurabh-kumar-fronted-developer/",
    icon: <FaLinkedin />,
  },
];

/* ============================================================
   ADMINISTRATION ITEMS
   Informational only
   ============================================================ */
const ADMINISTRATION_ITEMS = [
  {
    key: "security",
    label: "Security & Access",
    icon: <FaUserShield />,
  },
  {
    key: "analytics",
    label: "Platform Analytics",
    icon: <FaChartLine />,
  },
  {
    key: "data",
    label: "Data Management",
    icon: <FaDatabase />,
  },
  {
    key: "monitoring",
    label: "System Monitoring",
    icon: <FaCogs />,
  },
];

/* ============================================================
   PLATFORM ITEMS
   Informational only
   ============================================================ */
const PLATFORM_ITEMS = [
  {
    key: "users",
    label: "Users",
    icon: <FaUsersCog />,
  },
  {
    key: "providers",
    label: "Providers",
    icon: <FaTools />,
  },
  {
    key: "bookings",
    label: "Bookings",
    icon: <FaClipboardList />,
  },
  {
    key: "services",
    label: "Services",
    icon: <FaChartBar />,
  },
];

/* ============================================================
   ADMIN FOOTER
   ============================================================ */
const AdminFooter = () => {
  return (
    <footer className="admin-footer">
      <div className="admin-footer-inner">
        {/* =====================================================
            TOP SECTION
            ===================================================== */}
        <div className="admin-footer-top">
          {/* BRAND */}
          <div className="admin-brand">
            <h3 className="admin-brand-name">
              Fix<span>ly</span> Admin
            </h3>

            <p className="admin-brand-tagline">
              Platform Operations &amp; Management
            </p>

            <p className="admin-desc">
              Centralized administration for managing the Fixly marketplace —
              users, providers, bookings, services and platform analytics.
            </p>

            <div className="admin-badges">
              <span>
                <FaShieldAlt />
                Secure Platform
              </span>

              <span>
                <FaChartLine />
                Analytics
              </span>

              <span>
                <FaUsersCog />
                User Management
              </span>

              <span>
                <FaTools />
                Provider Management
              </span>
            </div>
          </div>

          {/* STATUS PANEL */}
          <div className="admin-status-panel">
            <div className="admin-status-row">
              <span className="admin-status-dot" aria-hidden="true" />

              <span className="admin-status-text">
                Platform Status: Operational
              </span>
            </div>

            <div className="admin-security-row">
              <FaShieldAlt aria-hidden="true" />

              <div>
                <p className="admin-security-title">Admin Operations</p>

                <p className="admin-security-sub">
                  Protected administrative environment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            FOOTER COLUMNS
            ===================================================== */}
        <div className="admin-footer-columns">
          {/* ADMINISTRATION */}
          <nav className="admin-footer-col" aria-label="Administration">
            <h4 className="admin-col-title">Administration</h4>

            <ul className="admin-col-list">
              {ADMINISTRATION_ITEMS.map((item) => (
                <li
                  key={item.key}
                  className="admin-col-item admin-col-item-static">
                  <span className="admin-col-icon" aria-hidden="true">
                    {item.icon}
                  </span>

                  {item.label}
                </li>
              ))}
            </ul>
          </nav>

          {/* PLATFORM */}
          <nav className="admin-footer-col" aria-label="Platform">
            <h4 className="admin-col-title">Platform</h4>

            <ul className="admin-col-list">
              {PLATFORM_ITEMS.map((item) => (
                <li
                  key={item.key}
                  className="admin-col-item admin-col-item-static">
                  <span className="admin-col-icon" aria-hidden="true">
                    {item.icon}
                  </span>

                  {item.label}
                </li>
              ))}
            </ul>
          </nav>

          {/* CONNECT */}
          <div className="admin-footer-col">
            <h4 className="admin-col-title">Connect</h4>

            <div className="admin-social-icons">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Fixly on ${social.label}`}
                  title={social.label}
                  className="admin-social-btn">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM BAR
            ===================================================== */}
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
