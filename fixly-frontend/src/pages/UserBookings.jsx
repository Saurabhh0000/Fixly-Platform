import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import fixlyApi from "../api/fixlyApi";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaUserTie,
  FaExclamationTriangle,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaTools,
  FaStar,
  FaShieldAlt,
  FaArrowRight,
  FaPhoneAlt,
  FaChevronLeft,
  FaChevronRight,
  FaHashtag,
  FaFilter,
  FaListAlt,
  FaBolt,
  FaBan,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/fixly-bookings.css";
import ReviewModal from "./ReviewModal";
import emptyBookingsImg from "../assets/empty-bookings.png";
import UserLayout from "../layouts/UserLayout";

const CARDS_PER_PAGE = 6;

const FILTERS = [
  { key: "ALL", label: "All", icon: <FaListAlt /> },
  { key: "PENDING", label: "Pending", icon: <FaClock /> },
  { key: "ACCEPTED", label: "Accepted", icon: <FaBolt /> },
  { key: "COMPLETED", label: "Completed", icon: <FaCheckCircle /> },
  { key: "CANCELLED", label: "Cancelled", icon: <FaBan /> },
];

const UserBookings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const loadBookings = async () => {
    try {
      const res = await fixlyApi.get(`/api/bookings/user/${user.id}`);
      setBookings(res.data || []);
    } catch {
      toast.error("Unable to load your bookings. Please refresh the page.", {
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadBookings();
  }, [user?.id]);

  /* ===== STATUS CONFIG ===== */
  const statusConfig = {
    PENDING: { label: "Pending", cls: "ub-status-pending", icon: <FaClock /> },
    ACCEPTED: {
      label: "Accepted",
      cls: "ub-status-accepted",
      icon: <FaCheckCircle />,
    },
    COMPLETED: {
      label: "Completed",
      cls: "ub-status-completed",
      icon: <FaCheckCircle />,
    },
    CANCELLED: {
      label: "Cancelled",
      cls: "ub-status-cancelled",
      icon: <FaTimesCircle />,
    },
  };
  const getStatus = (s) =>
    statusConfig[s] || {
      label: s,
      cls: "ub-status-pending",
      icon: <FaClock />,
    };

  /* ===== FILTER ===== */
  const filtered =
    activeFilter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === activeFilter);

  const handleFilterChange = (key) => {
    setActiveFilter(key);
    setPage(1);
  };

  /* ===== PAGINATION ===== */
  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * CARDS_PER_PAGE,
    safePage * CARDS_PER_PAGE,
  );

  /* ===== STATS ===== */
  const completedCount = bookings.filter(
    (b) => b.status === "COMPLETED",
  ).length;
  const activeCount = bookings.filter(
    (b) => b.status === "PENDING" || b.status === "ACCEPTED",
  ).length;
  const cancelledCount = bookings.filter(
    (b) => b.status === "CANCELLED",
  ).length;

  /* Stat card definitions — icon, number, label + short description */
  const STATS = [
    {
      key: "total",
      tone: "total",
      icon: <FaListAlt />,
      iconCls: "ub-si-blue",
      value: bookings.length,
      label: "Total",
      desc: "All your service bookings",
    },
    {
      key: "completed",
      tone: "completed",
      icon: <FaCheckCircle />,
      iconCls: "ub-si-green",
      value: completedCount,
      label: "Completed",
      desc: "Successfully finished services",
    },
    {
      key: "active",
      tone: "active",
      icon: <FaBolt />,
      iconCls: "ub-si-amber",
      value: activeCount,
      label: "Active",
      desc: "Pending or accepted right now",
    },
    {
      key: "cancelled",
      tone: "cancelled",
      icon: <FaBan />,
      iconCls: "ub-si-red",
      value: cancelledCount,
      label: "Cancelled",
      desc: "Bookings that were cancelled",
    },
  ];

  /* ===== LOADER ===== */
  if (loading) {
    return (
      <div className="ub-page-loader">
        <div className="ub-loader-inner">
          <div className="ub-loader-ring" />
          <div className="ub-loader-logo">F</div>
        </div>
        <p className="ub-loader-text">Loading your bookings…</p>
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="ub-wrapper">
        {/* ===== HERO BANNER (no stats inside) ===== */}
        <div className="ub-hero">
          <div className="ub-hero-deco ub-deco-1" />
          <div className="ub-hero-deco ub-deco-2" />
          <div className="ub-hero-deco ub-deco-3" />
          <div className="ub-hero-content">
            <div className="ub-hero-icon-wrap">
              <FaClipboardList />
            </div>
            <div className="ub-hero-text">
              <h2 className="ub-hero-title">My Bookings</h2>
              <p className="ub-hero-sub">
                Track, manage and review all your service reservations
              </p>
            </div>
          </div>
        </div>

        {/* ===== STATS ROW (outside hero, with icons + description) ===== */}
        <div className="ub-stats-row">
          {STATS.map((s) => (
            <div key={s.key} className={`ub-stat-card ub-stat-${s.tone}`}>
              <div className="ub-stat-card-deco" />
              <div className={`ub-stat-icon-wrap ${s.iconCls}`}>{s.icon}</div>
              <div className="ub-stat-info">
                <span className="ub-stat-num">{s.value}</span>
                <span className="ub-stat-lbl">{s.label}</span>
                <span className="ub-stat-desc">{s.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ===== FILTER BAR ===== */}
        <div className="ub-filter-bar">
          <div className="ub-filter-label">
            <FaFilter className="ub-filter-icon" />
            <span>Filter</span>
          </div>
          <div className="ub-filter-chips">
            {FILTERS.map((f) => {
              const count =
                f.key === "ALL"
                  ? bookings.length
                  : bookings.filter((b) => b.status === f.key).length;
              return (
                <button
                  key={f.key}
                  className={`ub-chip ub-chip-${f.key.toLowerCase()} ${activeFilter === f.key ? "ub-chip-active" : ""}`}
                  onClick={() => handleFilterChange(f.key)}>
                  {f.icon}
                  {f.label}
                  <span className="ub-chip-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== EMPTY STATE ===== */}
        {filtered.length === 0 ? (
          <div className="ub-empty">
            {bookings.length === 0 ? (
              <img
                src={emptyBookingsImg}
                alt="No bookings"
                className="ub-empty-img"
              />
            ) : (
              <div className="ub-empty-icon-wrap">
                <FaFilter />
              </div>
            )}
            <h4 className="ub-empty-title">
              {bookings.length === 0
                ? "No bookings yet"
                : `No ${activeFilter.toLowerCase()} bookings`}
            </h4>
            <p className="ub-empty-sub">
              {bookings.length === 0
                ? "You haven't made any service bookings. Browse available providers and book your first service today."
                : `You don't have any ${activeFilter.toLowerCase()} bookings at the moment.`}
            </p>
            {bookings.length === 0 ? (
              <button
                className="ub-empty-btn"
                onClick={() => navigate("/search")}>
                Find a Service <FaArrowRight className="ub-empty-btn-icon" />
              </button>
            ) : (
              <button
                className="ub-empty-btn"
                onClick={() => handleFilterChange("ALL")}>
                View All Bookings
              </button>
            )}
          </div>
        ) : (
          <>
            {/* RESULTS LINE */}
            {activeFilter !== "ALL" && (
              <p className="ub-results-line">
                Showing <strong>{filtered.length}</strong>{" "}
                {activeFilter.toLowerCase()} booking
                {filtered.length !== 1 ? "s" : ""}
              </p>
            )}

            {/* ===== GRID ===== */}
            <div className="ub-grid">
              {paginated.map((b) => {
                const status = getStatus(b.status);
                return (
                  <div key={b.bookingId} className="ub-card">
                    <div className="ub-card-top">
                      <div className="ub-category-pill">
                        <FaTools className="ub-category-icon" />
                        <span>{b.category}</span>
                      </div>
                      <div className={`ub-status-badge ${status.cls}`}>
                        {status.icon}
                        {status.label}
                      </div>
                    </div>

                    <div className="ub-provider-row">
                      <div className="ub-provider-avatar">
                        {b.providerName?.charAt(0)?.toUpperCase() || "P"}
                      </div>
                      <div className="ub-provider-info">
                        <p className="ub-provider-label">Service Provider</p>
                        <p className="ub-provider-name">
                          {b.providerName || "Assigned Provider"}
                        </p>
                      </div>
                      <FaUserTie className="ub-provider-icon" />
                    </div>

                    {(b.status === "ACCEPTED" || b.status === "COMPLETED") &&
                      b.providerPhone &&
                      b.providerPhone.trim() !== "" && (
                        <div className="ub-info-row">
                          <FaPhoneAlt className="ub-info-icon" />
                          <span>{b.providerPhone}</span>
                        </div>
                      )}

                    <div className="ub-meta-grid">
                      <div className="ub-meta-item">
                        <div className="ub-meta-icon blue">
                          <FaCalendarAlt />
                        </div>
                        <div className="ub-meta-text">
                          <span className="ub-meta-label">Date</span>
                          <span className="ub-meta-value">
                            {new Date(b.serviceDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="ub-meta-item">
                        <div className="ub-meta-icon red">
                          <FaMapMarkerAlt />
                        </div>
                        <div className="ub-meta-text">
                          <span className="ub-meta-label">Location</span>
                          <span className="ub-meta-value">
                            {b.area}, {b.city}
                          </span>
                          {b.pincode && (
                            <span className="ub-meta-pin">
                              <FaHashtag className="ub-pin-hash" />
                              {b.pincode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {b.status === "ACCEPTED" && b.otp && (
                      <div className="ub-otp-block">
                        <div className="ub-otp-box">
                          <span className="ub-otp-label">
                            <FaShieldAlt /> Service OTP
                          </span>
                          <span className="ub-otp-value">{b.otp}</span>
                        </div>
                        <div className="ub-otp-warning">
                          <FaExclamationTriangle />
                          <span>
                            Share this OTP only after the service is completed
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="ub-divider" />

                    <div className="ub-price-row">
                      <span className="ub-price-label">Net Amount</span>
                      <span className="ub-price-value">
                        <FaRupeeSign className="ub-rupee-icon" />
                        {b.price}
                      </span>
                    </div>

                    {b.status === "COMPLETED" && (
                      <div className="ub-review-row">
                        {!b.reviewed ? (
                          <button
                            className="ub-review-btn"
                            onClick={() => {
                              setSelectedBooking(b);
                              setShowReview(true);
                            }}>
                            <FaStar className="ub-review-star" /> Rate this
                            Service
                          </button>
                        ) : (
                          <div className="ub-rated-badge">
                            <FaStar /> {b.rating} / 5 &nbsp;·&nbsp; Reviewed
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ===== PAGINATION ===== */}
            {totalPages > 1 && (
              <div className="ub-pagination">
                <button
                  className="ub-page-btn ub-page-arrow"
                  disabled={safePage === 1}
                  onClick={() => setPage(safePage - 1)}>
                  <FaChevronLeft />
                </button>
                <div className="ub-page-numbers">
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
                            <span key={n} className="ub-page-ellipsis">
                              …
                            </span>
                          );
                        return null;
                      }
                      return (
                        <button
                          key={n}
                          className={`ub-page-btn ${safePage === n ? "ub-page-active" : ""}`}
                          onClick={() => setPage(n)}>
                          {n}
                        </button>
                      );
                    },
                  )}
                </div>
                <button
                  className="ub-page-btn ub-page-arrow"
                  disabled={safePage === totalPages}
                  onClick={() => setPage(safePage + 1)}>
                  <FaChevronRight />
                </button>
                <span className="ub-page-info">
                  {safePage} / {totalPages} &nbsp;·&nbsp; {filtered.length}{" "}
                  bookings
                </span>
              </div>
            )}
          </>
        )}

        {showReview && selectedBooking && (
          <ReviewModal
            booking={selectedBooking}
            onClose={() => setShowReview(false)}
            onSuccess={() => {
              toast.success("Your review was submitted. Thank you!", {
                duration: 3500,
              });
              setShowReview(false);
              loadBookings();
            }}
          />
        )}
      </div>
    </UserLayout>
  );
};

export default UserBookings;
