import { useEffect, useMemo, useState, useContext } from "react";
import {
  FaBolt,
  FaTimesCircle,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
  FaRupeeSign,
  FaStar,
  FaChartLine,
  FaChartPie,
  FaCalendarAlt,
  FaTrophy,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import fixlyApi from "../api/fixlyApi";
import { getMyProfile } from "../api/profileApi";
import toast from "react-hot-toast";
import "../styles/fixly-provider-dashboard.css";
import ProviderLayout from "../layouts/ProviderLayout";
import { AuthContext } from "../context/AuthContext";

const CHART_GREEN = "#16a34a";
const CHART_GREEN_DARK = "#166534";
const CHART_GREEN_LIGHT = "#86efac";
const CHART_GREEN_SOFT = "#dcfce7";

const ANALYTICS_PERIODS = [
  { key: "DAY", label: "Day", description: "Last 24 hours" },
  { key: "WEEK", label: "Week", description: "Last 7 days" },
  { key: "MONTH", label: "Month", description: "Last 6 months" },
  { key: "YEAR", label: "Year", description: "Last 5 years" },
];

const resolveImage = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = (import.meta.env.VITE_API_BASE_URL || "")
    .replace(/\/$/, "")
    .replace(/\/api$/, "");
  return base + (path.startsWith("/") ? "" : "/") + path;
};

const normalize = (value) => (value || "").toUpperCase().trim();
const parseBookingDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatDay = (date) =>
  date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const getPeriodConfig = (period) => {
  const now = new Date();
  const end = new Date(now);
  let start;
  let points = [];

  if (period === "DAY") {
    start = new Date(now);
    start.setDate(start.getDate() - 0);
    start = startOfDay(start);
    for (let i = 0; i < 24; i += 1) {
      const d = new Date(start);
      d.setHours(i, 0, 0, 0);
      points.push({
        key: d.toISOString().slice(0, 13),
        label: d.toLocaleTimeString("en-IN", { hour: "numeric" }),
        start: d,
        end: new Date(d.getTime() + 60 * 60 * 1000),
      });
    }
  } else if (period === "WEEK") {
    start = startOfDay(now);
    start.setDate(start.getDate() - 6);
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      points.push({
        key: d.toISOString().slice(0, 10),
        label: formatDay(d),
        start: d,
        end: new Date(d.getTime() + 24 * 60 * 60 * 1000),
      });
    }
  } else if (period === "YEAR") {
    start = new Date(now.getFullYear() - 4, 0, 1);
    for (let i = 0; i < 5; i += 1) {
      const d = new Date(now.getFullYear() - 4 + i, 0, 1);
      points.push({
        key: String(d.getFullYear()),
        label: String(d.getFullYear()),
        start: d,
        end: new Date(d.getFullYear() + 1, 0, 1),
      });
    }
  } else {
    start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    for (let i = 0; i < 6; i += 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      points.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: d.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        start: d,
        end: new Date(d.getFullYear(), d.getMonth() + 1, 1),
      });
    }
  }

  return { now, start, end, points };
};

const isInRange = (date, start, end) => date && date >= start && date < end;

