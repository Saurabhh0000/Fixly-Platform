import {
  FaDatabase,
  FaBullseye,
  FaShareAlt,
  FaSlidersH,
  FaLock,
} from "react-icons/fa";
import { PRIVACY_SUMMARY_CARDS } from "../../data/legalContent";

const ICONS = {
  information: <FaDatabase />,
  purpose: <FaBullseye />,
  sharing: <FaShareAlt />,
  control: <FaSlidersH />,
  security: <FaLock />,
};

const PrivacySummary = () => (
  <section className="fprivacy-summary">
    <div className="fprivacy-container">
      <h2 className="fprivacy-summary-title">Privacy at a glance</h2>
      <div className="fprivacy-summary-grid">
        {PRIVACY_SUMMARY_CARDS.map((card) => (
          <div className="fprivacy-summary-card" key={card.key}>
            <span className="fprivacy-summary-num">{card.number}</span>
            <span className="fprivacy-summary-icon" aria-hidden="true">
              {ICONS[card.key]}
            </span>
            <p className="fprivacy-summary-card-title">{card.title}</p>
            <p className="fprivacy-summary-card-desc">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PrivacySummary;
