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
  FaExclamationTriangle,
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

// Statuses a provider is allowed to cancel from
const CANCELLABLE_STATUSES = ["PENDING", "ACCEPTED"];

const REASON_MIN_LEN = 3;
const REASON_MAX_LEN = 500;

const validateCancellationReason = (raw) => {
  const value = (raw || "").trim();
  if (!value) return "Cancellation reason is required.";
  if (value.length < REASON_MIN_LEN)
    return `Cancellation reason must be at least ${REASON_MIN_LEN} characters.`;
  if (value.length > REASON_MAX_LEN)
    return `Cancellation reason cannot exceed ${REASON_MAX_LEN} characters.`;
  return "";
};

const CANCEL_STATUS_MESSAGES = {
  400: "Unable to cancel this booking. Please check the booking status.",
  401: "Your session has expired. Please login again.",
  403: "You are not authorized to cancel this booking.",
  404: "Booking not found.",
  409: "This booking has already been updated. Please refresh your bookings.",
  500: "Something went wrong while cancelling the booking. Please try again later.",
};

const getCancelErrorMessage = (err) => {
  const status = err?.response?.status;
  const serverMessage = err?.response?.data?.message;
  if (serverMessage) return serverMessage;
  if (status && CANCEL_STATUS_MESSAGES[status])
    return CANCEL_STATUS_MESSAGES[status];
  return "Something went wrong while cancelling the booking. Please try again later.";
};

/* ==================================================================
   PROVIDER CANCEL BOOKING MODAL
   ================================================================== */
