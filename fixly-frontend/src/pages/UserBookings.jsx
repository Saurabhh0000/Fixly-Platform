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
  FaTimes,
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

// Local (Asia/Kolkata-safe) YYYY-MM-DD — avoids toISOString()'s UTC shift.
const getTodayLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const validateCancellationReason = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return "Cancellation reason is required.";
  if (trimmed.length < 3)
    return "Cancellation reason must be at least 3 characters.";
  if (trimmed.length > 500)
    return "Cancellation reason cannot exceed 500 characters.";
  return "";
};

const validateRescheduleDate = (value) => {
  if (!value) return "Please select a service date.";
  if (value < getTodayLocalDateString())
    return "Service date cannot be in the past.";
  return "";
};

const getErrorMessage = (err, fallback) => {
  const status = err?.response?.status;
  const serverMessage = err?.response?.data?.message;
  if (status === 400)
    return (
      serverMessage ||
      "Unable to update this booking. Please check the information and try again."
    );
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403)
    return serverMessage || "You are not authorized to modify this booking.";
  if (status === 404) return serverMessage || "Booking not found.";
  if (status === 409)
    return (
      serverMessage ||
      "This booking was already updated. Please refresh your bookings."
    );
  if (status === 500) return "Something went wrong. Please try again later.";
  return serverMessage || fallback;
};

