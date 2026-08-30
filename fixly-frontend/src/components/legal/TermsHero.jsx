import { FaShieldAlt } from "react-icons/fa";

const TermsHero = ({ effectiveDate, lastUpdated }) => (
  <header className="fterms-hero">
    <div className="fterms-hero-glow" aria-hidden="true" />
    <div className="fterms-container">
      <span className="fterms-hero-icon" aria-hidden="true">
        <FaShieldAlt />
      </span>
      <h1 className="fterms-hero-title">Terms &amp; Conditions</h1>
      <p className="fterms-hero-sub">
        Clear terms for a trusted service marketplace.
      </p>
      <p className="fterms-hero-desc">
        These Terms &amp; Conditions explain how customers, service providers,
        and visitors may use Fixly.
      </p>
      <div className="fterms-hero-dates">
        <div>
          <span className="fterms-hero-date-label">Effective Date</span>
          <span className="fterms-hero-date-value">{effectiveDate}</span>
        </div>
        <div>
          <span className="fterms-hero-date-label">Last Updated</span>
          <span className="fterms-hero-date-value">{lastUpdated}</span>
        </div>
      </div>
    </div>
  </header>
);

export default TermsHero;
