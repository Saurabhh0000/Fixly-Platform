const PERIODS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
];

const AnalyticsHeader = ({ period, onPeriodChange }) => {
  return (
    <div className="adm-analytics-header">
      <div>
        <h2 className="adm-analytics-title">Admin Dashboard</h2>
        <p className="adm-analytics-sub">
          Monitor Fixly's platform performance, users, providers and bookings.
        </p>
      </div>
      <div
        className="adm-period-selector"
        role="group"
        aria-label="Select time period">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            className={`adm-period-btn ${period === p.key ? "adm-period-active" : ""}`}
            onClick={() => onPeriodChange(p.key)}
            aria-pressed={period === p.key}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsHeader;
