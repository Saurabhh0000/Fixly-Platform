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
import { getCategoryPerformance } from "../../api/adminAnalyticsApi";

const CategoryPerformance = ({ period }) => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
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
        <div className="adm-chart-empty">Unable to load analytics.</div>
      )}
      {status === "empty" && (
        <div className="adm-chart-empty">
          No booking data available for this period.
        </div>
      )}
      {status === "ready" && (
        <ResponsiveContainer
          width="100%"
          height={Math.max(220, data.length * 44)}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <YAxis
              type="category"
              dataKey="categoryName"
              width={110}
              tick={{ fontSize: 12, fill: "#0f172a" }}
            />
            <Tooltip />
            <Bar
              dataKey="totalBookings"
              name="Bookings"
              fill="#16a34a"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CategoryPerformance;
