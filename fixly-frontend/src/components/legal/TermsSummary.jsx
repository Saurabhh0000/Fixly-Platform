import {
  FaCheckCircle,
  FaUserEdit,
  FaHandshake,
  FaClipboardCheck,
  FaBook,
} from "react-icons/fa";
import { SUMMARY_CARDS } from "../../data/legalContent";

const ICONS = {
  responsible: <FaCheckCircle />,
  accurate: <FaUserEdit />,
  respect: <FaHandshake />,
  rules: <FaClipboardCheck />,
  review: <FaBook />,
};

const TermsSummary = () => (
  <section className="fterms-section fterms-summary">
    <div className="fterms-container">
      <h2 className="fterms-summary-title">Before you get started</h2>
      <div className="fterms-summary-grid">
        {SUMMARY_CARDS.map((card) => (
          <div className="fterms-summary-card" key={card.key}>
            <span className="fterms-summary-icon" aria-hidden="true">
              {ICONS[card.key]}
            </span>
            <p className="fterms-summary-card-title">{card.title}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TermsSummary;
