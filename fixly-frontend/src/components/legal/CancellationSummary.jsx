import {
  FaClock,
  FaHandshake,
  FaExchangeAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import { CANCELLATION_SUMMARY_CARDS } from "../../data/legalContent";

const ICONS = {
  before: <FaClock />,
  acceptance: <FaHandshake />,
  reschedule: <FaExchangeAlt />,
  exceptional: <FaExclamationCircle />,
};

const CancellationSummary = () => (
  <section className="fcxl-summary">
    <div className="fcxl-container">
      <h2 className="fcxl-summary-title">Cancellation at a glance</h2>
      <div className="fcxl-summary-grid">
        {CANCELLATION_SUMMARY_CARDS.map((card) => (
          <div className="fcxl-summary-card" key={card.key}>
            <span className="fcxl-summary-icon" aria-hidden="true">
              {ICONS[card.key]}
            </span>
            <p className="fcxl-summary-card-title">{card.title}</p>
            <p className="fcxl-summary-card-desc">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CancellationSummary;
