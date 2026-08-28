import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = {
  Completed: "#16a34a",
  Pending: "#f59e0b",
  Accepted: "#3b82f6",
  Cancelled: "#ef4444",
};

const BookingStatusChart = ({ overview }) => {
  if (!overview) return null;

  const data = [
    { name: "Completed", value: overview.completedBookings },
    { name: "Pending", value: overview.pendingBookings },
    { name: "Accepted", value: overview.acceptedBookings },
    { name: "Cancelled", value: overview.cancelledBookings },
  ].filter((d) => d.value > 0);

  return (
    <div className="adm-chart-card">
      <div className="adm-chart-card-header">
        <div>
          <h3 className="adm-chart-title">Booking Status Distribution</h3>
          <p className="adm-chart-sub">For the selected period</p>
        </div>
      </div>
      {data.length === 0 ? (
        <div className="adm-chart-empty">
          No booking data available for this period.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BookingStatusChart;
