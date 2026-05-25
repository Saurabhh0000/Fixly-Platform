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
  FaPhoneAlt,
  FaHourglassHalf,
  FaBolt,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaFireAlt,
  FaHashtag,
} from "react-icons/fa";
import fixlyApi from "../api/fixlyApi";
import toast from "react-hot-toast";
import OtpVerifyModal from "../pages/OtpVerifyModal";
import "../styles/fixly-provider-dashboard.css";
import ProviderLayout from "../layouts/ProviderLayout";
import { AuthContext } from "../context/AuthContext";

const CARDS_PER_PAGE = 6;

const FILTERS = [
  { key: "ALL", label: "All", icon: <FaListUl /> },
  { key: "PENDING", label: "Pending", icon: <FaHourglassHalf /> },
  { key: "ACCEPTED", label: "Accepted", icon: <FaClock /> },
  { key: "COMPLETED", label: "Completed", icon: <FaCheckCircle /> },
  { key: "CANCELLED", label: "Cancelled", icon: <FaTimesCircle /> },
];

const BAND_CLS = {
  PENDING: "pd-band-pending",
  ACCEPTED: "pd-band-accepted",
  COMPLETED: "pd-band-completed",
  CANCELLED: "pd-band-cancelled",
};

const STATUS_PILL_CLS = {
  PENDING: "pd-pill-pending",
  ACCEPTED: "pd-pill-accepted",
  COMPLETED: "pd-pill-completed",
  CANCELLED: "pd-pill-cancelled",
};

const ProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [otpBookingId, setOtpBookingId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const { user } = useContext(AuthContext);
  const providerId = user?.providerId;

  const loadBookings = async () => {
    if (!providerId) return;
    try {
      setLoading(true);
      const res = await fixlyApi.get(`/api/bookings/provider/${providerId}`);
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err?.response?.status === 401) return;
      toast.error("Unable to load bookings. Please refresh.", {
        duration: 4000,
      });
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [providerId]);

  const normalize = (s) => (s || "").toUpperCase().trim();

  /* ===== STATS ===== */
  const totalBookings = bookings.length;
  const pending = bookings.filter(
    (b) => normalize(b.status) === "PENDING",
  ).length;
  const accepted = bookings.filter(
    (b) => normalize(b.status) === "ACCEPTED",
  ).length;
  const completed = bookings.filter((b) => normalize(b.status) === "COMPLETED");
  const cancelled = bookings.filter(
    (b) => normalize(b.status) === "CANCELLED",
  ).length;
  const earnings = completed.reduce(
    (sum, b) => sum + (b.pricePerVisit || 0),
    0,
  );
  const ratings = completed.filter((b) => b.rating != null);
  const avgRating =
    ratings.length > 0
      ? (ratings.reduce((s, b) => s + b.rating, 0) / ratings.length).toFixed(1)
      : "0";

  /* ===== FILTER + PAGINATION ===== */
  const filtered =
    filter === "ALL"
      ? bookings
      : bookings.filter((b) => normalize(b.status) === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * CARDS_PER_PAGE,
    safePage * CARDS_PER_PAGE,
  );

  const handleFilter = (key) => {
    setFilter(key);
    setPage(1);
  };

  /* ===== ACTIONS ===== */
  const accept = async (id) => {
    try {
      await fixlyApi.put(`/api/bookings/${id}/accept`);
      toast.success("Booking accepted successfully.", { duration: 3500 });
      loadBookings();
    } catch {
      toast.error("Failed to accept booking. Please try again.", {
        duration: 3500,
      });
    }
  };

  const cancel = async (id) => {
    try {
      await fixlyApi.put(`/api/bookings/${id}/cancel`);
      toast.success("Booking cancelled.", { duration: 3500 });
      loadBookings();
    } catch {
      toast.error("Failed to cancel booking. Please try again.", {
        duration: 3500,
      });
    }
  };

  /* ===== STAT CARDS CONFIG ===== */
  const stats = [
    {
      label: "Total",
      value: totalBookings,
      icon: <FaClipboardList />,
      cls: "pd-stat-blue",
    },
    {
      label: "Pending",
      value: pending,
      icon: <FaHourglassHalf />,
      cls: "pd-stat-amber",
    },
    {
      label: "Accepted",
      value: accepted,
      icon: <FaClock />,
      cls: "pd-stat-sky",
    },
    {
      label: "Completed",
      value: completed.length,
      icon: <FaCheckCircle />,
      cls: "pd-stat-green",
    },
    {
      label: "Cancelled",
      value: cancelled,
      icon: <FaTimesCircle />,
      cls: "pd-stat-red",
    },
    {
      label: "Earnings",
      value: `₹${earnings}`,
      icon: <FaRupeeSign />,
      cls: "pd-stat-violet",
    },
  ];

  return (
    <ProviderLayout>
      <div className="pd-wrapper">
        {/* ===== HERO BANNER ===== */}
        <div className="pd-hero">
          <div className="pd-hero-deco pd-deco-1" />
          <div className="pd-hero-deco pd-deco-2" />
          <div className="pd-hero-deco pd-deco-3" />
          <div className="pd-hero-content">
            <div className="pd-hero-avatar">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div className="pd-hero-text">
              <h2 className="pd-hero-title">
                Welcome back,{" "}
                <span className="pd-hero-name">{user?.fullName}</span> 👋
              </h2>
              <p className="pd-hero-sub">
                Manage your bookings and track your earnings
              </p>
            </div>
            <div className="pd-hero-rating-badge">
              <FaStar className="pd-hero-star" />
              <span>{avgRating}</span>
              <span className="pd-hero-rating-lbl">Avg Rating</span>
            </div>
          </div>
        </div>

        {/* ===== STATS ===== */}
        <div className="pd-stats-grid">
          {stats.map((s, i) => (
            <div key={i} className={`pd-stat-card ${s.cls}`}>
              <div className="pd-stat-icon">{s.icon}</div>
              <div className="pd-stat-body">
                <span className="pd-stat-num">{s.value}</span>
                <span className="pd-stat-lbl">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ===== FILTER BAR ===== */}
        <div className="pd-filter-bar">
          <div className="pd-filter-label">
            <FaFilter className="pd-filter-icon" /> Filter
          </div>
          <div className="pd-filter-chips">
            {FILTERS.map((f) => {
              const count =
                f.key === "ALL"
                  ? bookings.length
                  : bookings.filter((b) => normalize(b.status) === f.key)
                      .length;
              return (
                <button
                  key={f.key}
                  className={`pd-chip pd-chip-${f.key.toLowerCase()} ${filter === f.key ? "pd-chip-active" : ""}`}
                  onClick={() => handleFilter(f.key)}>
                  {f.icon}
                  <span className="pd-chip-label">{f.label}</span>
                  <span className="pd-chip-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== EMPTY ===== */}
        {!loading && filtered.length === 0 && (
          <div className="pd-empty">
            <div className="pd-empty-icon">
              <FaClipboardList />
            </div>
            <h4>
              {filter === "ALL"
                ? "No bookings yet"
                : `No ${filter.toLowerCase()} bookings`}
            </h4>
            <p>
              {filter === "ALL"
                ? "Bookings will appear here once customers book your service."
                : `You have no ${filter.toLowerCase()} bookings right now.`}
            </p>
            {filter !== "ALL" && (
              <button
                className="pd-empty-btn"
                onClick={() => handleFilter("ALL")}>
                View All Bookings
              </button>
            )}
          </div>
        )}

        {/* ===== BOOKING GRID ===== */}
        {filtered.length > 0 && (
          <>
            {filter !== "ALL" && (
              <p className="pd-results-line">
                Showing <strong>{filtered.length}</strong>{" "}
                {filter.toLowerCase()} booking{filtered.length !== 1 ? "s" : ""}
              </p>
            )}

            <div className="pd-card-grid">
              {paginated.map((b) => {
                const st = normalize(b.status);
                const bandCls = BAND_CLS[st] || "pd-band-pending";
                const pillCls = STATUS_PILL_CLS[st] || "pd-pill-pending";
                const initial = b.customerName?.charAt(0)?.toUpperCase() || "C";

                return (
                  <div key={b.bookingId} className="pd-card">
                    {/* GRADIENT BAND */}
                    <div className={`pd-card-band ${bandCls}`}>
                      <div className="pd-band-deco pd-bd-1" />
                      <div className="pd-band-deco pd-bd-2" />

                      {/* Avatar + name */}
                      <div className="pd-band-left">
                        <div className="pd-band-avatar">{initial}</div>
                        <div className="pd-band-info">
                          <p className="pd-band-lbl">Customer</p>
                          <p className="pd-band-name">{b.customerName}</p>
                        </div>
                      </div>

                      {/* Status + rating */}
                      <div className="pd-band-right">
                        <div className={`pd-status-pill ${pillCls}`}>{st}</div>
                        {b.rating != null && (
                          <div className="pd-rating-pill">
                            <FaStar /> {b.rating}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* FLOATING BODY */}
                    <div className="pd-card-body">
                      {/* CATEGORY */}
                      <div className="pd-card-category">
                        <FaBolt className="pd-cat-icon" />
                        {b.category || "Service"}
                      </div>

                      {/* INFO GRID */}
                      <div className="pd-info-grid">
                        <div className="pd-info-tile">
                          <span className="pd-info-icon pd-ic-blue">
                            <FaCalendarAlt />
                          </span>
                          <div className="pd-info-text">
                            <span className="pd-info-label">Date</span>
                            <span className="pd-info-val">{b.serviceDate}</span>
                          </div>
                        </div>

                        <div className="pd-info-tile">
                          <span className="pd-info-icon pd-ic-red">
                            <FaMapMarkerAlt />
                          </span>
                          <div className="pd-info-text">
                            <span className="pd-info-label">Location</span>
                            <span className="pd-info-val">
                              {b.area}, {b.city}
                            </span>
                            {b.pincode && (
                              <span className="pd-info-pin">
                                <FaHashtag className="pd-pin-hash" />
                                {b.pincode}
                              </span>
                            )}
                          </div>
                        </div>

                        {(st === "ACCEPTED" || st === "COMPLETED") &&
                          b.customerPhone &&
                          b.customerPhone.trim() !== "" && (
                            <div className="pd-info-tile pd-tile-full">
                              <span className="pd-info-icon pd-ic-green">
                                <FaPhoneAlt />
                              </span>
                              <div className="pd-info-text">
                                <span className="pd-info-label">Phone</span>
                                <span className="pd-info-val">
                                  {b.customerPhone}
                                </span>
                              </div>
                            </div>
                          )}
                      </div>

                      {/* BOTTOM ROW */}
                      <div className="pd-card-bottom">
                        <div className="pd-price-pill">
                          <FaRupeeSign className="pd-rupee" />
                          <span>{b.pricePerVisit || 0}</span>
                        </div>

                        <div className="pd-action-row">
                          {st === "PENDING" && (
                            <>
                              <button
                                className="pd-btn pd-btn-accept"
                                onClick={() => accept(b.bookingId)}>
                                <FaCheckCircle /> Accept
                              </button>
                              <button
                                className="pd-btn pd-btn-cancel"
                                onClick={() => cancel(b.bookingId)}>
                                <FaTimesCircle /> Cancel
                              </button>
                            </>
                          )}
                          {st === "ACCEPTED" && (
                            <button
                              className="pd-btn pd-btn-otp"
                              onClick={() => setOtpBookingId(b.bookingId)}>
                              <FaKey /> Verify OTP
                            </button>
                          )}
                          {st === "COMPLETED" && (
                            <span className="pd-done-badge pd-done-green">
                              <FaCheckCircle /> Completed
                            </span>
                          )}
                          {st === "CANCELLED" && (
                            <span className="pd-done-badge pd-done-red">
                              <FaTimesCircle /> Cancelled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===== PAGINATION ===== */}
            {totalPages > 1 && (
              <div className="pd-pagination">
                <button
                  className="pd-page-btn pd-page-arrow"
                  disabled={safePage === 1}
                  onClick={() => setPage(safePage - 1)}>
                  <FaChevronLeft />
                </button>
                <div className="pd-page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (n) => {
                      if (
                        totalPages > 7 &&
                        n !== 1 &&
                        n !== totalPages &&
                        Math.abs(n - safePage) > 2
                      ) {
                        if (n === safePage - 3 || n === safePage + 3)
                          return (
                            <span key={n} className="pd-page-ellipsis">
                              …
                            </span>
                          );
                        return null;
                      }
                      return (
                        <button
                          key={n}
                          className={`pd-page-btn ${safePage === n ? "pd-page-active" : ""}`}
                          onClick={() => setPage(n)}>
                          {n}
                        </button>
                      );
                    },
                  )}
                </div>
                <button
                  className="pd-page-btn pd-page-arrow"
                  disabled={safePage === totalPages}
                  onClick={() => setPage(safePage + 1)}>
                  <FaChevronRight />
                </button>
                <span className="pd-page-info">
                  {safePage}/{totalPages} · {filtered.length} bookings
                </span>
              </div>
            )}
          </>
        )}

        {/* ===== RATINGS TABLE ===== */}
        <div className="pd-ratings-section">
          <div className="pd-ratings-card">
            <div className="pd-ratings-header">
              <div className="pd-ratings-header-icon">
                <FaStar />
              </div>
              <div>
                <h3 className="pd-ratings-title">Customer Ratings</h3>
                <p className="pd-ratings-sub">
                  Average: <strong>{avgRating} / 5</strong> across{" "}
                  {ratings.length} review{ratings.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {ratings.length === 0 ? (
              <div className="pd-no-ratings">
                <FaStar className="pd-empty-star" />
                <p>No ratings received yet.</p>
              </div>
            ) : (
              <div className="pd-table-wrap">
                <table className="pd-ratings-table">
                  <thead>
                    <tr>
                      <th>#</th>
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
                          <span className={`pd-rating-badge pd-r-${b.rating}`}>
                            <FaStar /> {b.rating}
                          </span>
                        </td>
                        <td data-label="Feedback">
                          {b.description || (
                            <span className="pd-no-feedback">No feedback</span>
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

export default ProviderDashboard;
