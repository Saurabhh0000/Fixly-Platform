import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { FaChartPie } from "react-icons/fa";

const COLORS = {
  Completed: "#16A34A",
  Pending: "#F59E0B",
  Accepted: "#3B82F6",
  Cancelled: "#EF4444",
};

const BookingStatusChart = ({ overview }) => {
  if (!overview) return null;

  const raw = [
    { name: "Completed", value: overview.completedBookings },
    { name: "Pending", value: overview.pendingBookings },
    { name: "Accepted", value: overview.acceptedBookings },
    { name: "Cancelled", value: overview.cancelledBookings },
  ];
  const total = raw.reduce((sum, d) => sum + d.value, 0);
  const data = raw.filter((d) => d.value > 0);

  return (
    <div className="adm-chart-card">
      <div className="adm-chart-card-header">
        <div className="adm-chart-title-row">
          <span
            className="adm-title-icon adm-title-icon-blue"
            aria-hidden="true">
            <FaChartPie />
          </span>
          <div>
            <h3 className="adm-chart-title">Booking Status</h3>
            <p className="adm-chart-sub">For the selected period</p>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="adm-chart-empty">
          <div className="adm-chart-empty-title">No booking data yet</div>
          Status breakdown will appear here once bookings come in.
        </div>
      ) : (
        <>
          <div className="adm-donut-wrap">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={2}
                  strokeWidth={0}>
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} bookings`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="adm-donut-center">
              <div className="adm-donut-center-value">
                {total.toLocaleString("en-IN")}
              </div>
              <div className="adm-donut-center-label">Total</div>
            </div>
          </div>
          <div className="adm-donut-legend">
            {data.map((d) => (
              <div className="adm-donut-legend-row" key={d.name}>
                <span
                  className="adm-donut-dot"
                  style={{ background: COLORS[d.name] }}
                />
                {d.name}
                <span className="adm-donut-legend-pct">
                  {total > 0 ? `${Math.round((d.value / total) * 100)}%` : "0%"}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingStatusChart;
