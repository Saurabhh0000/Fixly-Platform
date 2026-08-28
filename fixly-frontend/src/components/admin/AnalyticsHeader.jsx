const PERIODS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const AnalyticsHeader = ({ period, onPeriodChange }) => {
  return (
    <div className="adm-analytics-header">
      <div>
        <h2 className="adm-analytics-title">{getGreeting()}, Admin 👋</h2>
        <p className="adm-analytics-sub">
          Here's what's happening across Fixly today.
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
