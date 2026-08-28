import { useEffect, useState, useCallback } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { FaUserTie } from "react-icons/fa";
import { getProviderAnalytics } from "../../api/adminAnalyticsApi";

const COLORS = {
  Approved: "#16A34A",
  Pending: "#F59E0B",
  Verifying: "#3B82F6",
  Rejected: "#EF4444",
  Suspended: "#94A3B8",
};

const ProviderAnalytics = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  const load = useCallback(() => {
    let active = true;
    setStatus("loading");
    getProviderAnalytics()
      .then((res) => {
        if (!active) return;
        setData(res.data);
        setStatus(res.data.total === 0 ? "empty" : "ready");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => load(), [load]);

  return (
    <div className="adm-chart-card">
      <div className="adm-chart-card-header">
        <div className="adm-chart-title-row">
          <span
            className="adm-title-icon adm-title-icon-purple"
            aria-hidden="true">
            <FaUserTie />
          </span>
          <div>
            <h3 className="adm-chart-title">Provider Analytics</h3>
            <p className="adm-chart-sub">Provider status breakdown, all time</p>
          </div>
        </div>
      </div>

      {status === "loading" && (
        <div className="adm-chart-skeleton">Loading dashboard...</div>
      )}
      {status === "error" && (
        <div className="adm-chart-empty">
          <div className="adm-chart-empty-title">Unable to load analytics</div>
          We couldn't retrieve provider data.
          <div>
            <button className="adm-retry-btn" onClick={load}>
              Retry
            </button>
          </div>
        </div>
      )}
      {status === "empty" && (
        <div className="adm-chart-empty">
          <div className="adm-chart-empty-title">No provider data yet</div>
          Provider status will appear here once providers sign up.
        </div>
      )}
      {status === "ready" && (
        <div className="adm-provider-chart-row">
          <div className="adm-donut-wrap" style={{ flex: "0 0 220px" }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data.chart.filter((c) => c.value > 0)}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  strokeWidth={0}>
                  {data.chart.map((entry) => (
                    <Cell
                      key={entry.label}
                      fill={COLORS[entry.label] || "#CBD5E1"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="adm-donut-center">
              <div className="adm-donut-center-value">
                {data.total.toLocaleString("en-IN")}
              </div>
              <div className="adm-donut-center-label">Providers</div>
            </div>
          </div>
          <div className="adm-provider-stats">
            <div className="adm-provider-stat-row">
              <span>Approved</span>
              <strong>{data.approved}</strong>
            </div>
            <div className="adm-provider-stat-row">
              <span>Pending</span>
              <strong>{data.pending}</strong>
            </div>
            <div className="adm-provider-stat-row">
              <span>Verifying</span>
              <strong>{data.verifying}</strong>
            </div>
            <div className="adm-provider-stat-row">
              <span>Rejected</span>
              <strong>{data.rejected}</strong>
            </div>
            <div className="adm-provider-stat-row">
              <span>Suspended</span>
              <strong>{data.suspended}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderAnalytics;
