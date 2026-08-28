import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getBookingTrends } from "../../api/adminAnalyticsApi";

const GRANULARITIES = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

const BookingAnalytics = () => {
  const [granularity, setGranularity] = useState("monthly");
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    getBookingTrends(granularity)
      .then((res) => {
        if (!active) return;
        setData(res.data);
        setStatus(res.data.every((d) => d.total === 0) ? "empty" : "ready");
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
          <h3 className="adm-chart-title">Booking Trends</h3>
          <p className="adm-chart-sub">Total bookings by status over time</p>
        </div>
        <div
          className="adm-granularity-selector"
          role="group"
          aria-label="Chart granularity">
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
          No booking data available for this period.
        </div>
      )}
      {status === "ready" && (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              allowDecimals={false}
            />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="total"
              name="Total"
              stroke="#16a34a"
              fill="url(#colorTotal)"
            />
            <Area
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke="#22c55e"
              fillOpacity={0}
            />
            <Area
              type="monotone"
              dataKey="cancelled"
              name="Cancelled"
              stroke="#ef4444"
              fillOpacity={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BookingAnalytics;
