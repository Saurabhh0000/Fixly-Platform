import {
  FaWallet,
  FaClipboardList,
  FaFileInvoiceDollar,
  FaBalanceScale,
  FaSyncAlt,
} from "react-icons/fa";

const FLOW = [
  { label: "Payment", icon: <FaWallet /> },
  { label: "Booking", icon: <FaClipboardList /> },
  { label: "Eligibility Check", icon: <FaBalanceScale /> },
  { label: "Refund Processing", icon: <FaSyncAlt /> },
];

const RefundHero = ({ effectiveDate, lastUpdated }) => (
  <header className="frefund-hero">
    <div className="frefund-hero-glow" aria-hidden="true" />
    <div className="frefund-container frefund-hero-inner">
      <div className="frefund-hero-copy">
        <span className="frefund-hero-icon" aria-hidden="true">
          <FaFileInvoiceDollar />
        </span>
        <h1 className="frefund-hero-title">Refund Policy</h1>
        <p className="frefund-hero-sub">
          Clear, transparent rules for refunds after cancelled or affected
          bookings.
        </p>
        <p className="frefund-hero-desc">
          Understand how Fixly handles refund eligibility, service
          cancellations, payment processing, and refund-related requests.
        </p>
        <div className="frefund-hero-dates">
          <div>
            <span className="frefund-hero-date-label">Effective Date</span>
            <span className="frefund-hero-date-value">{effectiveDate}</span>
          </div>
          <div>
            <span className="frefund-hero-date-label">Last Updated</span>
            <span className="frefund-hero-date-value">{lastUpdated}</span>
          </div>
        </div>
      </div>
      <div className="frefund-hero-visual" aria-hidden="true">
        {FLOW.map((node, i) => (
          <div
            key={node.label}
            className="frefund-hero-flow-node"
            style={{ "--frefund-delay": `${i * 100}ms` }}>
            <span>{node.icon}</span>
            {node.label}
          </div>
        ))}
      </div>
    </div>
  </header>
);

export default RefundHero;
