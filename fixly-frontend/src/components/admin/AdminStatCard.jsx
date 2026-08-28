const AdminStatCard = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  tone = "slate",
  size = "md",
}) => {
  return (
    <div
      className={`adm-stat-card adm-stat-card-${size} adm-tone-${tone}`}
      tabIndex={0}>
      <span className="adm-stat-card-deco" aria-hidden="true" />
      <div className="adm-stat-card-icon">{icon}</div>
      <div className="adm-stat-card-body">
        <div className="adm-stat-card-value">{value}</div>
        <div className="adm-stat-card-title">{title}</div>
        {subtitle && <div className="adm-stat-card-sub">{subtitle}</div>}
      </div>
      {trend != null && (
        <span
          className={`adm-trend ${trend >= 0 ? "adm-trend-up" : "adm-trend-down"}`}
          aria-label={`Trend ${trend >= 0 ? "up" : "down"} ${Math.abs(trend)} percent`}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </span>
      )}
    </div>
  );
};

export default AdminStatCard;
