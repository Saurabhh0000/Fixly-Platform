import { useEffect, useState, useCallback } from "react";
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
import { FaChartLine } from "react-icons/fa";
import { getBookingTrends } from "../../api/adminAnalyticsApi";

const GRANULARITIES = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

const ChartTooltip = ({ active, payload, label }) => {
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
          fontSize: 12,
          fontWeight: 800,
          color: "#0F172A",
          marginBottom: 6,
        }}>
        {label}
      </div>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          style={{
            fontSize: 11.5,
            color: "#334155",
            display: "flex",
            gap: 6,
            alignItems: "center",
          }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: p.color,
            }}
          />
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const BookingAnalytics = () => {
  const [granularity, setGranularity] = useState("monthly");
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = useCallback(() => {
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

  useEffect(() => load(), [load]);

  return (
    <div className="adm-chart-card">
      <div className="adm-chart-card-header">
        <div className="adm-chart-title-row">
          <span
            className="adm-title-icon adm-title-icon-green"
            aria-hidden="true">
            <FaChartLine />
          </span>
          <div>
            <h3 className="adm-chart-title">Booking Trends</h3>
            <p className="adm-chart-sub">Total bookings by status over time</p>
          </div>
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
        <div className="adm-chart-empty">
          <div className="adm-chart-empty-title">Unable to load analytics</div>
          We couldn't retrieve booking trend data.
          <div>
            <button className="adm-retry-btn" onClick={load}>
              Retry
            </button>
          </div>
        </div>
      )}
      {status === "empty" && (
        <div className="adm-chart-empty">
          <div className="adm-chart-empty-title">No booking data yet</div>
          Booking trends will appear here once Fixly receives bookings.
        </div>
      )}
      {status === "ready" && (
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              width={34}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
            <Area
              type="monotone"
              dataKey="total"
              name="Total"
              stroke="#16A34A"
              strokeWidth={2.5}
              fill="url(#colorTotal)"
            />
            <Area
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke="#22C55E"
              strokeWidth={2}
              fillOpacity={0}
            />
            <Area
              type="monotone"
              dataKey="cancelled"
              name="Cancelled"
              stroke="#EF4444"
              strokeWidth={2}
              fillOpacity={0}
              strokeDasharray="4 3"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BookingAnalytics;
