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
import { getCategoryPerformance } from "../../api/adminAnalyticsApi";

const CategoryPerformance = ({ period }) => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = useCallback(() => {
    let active = true;
    setStatus("loading");
    getCategoryPerformance(period)
      .then((res) => {
        if (!active) return;
        setData(res.data);
        setStatus(res.data.length === 0 ? "empty" : "ready");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, [period]);

  useEffect(() => load(), [load]);

  const tall = data.length > 8;

  return (
    <div className="adm-chart-card">
      <div className="adm-chart-card-header">
        <div>
          <h3 className="adm-chart-title">Category Performance</h3>
          <p className="adm-chart-sub">
            Bookings by service category, for the selected period
          </p>
        </div>
      </div>

      {status === "loading" && (
        <div className="adm-chart-skeleton">Loading dashboard...</div>
      )}
      {status === "error" && (
        <div className="adm-chart-empty">
          <div className="adm-chart-empty-title">Unable to load analytics</div>
          We couldn't retrieve category data.
          <div>
            <button className="adm-retry-btn" onClick={load}>
              Retry
            </button>
          </div>
        </div>
      )}
      {status === "empty" && (
        <div className="adm-chart-empty">
          <div className="adm-chart-empty-title">No category data yet</div>
          Category performance will appear here once bookings come in.
        </div>
      )}
      {status === "ready" && (
        <div className={tall ? "adm-cat-scroll" : ""}>
          <ResponsiveContainer
            width="100%"
            height={Math.max(240, data.length * 42)}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#EEF2F6"
                horizontal={false}
              />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#64748B" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="categoryName"
                width={110}
                tick={{ fontSize: 12, fill: "#0F172A", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v) => [`${v} bookings`, ""]}
                cursor={{ fill: "#F0FDF4" }}
              />
              <Bar
                dataKey="totalBookings"
                name="Bookings"
                fill="#16A34A"
                radius={[0, 8, 8, 0]}
                maxBarSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CategoryPerformance;
