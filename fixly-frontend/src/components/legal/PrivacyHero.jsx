import { FaUserShield } from "react-icons/fa";

const PrivacyHero = ({ effectiveDate, lastUpdated }) => (
  <header className="fprivacy-hero">
    <div className="fprivacy-hero-glow" aria-hidden="true" />
    <div className="fprivacy-container">
      <span className="fprivacy-hero-icon" aria-hidden="true">
        <FaUserShield />
      </span>
      <h1 className="fprivacy-hero-title">Privacy Policy</h1>
      <p className="fprivacy-hero-sub">Your privacy matters to us.</p>
      <p className="fprivacy-hero-desc">
        This Privacy Policy explains how Fixly collects, uses, protects, and
        manages information when you use our platform.
      </p>
      <div className="fprivacy-hero-dates">
        <div>
          <span className="fprivacy-hero-date-label">Effective Date</span>
          <span className="fprivacy-hero-date-value">{effectiveDate}</span>
        </div>
        <div>
          <span className="fprivacy-hero-date-label">Last Updated</span>
          <span className="fprivacy-hero-date-value">{lastUpdated}</span>
        </div>
      </div>
    </div>
  </header>
);

export default PrivacyHero;