const getMonthKey = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const getMonthSeries = () => {
  const now = new Date();
  const months = [];
  for (let i = MONTH_COUNT - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-IN", { month: "short" }),
    });
  }
  return months;
};

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const providerId = user?.providerId;

  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [analyticsPeriod, setAnalyticsPeriod] = useState("MONTH");

  const loadDashboard = async () => {
    if (!providerId) return;

    try {
      setLoading(true);
      const [bookingsRes, profileRes, statusRes] = await Promise.all([
        fixlyApi.get(`/api/bookings/provider/${providerId}`),
        getMyProfile(),
        fixlyApi.get(`/api/providers/status/${user.id}`),
      ]);

      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      setProfile(profileRes.data || null);
      setAvailable(Boolean(statusRes.data?.available));
    } catch (err) {
      if (err?.response?.status === 401) return;
      toast.error("Unable to load provider dashboard. Please refresh.", {
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [providerId, user?.id]);

  const analytics = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => normalize(b.status) === "PENDING").length;
    const accepted = bookings.filter((b) => normalize(b.status) === "ACCEPTED").length;
    const completedBookings = bookings.filter((b) => normalize(b.status) === "COMPLETED");
    const cancelled = bookings.filter((b) => normalize(b.status) === "CANCELLED").length;

    const completedValue = completedBookings.reduce(
      (sum, booking) => sum + Number(booking.pricePerVisit || 0),
      0,
    );

    const rated = bookings.filter((b) => b.rating != null && Number(b.rating) > 0);
    const avgRating =
      rated.length > 0
        ? rated.reduce((sum, b) => sum + Number(b.rating), 0) / rated.length
        : 0;

    const { start, end, points } = getPeriodConfig(analyticsPeriod);
    const periodBookings = bookings.filter((b) => {
      const date = parseBookingDate(b.serviceDate);
      return isInRange(date, start, end);
    });
    const periodCompleted = periodBookings.filter((b) => normalize(b.status) === "COMPLETED");
    const periodCancelled = periodBookings.filter((b) => normalize(b.status) === "CANCELLED");
    const periodRated = periodBookings.filter((b) => b.rating != null && Number(b.rating) > 0);

    const bookingTrend = points.map((point) => {
      const rows = periodBookings.filter((b) => {
        const date = parseBookingDate(b.serviceDate);
        return isInRange(date, point.start, point.end);
      });
      return {
        label: point.label,
        bookings: rows.length,
        completed: rows.filter((b) => normalize(b.status) === "COMPLETED").length,
      };
    });

    const earningsTrend = points.map((point) => {
      const rows = periodCompleted.filter((b) => {
        const date = parseBookingDate(b.serviceDate);
        return isInRange(date, point.start, point.end);
      });
      return {
        label: point.label,
        value: rows.reduce((sum, booking) => sum + Number(booking.pricePerVisit || 0), 0),
      };
    });

    const statusData = [
      { name: "Pending", value: periodBookings.filter((b) => normalize(b.status) === "PENDING").length },
      { name: "Accepted", value: periodBookings.filter((b) => normalize(b.status) === "ACCEPTED").length },
      { name: "Completed", value: periodCompleted.length },
      { name: "Cancelled", value: periodCancelled.length },
    ];

    const ratingData = [1, 2, 3, 4, 5].map((rating) => ({
      rating: `${rating}★`,
      reviews: periodRated.filter((b) => Math.round(Number(b.rating)) === rating).length,
    }));

    const completionRate =
      periodBookings.length > 0
        ? Math.round((periodCompleted.length / periodBookings.length) * 100)
        : 0;

    const cancellationRate =
      periodBookings.length > 0
        ? Math.round((periodCancelled.length / periodBookings.length) * 100)
        : 0;

    const periodAvgRating =
      periodRated.length > 0
        ? periodRated.reduce((sum, b) => sum + Number(b.rating), 0) / periodRated.length
        : 0;

    return {
      total,
      pending,
      accepted,
      completed: completedBookings.length,
      cancelled,
      completedValue,
      avgRating,
      ratedCount: rated.length,
      periodBookings: periodBookings.length,
      periodCompleted: periodCompleted.length,
      periodRatedCount: periodRated.length,
      periodCompletedValue: periodCompleted.reduce(
        (sum, booking) => sum + Number(booking.pricePerVisit || 0),
        0,
      ),
      periodAvgRating,
      bookingTrend,
      earningsTrend,
      statusData,
      ratingData,
      completionRate,
      cancellationRate,
    };
  }, [bookings, analyticsPeriod]);

  const stats = [
    {
      label: "Total",
      value: analytics.total,
      icon: <FaClipboardList />,
      cls: "pd-stat-blue",
      desc: "All bookings received",
    },
    {
      label: "Pending",
      value: analytics.pending,
      icon: <FaHourglassHalf />,
      cls: "pd-stat-amber",
      desc: "Awaiting your response",
    },
    {
      label: "Accepted",
      value: analytics.accepted,
      icon: <FaClock />,
      cls: "pd-stat-sky",
      desc: "Confirmed, not yet done",
    },
    {
      label: "Completed",
      value: analytics.completed,
      icon: <FaCheckCircle />,
      cls: "pd-stat-green",
      desc: "Successfully finished jobs",
    },
    {
      label: "Cancelled",
      value: analytics.cancelled,
      icon: <FaTimesCircle />,
      cls: "pd-stat-red",
      desc: "Bookings that fell through",
    },
    {
      label: "Earnings",
      value: `₹${analytics.completedValue}`,
      icon: <FaRupeeSign />,
      cls: "pd-stat-violet",
      desc: "Completed booking value",
    },
  ];

  const dashboardUser = profile || user;
  const profilePicture = resolveImage(
    dashboardUser?.profilePicture || dashboardUser?.profileImage,
  );

  const toggleAvailability = async () => {
    try {
      const next = !available;
      await fixlyApi.put(
        `/api/providers/${providerId}/availability?available=${next}`,
      );
      setAvailable(next);
      toast.success(
        next ? "You are now available" : "You are now offline",
        { duration: 3000 },
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update availability",
      );
    }
  };

  if (loading) {
    return (
      <div className="pd-loader">
        <div className="pd-loader-card" role="status" aria-live="polite">
          <div className="pd-loader-mark">
            <div className="pd-loader-ring" />
            <span className="pd-loader-logo">F</span>
          </div>
          <h2 className="pd-loader-title">Preparing your dashboard</h2>
          <p>Loading bookings, profile and provider analytics…</p>
          <div className="pd-loader-progress" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <ProviderLayout>
      <div className="pd-wrapper">
        <section className="pd-hero">
          <div className="pd-hero-deco pd-deco-1" />
          <div className="pd-hero-deco pd-deco-2" />
          <div className="pd-hero-deco pd-deco-3" />

          <div className="pd-hero-content">
            <div className="pd-hero-avatar">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={dashboardUser?.fullName || "Provider"}
                  className="pd-hero-avatar-image"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove(
                      "pd-avatar-initial-hidden",
                    );
                  }}
                />
              ) : null}
              <span
                className={
                  profilePicture ? "pd-avatar-initial-hidden" : ""
                }>
                {dashboardUser?.fullName?.charAt(0)?.toUpperCase() || "P"}
              </span>
            </div>

            <div className="pd-hero-text">
              <h2 className="pd-hero-title">
                Welcome back,{" "}
                <span className="pd-hero-name">
                  {dashboardUser?.fullName || "Provider"}
                </span>{" "}
                👋
              </h2>
              <p className="pd-hero-sub">
                Monitor your bookings, service performance and earnings
              </p>
            </div>

            <div className="pd-hero-rating-badge">
              <FaStar className="pd-hero-star" />
              <span>
                {analytics.avgRating ? analytics.avgRating.toFixed(1) : "0.0"}
              </span>
              <span className="pd-hero-rating-lbl">Avg Rating</span>
            </div>
          </div>
        </section>

        <div
          className="avail-wrap"
          onClick={toggleAvailability}
          role="button"
          aria-pressed={available}
          aria-label={available ? "Go offline" : "Go available"}>
          <div
            className={`avail-icon-ring ${
              available ? "avail-ring-on" : "avail-ring-off"
            }`}>
            {available ? <FaBolt /> : <FaTimesCircle />}
          </div>
          <div className="avail-text">
            <p className="avail-label">
              {available
                ? "You're live and accepting bookings"
                : "You're offline — not taking bookings"}
            </p>
            <p className="avail-sub">
              {available
                ? "Customers can find and book your services right now"
                : "Go available to start receiving new booking requests"}
            </p>
          </div>
          <div className="pd-availability-control">
            <div className={`avail-dot ${available ? "avail-dot-on" : "avail-dot-off"}`} />
            <div
              className={`avail-track ${
                available ? "avail-track-on" : "avail-track-off"
              }`}>
              <div className="avail-thumb" />
            </div>
          </div>
        </div>

        <div className="pd-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className={`pd-stat-card ${stat.cls}`}>
              <div className="pd-stat-card-deco" />
              <div className="pd-stat-icon">{stat.icon}</div>
              <div className="pd-stat-body">
                <span className="pd-stat-num">{stat.value}</span>
                <span className="pd-stat-lbl">{stat.label}</span>
                <span className="pd-stat-desc">{stat.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <section className="pd-analytics-head">
          <div>
            <span className="pd-analytics-kicker">PROVIDER ANALYTICS</span>
            <h2>Performance overview</h2>
            <p>
              Explore booking activity, completion, customer ratings and completed booking value across different time periods.
            </p>
          </div>
          <div className="pd-analytics-period-picker" role="group" aria-label="Analytics period">
            {ANALYTICS_PERIODS.map((period) => (
              <button
                key={period.key}
                type="button"
                className={`pd-period-btn ${analyticsPeriod === period.key ? "pd-period-btn-active" : ""}`}
                onClick={() => setAnalyticsPeriod(period.key)}
                title={period.description}
                aria-pressed={analyticsPeriod === period.key}>
                {period.label}
              </button>
            ))}
          </div>
        </section>

        <section className="pd-insight-grid pd-insight-grid-top">
          <div className="pd-insight-card pd-insight-completion">
            <span className="pd-insight-icon"><FaCheckCircle /></span>
            <div>
              <strong>{analytics.completionRate}%</strong>
              <span>Completion rate</span>
              <small>Completed bookings ÷ all bookings</small>
            </div>
          </div>
          <div className="pd-insight-card">
            <span className="pd-insight-icon"><FaTimesCircle /></span>
            <div>
              <strong>{analytics.cancellationRate}%</strong>
              <span>Cancellation rate</span>
              <small>Cancelled bookings ÷ all bookings</small>
            </div>
          </div>
          <div className="pd-insight-card">
            <span className="pd-insight-icon"><FaStar /></span>
            <div>
              <strong>{analytics.periodAvgRating ? analytics.periodAvgRating.toFixed(1) : "0.0"}/5</strong>
              <span>Average rating</span>
              <small>Based on rated bookings in period</small>
            </div>
          </div>
          <div className="pd-insight-card">
            <span className="pd-insight-icon"><FaTrophy /></span>
            <div>
              <strong>{analytics.periodCompleted}</strong>
              <span>Jobs completed</span>
              <small>Completed services in period</small>
            </div>
          </div>
        </section>

        <section className="pd-analytics-grid">
          <article className="pd-chart-card pd-chart-wide">
            <div className="pd-chart-head">
              <div className="pd-chart-title">
                <span className="pd-chart-icon"><FaChartLine /></span>
                <div>
                  <h3>Booking activity</h3>
                  <p>Requests and completed jobs in the selected period</p>
                </div>
              </div>
            </div>
            <div className="pd-chart-body">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.bookingTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    name="Bookings"
                    stroke={CHART_GREEN}
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke={CHART_GREEN_DARK}
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="pd-chart-card">
            <div className="pd-chart-head">
              <div className="pd-chart-title">
                <span className="pd-chart-icon"><FaChartPie /></span>
                <div>
                  <h3>Booking status</h3>
                  <p>Booking mix for the selected period</p>
                </div>
              </div>
            </div>
            <div className="pd-chart-body pd-pie-body">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={86}
                    paddingAngle={3}>
                    {analytics.statusData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          entry.name === "Completed"
                            ? CHART_GREEN
                            : entry.name === "Pending"
                              ? CHART_GREEN_LIGHT
                              : entry.name === "Accepted"
                                ? CHART_GREEN_DARK
                                : "#cbd5e1"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={28} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="pd-chart-card pd-chart-wide">
            <div className="pd-chart-head">
              <div className="pd-chart-title">
                <span className="pd-chart-icon"><FaRupeeSign /></span>
                <div>
                  <h3>Completed booking value</h3>
                  <p>Value of completed services in the selected period</p>
                </div>
              </div>
            </div>
            <div className="pd-chart-body">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.earningsTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip formatter={(value) => [`₹${value}`, "Value"]} />
                  <Bar
                    dataKey="value"
                    name="Completed value"
                    fill={CHART_GREEN}
                    radius={[7, 7, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="pd-chart-card">
            <div className="pd-chart-head">
              <div className="pd-chart-title">
                <span className="pd-chart-icon"><FaStar /></span>
                <div>
                  <h3>Customer ratings</h3>
                  <p>{analytics.periodRatedCount} rated booking{analytics.periodRatedCount === 1 ? "" : "s"}</p>
                </div>
              </div>
            </div>
            <div className="pd-chart-body">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.ratingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="rating" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="reviews"
                    name="Reviews"
                    fill={CHART_GREEN_DARK}
                    radius={[7, 7, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

>
      </div>
    </ProviderLayout>
  );
};

export default ProviderDashboard;
