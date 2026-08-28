const AdminStatCard = ({ icon, title, value, subtitle, trend }) => {
  return (
    <div className="adm-stat-card">
      <div className="adm-stat-card-top">
        <div className="adm-stat-card-icon">{icon}</div>
        {trend != null && (
          <span
            className={`adm-trend ${trend >= 0 ? "adm-trend-up" : "adm-trend-down"}`}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="adm-stat-card-value">{value}</div>
      <div className="adm-stat-card-title">{title}</div>
      {subtitle && <div className="adm-stat-card-sub">{subtitle}</div>}
    </div>
  );
};

export default AdminStatCard;
