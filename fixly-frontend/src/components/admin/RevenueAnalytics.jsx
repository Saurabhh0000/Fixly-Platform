import { useEffect, useState, useCallback } from "react";
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

const formatINR = (v) => `₹${Number(v).toLocaleString("en-IN")}`;

const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 10,
        padding: "10px 12px",
        boxShadow: "0 6px 18px rgba(15,23,42,.08)",
      }}>
      <div
        style={{
          fontSize: 11.5,
          color: "#64748B",
          fontWeight: 700,
          marginBottom: 3,
        }}>
        {label}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0F172A" }}>
        {formatINR(payload[0].value)}
      </div>
    </div>
  );
};

const RevenueAnalytics = () => {
  const [granularity, setGranularity] = useState("monthly");
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = useCallback(() => {
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

  useEffect(() => load(), [load]);

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
        <div className="adm-chart-empty">
          <div className="adm-chart-empty-title">Unable to load analytics</div>
          We couldn't retrieve revenue data.
          <div>
            <button className="adm-retry-btn" onClick={load}>
              Retry
            </button>
          </div>
        </div>
      )}
      {status === "empty" && (
        <div className="adm-chart-empty">
          <div className="adm-chart-empty-title">No revenue data yet</div>
          Revenue will appear here once bookings are completed.
        </div>
      )}
      {status === "ready" && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#EEF2F6"
              vertical={false}
            />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11, fill: "#64748B" }}
              axisLine={{ stroke: "#E2E8F0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickFormatter={(v) => `₹${v}`}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Tooltip
              content={<RevenueTooltip />}
              cursor={{ fill: "#F0FDF4" }}
            />
            <Bar
              dataKey="revenue"
              fill="#16A34A"
              radius={[6, 6, 0, 0]}
              maxBarSize={46}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueAnalytics;