const UserBookings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  // ===== CANCELLATION STATE =====
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // ===== RESCHEDULE STATE =====
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);

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

  /* ===== CANCEL MODAL HANDLERS ===== */
  const openCancelModal = (booking) => {
    setCancelTarget(booking);
    setCancellationReason("");
    setCancelError("");
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    if (isCancelling) return;
    setShowCancelModal(false);
    setCancelTarget(null);
    setCancellationReason("");
    setCancelError("");
  };

  const handleConfirmCancel = async () => {
    if (isCancelling || !cancelTarget) return;
    const validationError = validateCancellationReason(cancellationReason);
    if (validationError) {
      setCancelError(validationError);
      return;
    }
    setIsCancelling(true);
    setCancelError("");
    try {
      await fixlyApi.put(`/api/bookings/${cancelTarget.bookingId}/cancel`, {
        reason: cancellationReason.trim(),
      });
      toast.success("Booking cancelled successfully.", { duration: 3500 });
      setShowCancelModal(false);
      setCancelTarget(null);
      setCancellationReason("");
      await loadBookings();
    } catch (err) {
      setCancelError(
        getErrorMessage(
          err,
          "Unable to cancel this booking. Please try again.",
        ),
      );
    } finally {
      setIsCancelling(false);
    }
  };

  /* ===== RESCHEDULE MODAL HANDLERS ===== */
  const openRescheduleModal = (booking) => {
    setRescheduleTarget(booking);
    setRescheduleDate("");
    setRescheduleError("");
    setShowRescheduleModal(true);
  };

  const closeRescheduleModal = () => {
    if (isRescheduling) return;
    setShowRescheduleModal(false);
    setRescheduleTarget(null);
    setRescheduleDate("");
    setRescheduleError("");
  };

  const handleConfirmReschedule = async () => {
    if (isRescheduling || !rescheduleTarget) return;
    const validationError = validateRescheduleDate(rescheduleDate);
    if (validationError) {
      setRescheduleError(validationError);
      return;
    }
    setIsRescheduling(true);
    setRescheduleError("");
    try {
      await fixlyApi.put(
        `/api/bookings/${rescheduleTarget.bookingId}/reschedule`,
        {
          serviceDate: rescheduleDate,
        },
      );
      toast.success("Booking rescheduled successfully.", { duration: 3500 });
      setShowRescheduleModal(false);
      setRescheduleTarget(null);
      setRescheduleDate("");
      await loadBookings();
    } catch (err) {
      setRescheduleError(
        getErrorMessage(
          err,
          "Unable to reschedule this booking. Please try again.",
        ),
      );
    } finally {
      setIsRescheduling(false);
    }
  };

  /* ===== ESCAPE KEY CLOSES OPEN MODAL ===== */
  useEffect(() => {
    if (!showCancelModal && !showRescheduleModal) return;
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (showCancelModal) closeCancelModal();
      if (showRescheduleModal) closeRescheduleModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCancelModal, showRescheduleModal, isCancelling, isRescheduling]);

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

                    {/* ===== CANCEL BOOKING ACTION ===== */}
                    {(b.status === "PENDING" || b.status === "ACCEPTED") && (
                      <div className="ub-booking-action-row">
                        <button
                          type="button"
                          className="ub-cancel-action-btn"
                          onClick={() => openCancelModal(b)}>
                          <FaBan className="ub-cancel-action-icon" /> Cancel
                          Booking
                        </button>
                      </div>
                    )}

                    {/* ===== CANCELLATION INFO + RESCHEDULE ACTION ===== */}
                    {b.status === "CANCELLED" && (
                      <>
                        {(b.cancellationReason ||
                          b.cancelledBy ||
                          b.cancelledAt) && (
                          <div className="ub-cancel-info-block">
                            {b.cancellationReason && (
                              <div className="ub-cancel-info-row">
                                <span className="ub-cancel-info-label">
                                  Cancellation Reason
                                </span>
                                <span className="ub-cancel-info-value">
                                  {b.cancellationReason}
                                </span>
                              </div>
                            )}
                            {b.cancelledBy && (
                              <div className="ub-cancel-info-row">
                                <span className="ub-cancel-info-label">
                                  Cancelled By
                                </span>
                                <span className="ub-cancel-info-value">
                                  {b.cancelledBy}
                                </span>
                              </div>
                            )}
                            {b.cancelledAt && (
                              <div className="ub-cancel-info-row">
                                <span className="ub-cancel-info-label">
                                  Cancelled On
                                </span>
                                <span className="ub-cancel-info-value">
                                  {new Date(b.cancelledAt).toLocaleString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="ub-booking-action-row">
                          <button
                            type="button"
                            className="ub-reschedule-action-btn"
                            onClick={() => openRescheduleModal(b)}>
                            <FaCalendarAlt className="ub-reschedule-action-icon" />{" "}
                            Reschedule Booking
                          </button>
                        </div>
                      </>
                    )}

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

        {/* ===== CANCEL BOOKING MODAL ===== */}
        {showCancelModal && cancelTarget && (
          <div className="ub-modal-backdrop">
            <div
              className="ub-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ub-cancel-modal-title">
              <div className="ub-modal-header">
                <h3 id="ub-cancel-modal-title" className="ub-modal-title">
                  Cancel Booking
                </h3>
                <button
                  type="button"
                  className="ub-modal-close"
                  aria-label="Close"
                  onClick={closeCancelModal}
                  disabled={isCancelling}>
                  <FaTimes />
                </button>
              </div>

              <p className="ub-modal-desc">
                Are you sure you want to cancel this booking?
              </p>

              <div className="ub-modal-field">
                <label htmlFor="ub-cancel-reason" className="ub-modal-label">
                  Cancellation Reason
                </label>
                <textarea
                  id="ub-cancel-reason"
                  className="ub-modal-textarea"
                  placeholder="Please tell us why you want to cancel..."
                  value={cancellationReason}
                  maxLength={500}
                  disabled={isCancelling}
                  onChange={(e) => {
                    setCancellationReason(e.target.value);
                    if (cancelError) setCancelError("");
                  }}
                />
                <div className="ub-modal-textarea-footer">
                  {cancelError ? (
                    <span className="ub-modal-error">{cancelError}</span>
                  ) : (
                    <span />
                  )}
                  <span className="ub-char-counter">
                    {cancellationReason.length} / 500
                  </span>
                </div>
              </div>

              <div className="ub-modal-actions">
                <button
                  type="button"
                  className="ub-modal-btn ub-modal-btn-secondary"
                  onClick={closeCancelModal}
                  disabled={isCancelling}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="ub-modal-btn ub-modal-btn-danger"
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}>
                  {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== RESCHEDULE BOOKING MODAL ===== */}
        {showRescheduleModal && rescheduleTarget && (
          <div className="ub-modal-backdrop">
            <div
              className="ub-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ub-reschedule-modal-title">
              <div className="ub-modal-header">
                <h3 id="ub-reschedule-modal-title" className="ub-modal-title">
                  Reschedule Booking
                </h3>
                <button
                  type="button"
                  className="ub-modal-close"
                  aria-label="Close"
                  onClick={closeRescheduleModal}
                  disabled={isRescheduling}>
                  <FaTimes />
                </button>
              </div>

              <div className="ub-reschedule-summary">
                <div className="ub-reschedule-summary-row">
                  <FaTools className="ub-reschedule-summary-icon" />
                  <span>{rescheduleTarget.category}</span>
                </div>
                <div className="ub-reschedule-summary-row">
                  <FaUserTie className="ub-reschedule-summary-icon" />
                  <span>
                    {rescheduleTarget.providerName || "Assigned Provider"}
                  </span>
                </div>
              </div>

              <div className="ub-modal-field">
                <label htmlFor="ub-reschedule-date" className="ub-modal-label">
                  Select New Service Date
                </label>
                <input
                  id="ub-reschedule-date"
                  type="date"
                  className="ub-modal-date-input"
                  min={getTodayLocalDateString()}
                  value={rescheduleDate}
                  disabled={isRescheduling}
                  onChange={(e) => {
                    setRescheduleDate(e.target.value);
                    if (rescheduleError) setRescheduleError("");
                  }}
                />
                {rescheduleError && (
                  <span className="ub-modal-error">{rescheduleError}</span>
                )}
              </div>

              <div className="ub-modal-actions">
                <button
                  type="button"
                  className="ub-modal-btn ub-modal-btn-secondary"
                  onClick={closeRescheduleModal}
                  disabled={isRescheduling}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="ub-modal-btn ub-modal-btn-primary"
                  onClick={handleConfirmReschedule}
                  disabled={isRescheduling}>
                  {isRescheduling ? "Rescheduling..." : "Confirm Reschedule"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserBookings;
