const AdminStatCard = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  size = "md",
  tone = "default",
}) => {
  return (
    <div
      className={`adm-stat-card ${size === "lg" ? "adm-stat-card-lg" : ""} ${size === "avg" ? "adm-stat-card-avg" : ""} adm-tone-${tone}`}
      tabIndex={0}>
      <div className="adm-stat-card-top">
        <div className="adm-stat-card-icon">{icon}</div>
        {trend != null && (
          <span
            className={`adm-trend ${trend >= 0 ? "adm-trend-up" : "adm-trend-down"}`}
            aria-label={`Trend ${trend >= 0 ? "up" : "down"} ${Math.abs(trend)} percent`}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <div className="adm-stat-card-value">{value}</div>
        <div className="adm-stat-card-title">{title}</div>
        {subtitle && <div className="adm-stat-card-sub">{subtitle}</div>}
      </div>
    </div>
  );
};

export default AdminStatCard;
