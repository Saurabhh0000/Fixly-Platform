import {
  FaBan,
  FaCalendarCheck,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa";

const FLOW = [
  { label: "Booking", icon: <FaClipboardList /> },
  { label: "Scheduled", icon: <FaCalendarCheck /> },
  { label: "Change / Cancel", icon: <FaBan /> },
  { label: "Result", icon: <FaCheckCircle /> },
];

const CancellationHero = ({ effectiveDate, lastUpdated }) => (
  <header className="fcxl-hero">
    <div className="fcxl-hero-glow" aria-hidden="true" />
    <div className="fcxl-container fcxl-hero-inner">
      <div className="fcxl-hero-copy">
        <span className="fcxl-hero-icon" aria-hidden="true">
          <FaBan />
        </span>
        <h1 className="fcxl-hero-title">Cancellation Policy</h1>
        <p className="fcxl-hero-sub">
          Clear rules for changing, cancelling, and managing your Fixly
          bookings.
        </p>
        <p className="fcxl-hero-desc">
          Understand how cancellations, rescheduling, missed appointments, and
          related charges are handled for customers and service providers.
        </p>
        <div className="fcxl-hero-dates">
          <div>
            <span className="fcxl-hero-date-label">Effective Date</span>
            <span className="fcxl-hero-date-value">{effectiveDate}</span>
          </div>
          <div>
            <span className="fcxl-hero-date-label">Last Updated</span>
            <span className="fcxl-hero-date-value">{lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="fcxl-hero-visual" aria-hidden="true">
        {FLOW.map((node, i) => (
          <div
            key={node.label}
            className="fcxl-hero-flow-node"
            style={{ "--fcxl-delay": `${i * 100}ms` }}>
            <span>{node.icon}</span>
            {node.label}
          </div>
        ))}
      </div>
    </div>
  </header>
);

export default CancellationHero;
