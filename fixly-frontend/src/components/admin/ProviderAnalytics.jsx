import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { getProviderAnalytics } from "../../api/adminAnalyticsApi";

const COLORS = {
  Approved: "#16a34a",
  Pending: "#f59e0b",
  Verifying: "#3b82f6",
  Rejected: "#ef4444",
  Suspended: "#94a3b8",
};

const ProviderAnalytics = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
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

  return (
    <div className="adm-chart-card">
      <div className="adm-chart-card-header">
        <div>
          <h3 className="adm-chart-title">Provider Analytics</h3>
          <p className="adm-chart-sub">Provider status breakdown, all time</p>
        </div>
      </div>

      {status === "loading" && (
        <div className="adm-chart-skeleton">Loading dashboard...</div>
      )}
      {status === "error" && (
        <div className="adm-chart-empty">Unable to load analytics.</div>
      )}
      {status === "empty" && (
        <div className="adm-chart-empty">No provider data available.</div>
      )}
      {status === "ready" && (
        <div className="adm-provider-chart-row">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data.chart.filter((c) => c.value > 0)}
                dataKey="value"
                nameKey="label"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}>
                {data.chart.map((entry) => (
                  <Cell
                    key={entry.label}
                    fill={COLORS[entry.label] || "#cbd5e1"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="adm-provider-stats">
            <div>
              <strong>{data.approved}</strong> Approved
            </div>
            <div>
              <strong>{data.pending}</strong> Pending
            </div>
            <div>
              <strong>{data.verifying}</strong> Verifying
            </div>
            <div>
              <strong>{data.rejected}</strong> Rejected
            </div>
            <div>
              <strong>{data.suspended}</strong> Suspended
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderAnalytics;
