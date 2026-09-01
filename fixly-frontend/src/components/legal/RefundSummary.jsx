import { FaBalanceScale, FaBan, FaSyncAlt, FaHeadset } from "react-icons/fa";
import { REFUND_SUMMARY_CARDS } from "../../data/legalContent";

const ICONS = {
  eligibility: <FaBalanceScale />,
  cancellation: <FaBan />,
  processing: <FaSyncAlt />,
  support: <FaHeadset />,
};

const RefundSummary = () => (
  <section className="frefund-summary">
    <div className="frefund-container">
      <h2 className="frefund-summary-title">Refunds at a glance</h2>
      <div className="frefund-summary-grid">
        {REFUND_SUMMARY_CARDS.map((card) => (
          <div className="frefund-summary-card" key={card.key}>
            <span className="frefund-summary-icon" aria-hidden="true">
              {ICONS[card.key]}
            </span>
            <p className="frefund-summary-card-title">{card.title}</p>
            <p className="frefund-summary-card-desc">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default RefundSummary;
