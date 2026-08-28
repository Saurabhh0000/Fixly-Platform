import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getRevenueTrends } from "../../api/adminAnalyticsApi";

const GRANULARITIES = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

const RevenueAnalytics = () => {
  const [granularity, setGranularity] = useState("monthly");
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    getRevenueTrends(granularity)
      .then((res) => {
        if (!active) return;
        setData(res.data);
        setStatus(res.data.every((d) => d.revenue === 0) ? "empty" : "ready");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, [granularity]);

  return (
    <div className="adm-chart-card">
      <div className="adm-chart-card-header">
        <div>
          <h3 className="adm-chart-title">Revenue Analytics</h3>
          <p className="adm-chart-sub">
            Based on completed bookings at each provider's current price per
            visit
          </p>
        </div>
        <div
          className="adm-granularity-selector"
          role="group"
          aria-label="Revenue chart granularity">
          {GRANULARITIES.map((g) => (
            <button
              key={g.key}
              className={`adm-gran-btn ${granularity === g.key ? "adm-gran-active" : ""}`}
              onClick={() => setGranularity(g.key)}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {status === "loading" && (
        <div className="adm-chart-skeleton">Loading dashboard...</div>
      )}
      {status === "error" && (
        <div className="adm-chart-empty">Unable to load analytics.</div>
      )}
      {status === "empty" && (
        <div className="adm-chart-empty">
          No revenue data available for this period.
        </div>
      )}
      {status === "ready" && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip formatter={(v) => [`₹${v}`, "Revenue"]} />
            <Bar dataKey="revenue" fill="#16a34a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueAnalytics;
