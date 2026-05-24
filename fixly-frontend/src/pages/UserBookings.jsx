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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/fixly-bookings.css";
import ReviewModal from "./ReviewModal";
import emptyBookingsImg from "../assets/empty-bookings.png";
import UserLayout from "../layouts/UserLayout";

const UserBookings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

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
    PENDING: {
      label: "Pending",
      cls: "ub-status-pending",
      icon: <FaClock />,
    },
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
        {/* ===== PAGE HEADER ===== */}
        <div className="ub-page-header">
          <div className="ub-page-header-left">
            <div className="ub-header-icon">
              <FaClipboardList />
            </div>
            <div>
              <h2 className="ub-page-title">My Bookings</h2>
              <p className="ub-page-sub">
                {bookings.length > 0
                  ? `${bookings.length} booking${bookings.length > 1 ? "s" : ""} found`
                  : "Your service reservations"}
              </p>
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
          /* ===== BOOKINGS GRID ===== */
          <div className="ub-grid">
            {bookings.map((b) => {
              const status = getStatus(b.status);
              return (
                <div key={b.bookingId} className="ub-card">
                  {/* ACCENT STRIP */}
                  <div className={`ub-card-strip ${status.cls}-strip`} />

                  {/* CARD HEADER */}
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
                  {b.providerPhone && (
                    <div className="ub-info-row">
                      <FaPhoneAlt className="ub-info-icon" />

                      <span>{b.providerPhone}</span>
                    </div>
                  )}

                  {/* META ROW */}
                  <div className="ub-meta-grid">
                    <div className="ub-meta-item">
                      <div className="ub-meta-icon blue">
                        <FaCalendarAlt />
                      </div>
                      <div className="ub-meta-text">
                        <span className="ub-meta-label">Date</span>
                        <span className="ub-meta-value">
                          {new Date(b.serviceDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
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
                      </div>
                    </div>
                  </div>

                  {/* PINCODE */}
                  {b.pincode && (
                    <div className="ub-pincode">
                      <FaShieldAlt className="ub-pincode-icon" />
                      PIN: {b.pincode}
                    </div>
                  )}

                  {/* OTP SECTION */}
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

                  {/* PRICE ROW */}
                  <div className="ub-price-row">
                    <span className="ub-price-label">Net Amount</span>
                    <span className="ub-price-value">
                      <FaRupeeSign className="ub-rupee-icon" />
                      {b.price}
                    </span>
                  </div>

                  {/* REVIEW SECTION */}
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
                          <FaStar />
                          {b.rating} / 5 &nbsp;·&nbsp; Reviewed
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
