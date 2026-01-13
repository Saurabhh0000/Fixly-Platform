import { useEffect, useState, useContext } from "react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaKey,
  FaListUl,
  FaSmile,
  FaClipboardList,
  FaClock,
  FaRupeeSign,
  FaStar,
  FaHourglassHalf,
} from "react-icons/fa";
import fixlyApi from "../api/fixlyApi";
import toast from "react-hot-toast";
import OtpVerifyModal from "../pages/OtpVerifyModal";
import "../styles/fixly-provider-dashboard.css";
import ProviderLayout from "../layouts/ProviderLayout";
import { AuthContext } from "../context/AuthContext";

/* ================= FILTER CONFIG ================= */
const FILTERS = [
  { key: "ALL", label: "ALL Booking", icon: <FaListUl /> },
  { key: "PENDING", label: "PENDING", icon: <FaHourglassHalf /> },
  { key: "ACCEPTED", label: "ACCEPTED", icon: <FaClock /> },
  { key: "COMPLETED", label: "COMPLETED", icon: <FaCheckCircle /> },
  { key: "CANCELLED", label: "CANCELLED", icon: <FaTimesCircle /> },
];

const ProviderDashboard = () => {
  /* ================= STATE ================= */
  const [bookings, setBookings] = useState([]);
  const [otpBookingId, setOtpBookingId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const providerId = user?.providerId;

  /* ================= LOAD BOOKINGS ================= */
  const loadBookings = async () => {
    if (!providerId) return;

    try {
      setLoading(true);
      const res = await fixlyApi.get(`/api/bookings/provider/${providerId}`);
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err?.response?.status === 401) return;
      toast.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [providerId]);

  /* ================= HELPERS ================= */
  const normalize = (s) => (s || "").toUpperCase().trim();

  /* ================= STATS ================= */
  const totalBookings = bookings.length;
  const pending = bookings.filter(
    (b) => normalize(b.status) === "PENDING"
  ).length;
  const accepted = bookings.filter(
    (b) => normalize(b.status) === "ACCEPTED"
  ).length;
  const completed = bookings.filter((b) => normalize(b.status) === "COMPLETED");
  const cancelled = bookings.filter(
    (b) => normalize(b.status) === "CANCELLED"
  ).length;

  const earnings = completed.reduce(
    (sum, b) => sum + (b.pricePerVisit || 0),
    0
  );

  const ratings = completed.filter((b) => b.rating != null);
  const avgRating =
    ratings.length > 0
      ? (ratings.reduce((s, b) => s + b.rating, 0) / ratings.length).toFixed(1)
      : "0";

  /* ================= FILTER ================= */
  const filteredBookings =
    filter === "ALL"
      ? bookings
      : bookings.filter((b) => normalize(b.status) === filter);

  /* ================= ACTIONS ================= */
  const accept = async (id) => {
    await fixlyApi.put(`/api/bookings/${id}/accept`);
    toast.success("Booking accepted");
    loadBookings();
  };

  const cancel = async (id) => {
    await fixlyApi.put(`/api/bookings/${id}/cancel`);
    toast.success("Booking cancelled");
    loadBookings();
  };

  /* ================= RENDER ================= */
  return (
    <ProviderLayout>
      <div className="provider-dashboard">
        {/* WELCOME */}
        <div className="provider-welcome">
          <FaSmile className="welcome-icon" />
          <div>
            <h2>Welcome back, {user?.fullName} 👋</h2>
            <p>Manage your bookings and track your earnings</p>
          </div>
        </div>

        {/* STATS */}
        <div className="provider-stats">
          <StatCard
            title="Bookings"
            value={totalBookings}
            icon={<FaClipboardList />}
            color="blue"
          />
          <StatCard
            title="Pending"
            value={pending}
            icon={<FaClock />}
            color="yellow"
          />
          <StatCard
            title="Accepted"
            value={accepted}
            icon={<FaCheckCircle />}
            color="lightblue"
          />
          <StatCard
            title="Completed"
            value={completed.length}
            icon={<FaCheckCircle />}
            color="green"
          />
          <StatCard
            title="Cancelled"
            value={cancelled}
            icon={<FaTimesCircle />}
            color="red"
          />
          <StatCard
            title="Earnings"
            value={`₹ ${earnings}`}
            icon={<FaRupeeSign />}
            color="purple"
          />
        </div>

        {/* FILTER BAR (FIXED ICONS) */}
        <div className="booking-filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-btn ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}>
              {f.icon}
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* EMPTY */}
        {!loading && filteredBookings.length === 0 && (
          <div className="booking-empty">
            <div className="empty-avatar">
              <FaClipboardList />
            </div>
            <h4>No bookings found</h4>
            <p>No bookings match the selected filter.</p>
          </div>
        )}

        {/* BOOKINGS */}
        <div className="booking-grid">
          {filteredBookings.map((b) => (
            <div key={b.bookingId} className="booking-profile-card">
              <div className="booking-cover">
                <span
                  className={`status-pill ${normalize(
                    b.status
                  ).toLowerCase()}`}>
                  {normalize(b.status)}
                </span>

                {b.rating != null && (
                  <div className="rating-pill">
                    <FaStar /> {b.rating}
                  </div>
                )}
              </div>

              <div className="booking-avatar">
                <FaUser />
              </div>

              <div className="booking-content">
                <div className="customer-name">{b.customerName}</div>

                <div className="address-text">
                  <FaMapMarkerAlt />
                  {b.area}, {b.city} - {b.pincode}
                </div>

                <div className="date-text">
                  <FaCalendarAlt />
                  {b.serviceDate}
                </div>

                <div className="price-info-bar">
                  <div className="price-row">
                    <FaRupeeSign />
                    <span>
                      Service Charge: <strong>₹{b.pricePerVisit || 0}</strong>
                    </span>
                  </div>
                </div>

                <div className="booking-actions">
                  {normalize(b.status) === "PENDING" && (
                    <>
                      <button
                        className="action-btn accept"
                        onClick={() => accept(b.bookingId)}>
                        <FaCheckCircle /> Accept
                      </button>
                      <button
                        className="action-btn cancel"
                        onClick={() => cancel(b.bookingId)}>
                        <FaTimesCircle /> Cancel
                      </button>
                    </>
                  )}

                  {normalize(b.status) === "ACCEPTED" && (
                    <button
                      className="action-btn otp"
                      onClick={() => setOtpBookingId(b.bookingId)}>
                      <FaKey /> Verify OTP
                    </button>
                  )}

                  {normalize(b.status) === "COMPLETED" && (
                    <span className="completed-badge">
                      <FaCheckCircle /> Completed
                    </span>
                  )}

                  {normalize(b.status) === "CANCELLED" && (
                    <span className="cancelled-badge">
                      <FaTimesCircle /> Cancelled
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RATINGS */}
        <div className="ratings-section">
          <div className="ratings-card">
            <h3 className="ratings-title">
              <FaStar className="rating-icon" /> Customer Ratings ({avgRating})
            </h3>

            {ratings.length === 0 ? (
              <div className="no-ratings">
                <FaStar className="empty-star" />
                <p>No ratings available yet.</p>
              </div>
            ) : (
              <div className="ratings-table-wrapper">
                <table className="ratings-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Rating</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.map((b) => (
                      <tr key={b.bookingId}>
                        <td data-label="ID">#{b.bookingId}</td>
                        <td data-label="Customer">{b.customerName}</td>
                        <td data-label="Rating">
                          <span className={`rating-badge r-${b.rating}`}>
                            <FaStar /> {b.rating}
                          </span>
                        </td>
                        <td data-label="Feedback">
                          {b.description || (
                            <span className="no-feedback">No feedback</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {otpBookingId && (
          <OtpVerifyModal
            bookingId={otpBookingId}
            onClose={() => setOtpBookingId(null)}
            onSuccess={loadBookings}
          />
        )}
      </div>
    </ProviderLayout>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-details">
      <p className="stat-title">{title}</p>
      <h4>{value}</h4>
    </div>
  </div>
);

export default ProviderDashboard;
