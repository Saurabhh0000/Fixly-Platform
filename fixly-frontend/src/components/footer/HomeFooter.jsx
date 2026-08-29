import { useContext } from "react";
import {
  FaShieldAlt,
  FaBolt,
  FaUserCheck,
  FaStar,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaSearch,
  FaCalendarCheck,
  FaUser,
  FaBell,
  FaHeadset,
  FaBriefcase,
  FaTachometerAlt,
  FaWrench,
  FaBolt as FaElectric,
  FaBroom,
  FaSnowflake,
  FaTools,
  FaPaintRoller,
  FaHammer,
  FaBug,
  FaCommentDots,
  FaExchangeAlt,
  FaMoneyCheckAlt,
  FaHeart,
  FaArrowRight,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/fixly-footer.css";

/* Trust indicators — no fabricated stats. */
const TRUST_INDICATORS = [
  { key: "verified", label: "Background Verified", icon: <FaShieldAlt /> },
  { key: "booking", label: "Instant Booking", icon: <FaBolt /> },
  { key: "trusted", label: "Trusted by Users", icon: <FaUserCheck /> },
  { key: "reviews", label: "Trusted Reviews", icon: <FaStar /> },
];

/*
 * Popular Services — ServiceCategoryMatcher.java (chatbot) and the
 * existing ChatServiceImpl.serviceSearch() action already navigate to
 * `${ChatRoutes.SEARCH}?service=<lowercase-category-name>`, so this is a
 * verified, already-in-use mechanism, not an invented route.
 */
const POPULAR_SERVICES = [
  { key: "plumbing", label: "Plumbing", slug: "plumbing", icon: <FaWrench /> },
  {
    key: "electrical",
    label: "Electrical",
    slug: "electrical",
    icon: <FaElectric />,
  },
  {
    key: "cleaning",
    label: "Home Cleaning",
    slug: "cleaning",
    icon: <FaBroom />,
  },
  { key: "ac", label: "AC Repair", slug: "ac repair", icon: <FaSnowflake /> },
  {
    key: "appliance",
    label: "Appliance Repair",
    slug: "appliance repair",
    icon: <FaTools />,
  },
  {
    key: "painting",
    label: "Painting",
    slug: "painting",
    icon: <FaPaintRoller />,
  },
  {
    key: "carpentry",
    label: "Carpentry",
    slug: "carpentry",
    icon: <FaHammer />,
  },
  { key: "pest", label: "Pest Control", slug: "pest control", icon: <FaBug /> },
];

/*
 * Support topics — only "Help & Support" has a real dedicated route
 * (/help-support). The other three are common booking-problem topics but
 * have no separate page in this app, so they point to the same
 * /help-support page instead of inventing /booking-help etc.
 */
const SUPPORT_ITEMS = [
  {
    key: "help",
    label: "Help & Support",
    to: "/help-support",
    icon: <FaHeadset />,
  },
  {
    key: "booking-help",
    label: "Booking Help",
    to: "/help-support",
    icon: <FaCommentDots />,
  },
  {
    key: "cancel-reschedule",
    label: "Cancellation & Reschedule",
    to: "/help-support",
    icon: <FaExchangeAlt />,
  },
  {
    key: "payment-help",
    label: "Payment Help",
    to: "/help-support",
    icon: <FaMoneyCheckAlt />,
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
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const isProvider = user?.role === "PROVIDER";
  const isUser = user?.role === "USER";

  /* Role-aware target for "My Bookings"-type navigation: a provider's
     bookings live on their dashboard, a customer's on /user/bookings,
     and a guest has neither yet. */
  const myBookingsTarget = isProvider
    ? "/provider/dashboard"
    : isUser
      ? "/user/bookings"
      : "/login";

  const authGatedTo = (path) => (user ? path : "/login");

  return (
    <footer className="fixly-footer">
      <div className="fixly-footer-inner">
        {/* ===== CTA BANNER ===== */}
        <div className="fixly-footer-cta">
          <div className="fixly-footer-cta-text">
            <h4 className="fixly-footer-cta-title">
              Need a service? We're here to help.
            </h4>
            <p className="fixly-footer-cta-sub">
              Find trusted professionals for your home — quickly and
              confidently.
            </p>
          </div>
          <button
            type="button"
            className="fixly-footer-cta-btn"
            onClick={() => navigate("/search")}>
            Explore Services
            <FaArrowRight aria-hidden="true" />
          </button>
        </div>

        {/* ===== TOP: BRAND + NAV ===== */}
        <div className="fixly-footer-top">
          <div className="fixly-footer-brand">
            <h3 className="fixly-footer-logo">
              Fix<span>ly</span>
            </h3>

            <p className="fixly-footer-tagline">
              India's trusted platform for home services.
            </p>

            <p className="fixly-footer-desc">
              Fixly connects customers with verified professionals for reliable
              home services — from plumbing and electrical work to cleaning,
              repairs and more.
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
            {/* ---- For Customers (merged former Quick Links) ---- */}
            <div className="fixly-footer-nav-col">
              <h4 className="fixly-footer-nav-title">For Customers</h4>
              <ul className="fixly-footer-nav-list">
                <li>
                  <Link className="fixly-footer-nav-link" to="/search">
                    <FaSearch
                      className="fixly-footer-nav-icon"
                      aria-hidden="true"
                    />
                    Find a Service
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className="fixly-footer-nav-link fixly-footer-nav-btn"
                    onClick={() => navigate(myBookingsTarget)}>
                    <FaCalendarCheck
                      className="fixly-footer-nav-icon"
                      aria-hidden="true"
                    />
                    My Bookings
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="fixly-footer-nav-link fixly-footer-nav-btn"
                    onClick={() => navigate(authGatedTo("/profile"))}>
                    <FaUser
                      className="fixly-footer-nav-icon"
                      aria-hidden="true"
                    />
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="fixly-footer-nav-link fixly-footer-nav-btn"
                    onClick={() => navigate(authGatedTo("/notifications"))}>
                    <FaBell
                      className="fixly-footer-nav-icon"
                      aria-hidden="true"
                    />
                    Notifications
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="fixly-footer-nav-link fixly-footer-nav-btn"
                    onClick={() => navigate(authGatedTo("/help-support"))}>
                    <FaHeadset
                      className="fixly-footer-nav-icon"
                      aria-hidden="true"
                    />
                    Help & Support
                  </button>
                </li>
              </ul>
            </div>

            {/* ---- Popular Services ---- */}
            <div className="fixly-footer-nav-col">
              <h4 className="fixly-footer-nav-title">Popular Services</h4>
              <ul className="fixly-footer-nav-list">
                {POPULAR_SERVICES.map((service) => (
                  <li key={service.key}>
                    <button
                      type="button"
                      className="fixly-footer-nav-link fixly-footer-nav-btn"
                      onClick={() =>
                        navigate(
                          `/search?service=${encodeURIComponent(service.slug)}`,
                        )
                      }>
                      <span
                        className="fixly-footer-nav-icon"
                        aria-hidden="true">
                        {service.icon}
                      </span>
                      {service.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ---- For Professionals ---- */}
            <div className="fixly-footer-nav-col">
              <h4 className="fixly-footer-nav-title">For Professionals</h4>
              <ul className="fixly-footer-nav-list">
                {isProvider ? (
                  <li>
                    <Link
                      className="fixly-footer-nav-link"
                      to="/provider/dashboard">
                      <FaTachometerAlt
                        className="fixly-footer-nav-icon"
                        aria-hidden="true"
                      />
                      Provider Dashboard
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      className="fixly-footer-nav-link"
                      to="/become-provider">
                      <FaBriefcase
                        className="fixly-footer-nav-icon"
                        aria-hidden="true"
                      />
                      Become a Provider
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    type="button"
                    className="fixly-footer-nav-link fixly-footer-nav-btn"
                    onClick={() => navigate("/help-support")}>
                    Provider Support
                  </button>
                </li>
              </ul>
            </div>

            {/* ---- Need Help? ---- */}
            <div className="fixly-footer-nav-col">
              <h4 className="fixly-footer-nav-title">Need Help?</h4>
              <ul className="fixly-footer-nav-list">
                {SUPPORT_ITEMS.map((item) => (
                  <li key={item.key}>
                    <Link className="fixly-footer-nav-link" to={item.to}>
                      <span
                        className="fixly-footer-nav-icon"
                        aria-hidden="true">
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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
            Made with{" "}
            <FaHeart className="fixly-footer-heart" aria-hidden="true" /> for
            happy homes
          </p>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
