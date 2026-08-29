import {
  FaShieldAlt,
  FaBolt,
  FaUserCheck,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import "../../styles/fixly-footer.css";

/* Trust indicators — same three concepts as before, restyled as
   compact checkmark-style indicators rather than pill badges. */
const TRUST_INDICATORS = [
  { key: "verified", label: "Background Verified", icon: <FaShieldAlt /> },
  { key: "booking", label: "Instant Booking", icon: <FaBolt /> },
  { key: "trusted", label: "Trusted by Users", icon: <FaUserCheck /> },
];

/*
 * Only items with a route confirmed elsewhere in the app (ChatRoutes.java:
 * SEARCH="/search", BECOME_PROVIDER="/become-provider",
 * HELP_SUPPORT="/help-support") are rendered as real links. Everything
 * else is plain, non-clickable text — no invented routes, no dead links.
 */
const FOOTER_NAV_SECTIONS = [
  {
    key: "platform",
    title: "Platform",
    items: [
      { key: "find-services", label: "Find Services", to: "/search" },
      {
        key: "become-provider",
        label: "Become a Provider",
        to: "/become-provider",
      },
      { key: "how-it-works", label: "How It Works" },
    ],
  },
  {
    key: "company",
    title: "Company",
    items: [
      { key: "about", label: "About Fixly", to: "/about" },
      { key: "contact", label: "Contact" },
      { key: "careers", label: "Careers" },
    ],
  },
  {
    key: "support",
    title: "Support",
    items: [
      { key: "help", label: "Help & Support", to: "/help-support" },
      { key: "faqs", label: "FAQs" },
      { key: "safety", label: "Safety" },
    ],
  },
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

const HomeFooter = () => {
  return (
    <footer className="fixly-footer">
      <div className="fixly-footer-inner">
        {/* ===== TOP: BRAND + NAV ===== */}
        <div className="fixly-footer-top">
          <div className="fixly-footer-brand">
            <h3 className="fixly-footer-logo">
              Fix<span>ly</span>
            </h3>

            <p className="fixly-footer-tagline">
              India's trusted platform for{" "}
              <span className="fixly-green">home services</span>.
            </p>

            <p className="fixly-footer-desc">
              Fixly connects you with{" "}
              <span className="fixly-green">verified professionals</span> for
              plumbing, electrical, cleaning, appliance repair and more — with{" "}
              <span className="fixly-green">quality</span> and{" "}
              <span className="fixly-green">transparency</span> built in.
            </p>

            <ul className="fixly-footer-trust">
              {TRUST_INDICATORS.map((item) => (
                <li key={item.key} className="fixly-footer-trust-item">
                  <span className="fixly-footer-trust-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <nav className="fixly-footer-nav" aria-label="Footer navigation">
            {FOOTER_NAV_SECTIONS.map((section) => (
              <div key={section.key} className="fixly-footer-nav-col">
                <h4 className="fixly-footer-nav-title">{section.title}</h4>
                <ul className="fixly-footer-nav-list">
                  {section.items.map((item) => (
                    <li key={item.key}>
                      {item.to ? (
                        <Link className="fixly-footer-nav-link" to={item.to}>
                          {item.label}
                        </Link>
                      ) : (
                        <span className="fixly-footer-nav-text">
                          {item.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* ===== SOCIAL ===== */}
        <div className="fixly-footer-social-row">
          <h4 className="fixly-footer-social-title">Connect with Fixly</h4>
          <div className="fixly-footer-social">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
                className="fixly-footer-social-btn">
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="fixly-footer-bottom">
          <p className="fixly-footer-bottom-text">
            © {new Date().getFullYear()} Fixly Technologies Pvt. Ltd. All rights
            reserved.
          </p>
          <p className="fixly-footer-bottom-note">
            Built for better home services.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
