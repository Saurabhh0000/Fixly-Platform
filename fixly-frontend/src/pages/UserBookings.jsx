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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/fixly-bookings.css";
import ReviewModal from "./ReviewModal";
import emptyBookingsImg from "../assets/empty-bookings.png";
import UserLayout from "../layouts/UserLayout";

const CARDS_PER_PAGE = 6;

const UserBookings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
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

  /* ===== PAGINATION ===== */
  const totalPages = Math.max(1, Math.ceil(bookings.length / CARDS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = bookings.slice(
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
        {/* ===== HERO HEADER ===== */}
        <div className="ub-hero">
          <div className="ub-hero-deco ub-deco-1" />
          <div className="ub-hero-deco ub-deco-2" />
          <div className="ub-hero-deco ub-deco-3" />

          <div className="ub-hero-top">
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

          <div className="ub-hero-stats">
            <div className="ub-stat-tile">
              <span className="ub-stat-num">{bookings.length}</span>
              <span className="ub-stat-lbl">Total</span>
            </div>
            <div className="ub-stat-divider" />
            <div className="ub-stat-tile">
              <span className="ub-stat-num">{completedCount}</span>
              <span className="ub-stat-lbl">Completed</span>
            </div>
            <div className="ub-stat-divider" />
            <div className="ub-stat-tile">
              <span className="ub-stat-num">{activeCount}</span>
              <span className="ub-stat-lbl">Active</span>
            </div>
          </div>
        </div>

        {/* ===== EMPTY STATE ===== */}
        {bookings.length === 0 ? (
          <div className="ub-empty">
            <img
              src={emptyBookingsImg}
              alt="No bookings"
              className="ub-empty-img"
            />
            <h4 className="ub-empty-title">No bookings yet</h4>
            <p className="ub-empty-sub">
              You haven't made any service bookings. Browse available providers
              and book your first service today.
            </p>
            <button
              className="ub-empty-btn"
              onClick={() => navigate("/search")}>
              Find a Service
              <FaArrowRight className="ub-empty-btn-icon" />
            </button>
          </div>
        ) : (
          <>
            {/* ===== GRID ===== */}
            <div className="ub-grid">
              {paginated.map((b) => {
                const status = getStatus(b.status);
                return (
                  <div key={b.bookingId} className="ub-card">
                    {/* CARD TOP */}
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

                    {/* PROVIDER */}
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

                    {/* PHONE — only when accepted or completed */}
                    {(b.status === "ACCEPTED" || b.status === "COMPLETED") &&
                      b.providerPhone &&
                      b.providerPhone.trim() !== "" && (
                        <div className="ub-info-row">
                          <FaPhoneAlt className="ub-info-icon" />
                          <span>{b.providerPhone}</span>
                        </div>
                      )}

                    {/* META GRID */}
                    <div className="ub-meta-grid">
                      {/* DATE */}
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

                      {/* LOCATION + PINCODE inside */}
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

                    {/* OTP */}
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

                    {/* DIVIDER */}
                    <div className="ub-divider" />

                    {/* PRICE */}
                    <div className="ub-price-row">
                      <span className="ub-price-label">Net Amount</span>
                      <span className="ub-price-value">
                        <FaRupeeSign className="ub-rupee-icon" />
                        {b.price}
                      </span>
                    </div>

                    {/* REVIEW */}
                    {b.status === "COMPLETED" && (
                      <div className="ub-review-row">
                        {!b.reviewed ? (
                          <button
                            className="ub-review-btn"
                            onClick={() => {
                              setSelectedBooking(b);
                              setShowReview(true);
                            }}>
                            <FaStar className="ub-review-star" />
                            Rate this Service
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
                  {safePage} / {totalPages} &nbsp;·&nbsp; {bookings.length}{" "}
                  bookings
                </span>
              </div>
            )}
          </>
        )}

        {/* REVIEW MODAL */}
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