const ProviderCancelBookingModal = ({
  booking,
  reason,
  onReasonChange,
  error,
  isSubmitting,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  if (!booking) return null;

  const trimmedLen = (reason || "").trim().length;
  const rawLen = (reason || "").length;

  return (
    <div
      className="provider-cancel-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}>
      <div
        className="provider-cancel-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="provider-cancel-title">
        <div className="provider-cancel-header">
          <div className="provider-cancel-header-icon">
            <FaExclamationTriangle />
          </div>
          <div>
            <h3 id="provider-cancel-title" className="provider-cancel-title">
              Cancel Booking
            </h3>
            <p className="provider-cancel-subtitle">
              Are you sure you want to cancel this booking?
            </p>
          </div>
        </div>

        <div className="provider-cancel-body">
          <div className="provider-cancel-summary">
            <div className="provider-cancel-summary-row">
              <span className="provider-cancel-summary-label">Booking</span>
              <span className="provider-cancel-summary-value">
                #{booking.bookingId}
              </span>
            </div>
            <div className="provider-cancel-summary-row">
              <span className="provider-cancel-summary-label">Customer</span>
              <span className="provider-cancel-summary-value">
                {booking.customerName}
              </span>
            </div>
            <div className="provider-cancel-summary-row">
              <span className="provider-cancel-summary-label">Category</span>
              <span className="provider-cancel-summary-value">
                {booking.category || "Service"}
              </span>
            </div>
            <div className="provider-cancel-summary-row">
              <span className="provider-cancel-summary-label">Date</span>
              <span className="provider-cancel-summary-value">
                {booking.serviceDate}
              </span>
            </div>
          </div>

          <label
            htmlFor="provider-cancel-reason"
            className="provider-cancel-label">
            Cancellation Reason
          </label>
          <textarea
            id="provider-cancel-reason"
            className={`provider-cancel-textarea ${error ? "provider-cancel-textarea-error" : ""}`}
            placeholder="Please tell us why you want to cancel this booking..."
            value={reason}
            maxLength={REASON_MAX_LEN}
            disabled={isSubmitting}
            onChange={(e) => onReasonChange(e.target.value)}
            aria-invalid={!!error}
            aria-describedby="provider-cancel-counter provider-cancel-error-msg"
          />

          <div className="provider-cancel-meta-row">
            <span
              id="provider-cancel-error-msg"
              className="provider-cancel-error"
              role="alert">
              {error || ""}
            </span>
            <span
              id="provider-cancel-counter"
              className="provider-cancel-counter">
              {trimmedLen === rawLen ? rawLen : trimmedLen}/{REASON_MAX_LEN}
            </span>
          </div>
        </div>

        <div className="provider-cancel-actions">
          <button
            type="button"
            className="provider-cancel-btn provider-cancel-btn-secondary"
            disabled={isSubmitting}
            onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="provider-cancel-btn provider-cancel-btn-danger"
            disabled={isSubmitting}
            onClick={onConfirm}>
            {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [otpBookingId, setOtpBookingId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [available, setAvailable] = useState(true);

  // ===== Provider cancellation modal state =====
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const { user } = useContext(AuthContext);
  const providerId = user?.providerId;

  const loadBookings = async () => {
    if (!providerId) return;
    try {
      setLoading(true);
      const res = await fixlyApi.get(`/api/bookings/provider/${providerId}`);
      setBookings(Array.isArray(res.data) ? res.data : []);
      const providerRes = await fixlyApi.get(
        `/api/providers/status/${user.id}`,
      );

      setAvailable(providerRes.data.available);
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

  const toggleAvailability = async () => {
    try {
      const newValue = !available;

      await fixlyApi.put(
        `/api/providers/${providerId}/availability?available=${newValue}`,
      );

      setAvailable(newValue);

      toast.success(newValue ? "You are now available" : "You are now offline");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update availability",
      );
    }
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

  /* ===== PROVIDER CANCELLATION FLOW ===== */
  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setCancellationReason("");
    setCancelError("");
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    if (isCancelling) return;
    setShowCancelModal(false);
    setSelectedBooking(null);
    setCancellationReason("");
    setCancelError("");
  };

  const handleReasonChange = (value) => {
    if (value.length > REASON_MAX_LEN) return;
    setCancellationReason(value);
    if (cancelError) setCancelError("");
  };

  const confirmCancelBooking = async () => {
    if (isCancelling) return;

    if (!selectedBooking || !selectedBooking.bookingId) {
      setCancelError(
        "This booking could not be found. Please refresh and try again.",
      );
      return;
    }

    const status = normalize(selectedBooking.status);
    if (!CANCELLABLE_STATUSES.includes(status)) {
      setCancelError("This booking can no longer be cancelled.");
      return;
    }

    const reasonValidationError =
      validateCancellationReason(cancellationReason);
    if (reasonValidationError) {
      setCancelError(reasonValidationError);
      return;
    }

    const trimmedReason = cancellationReason.trim();

    try {
      setIsCancelling(true);
      await fixlyApi.put(
        `/api/bookings/${selectedBooking.bookingId}/cancel`,
        { reason: trimmedReason },
        { headers: { "Content-Type": "application/json" } },
      );

      setShowCancelModal(false);
      setSelectedBooking(null);
      setCancellationReason("");
      setCancelError("");

      toast.success("Booking cancelled successfully.", { duration: 3500 });
      loadBookings();
    } catch (err) {
      const status = err?.response?.status;
      const message = getCancelErrorMessage(err);

      if (status === 409) {
        toast.error(message, { duration: 4500 });
        setShowCancelModal(false);
        setSelectedBooking(null);
        setCancellationReason("");
        setCancelError("");
        loadBookings();
      } else if (status === 401) {
        toast.error(message, { duration: 4500 });
        setShowCancelModal(false);
        setSelectedBooking(null);
        setCancellationReason("");
        setCancelError("");
      } else {
        setCancelError(message);
      }
    } finally {
      setIsCancelling(false);
    }
  };

  /* ===== STAT CARDS CONFIG — icon, number, label + short description ===== */
  const stats = [
    {
      label: "Total",
      value: totalBookings,
      icon: <FaClipboardList />,
      cls: "pd-stat-blue",
      desc: "All bookings received",
    },
    {
      label: "Pending",
      value: pending,
      icon: <FaHourglassHalf />,
      cls: "pd-stat-amber",
      desc: "Awaiting your response",
    },
    {
      label: "Accepted",
      value: accepted,
      icon: <FaClock />,
      cls: "pd-stat-sky",
      desc: "Confirmed, not yet done",
    },
    {
      label: "Completed",
      value: completed.length,
      icon: <FaCheckCircle />,
      cls: "pd-stat-green",
      desc: "Successfully finished jobs",
    },
    {
      label: "Cancelled",
      value: cancelled,
      icon: <FaTimesCircle />,
      cls: "pd-stat-red",
      desc: "Bookings that fell through",
    },
    {
      label: "Earnings",
      value: `₹${earnings}`,
      icon: <FaRupeeSign />,
      cls: "pd-stat-violet",
      desc: "Total from completed jobs",
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

        <div
          className="avail-wrap"
          onClick={toggleAvailability}
          role="button"
          aria-pressed={available}
          aria-label={available ? "Go offline" : "Go available"}>
          {/* Icon ring */}
          <div
            className={`avail-icon-ring ${available ? "avail-ring-on" : "avail-ring-off"}`}>
            {available ? <FaBolt /> : <FaTimesCircle />}
          </div>

          {/* Text */}
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

          {/* Pulsing dot + track */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              className={`avail-dot ${available ? "avail-dot-on" : "avail-dot-off"}`}
            />
            <div
              className={`avail-track ${available ? "avail-track-on" : "avail-track-off"}`}>
              <div className="avail-thumb" />
            </div>
          </div>
        </div>

        {/* ===== STATS ===== */}
        <div className="pd-stats-grid">
          {stats.map((s, i) => (
            <div key={i} className={`pd-stat-card ${s.cls}`}>
              <div className="pd-stat-card-deco" />
              <div className="pd-stat-icon">{s.icon}</div>
              <div className="pd-stat-body">
                <span className="pd-stat-num">{s.value}</span>
                <span className="pd-stat-lbl">{s.label}</span>
                <span className="pd-stat-desc">{s.desc}</span>
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
                const canCancel = CANCELLABLE_STATUSES.includes(st);

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
                                onClick={() => openCancelModal(b)}>
                                <FaTimesCircle /> Cancel Booking
                              </button>
                            </>
                          )}
                          {st === "ACCEPTED" && (
                            <>
                              <button
                                className="pd-btn pd-btn-otp"
                                onClick={() => setOtpBookingId(b.bookingId)}>
                                <FaKey /> Verify OTP
                              </button>
                              <button
                                className="pd-btn pd-btn-cancel"
                                onClick={() => openCancelModal(b)}>
                                <FaTimesCircle /> Cancel Booking
                              </button>
                            </>
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

        {showCancelModal && (
          <ProviderCancelBookingModal
            booking={selectedBooking}
            reason={cancellationReason}
            onReasonChange={handleReasonChange}
            error={cancelError}
            isSubmitting={isCancelling}
            onClose={closeCancelModal}
            onConfirm={confirmCancelBooking}
          />
        )}
      </div>
    </ProviderLayout>
  );
};

export default ProviderDashboard;
