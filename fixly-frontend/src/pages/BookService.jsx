import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fixlyApi from "../api/fixlyApi";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserTie,
  FaRupeeSign,
  FaArrowRight,
  FaArrowLeft,
  FaShieldAlt,
  FaBolt,
  FaTools,
  FaExclamationTriangle,
  FaStar,
  FaClock,
  FaLock,
  FaTicketAlt,
  FaHome,
} from "react-icons/fa";
import "../styles/fixly-book.css";

/* ══════════════════════════════════════
   TOAST HELPERS
══════════════════════════════════════ */
const successToast = (msg) =>
  toast.custom(
    (t) => (
      <div
        className={`fb-toast fb-toast-success ${t.visible ? "fb-toast-in" : "fb-toast-out"}`}>
        <div className="fb-toast-icon-wrap fb-toast-icon-success">
          <FaCheckCircle />
        </div>
        <div className="fb-toast-body">
          <strong>Success</strong>
          <span>{msg}</span>
        </div>
      </div>
    ),
    { duration: 4500 },
  );

const errorToast = (msg) =>
  toast.custom(
    (t) => (
      <div
        className={`fb-toast fb-toast-error ${t.visible ? "fb-toast-in" : "fb-toast-out"}`}>
        <div className="fb-toast-icon-wrap fb-toast-icon-error">
          <FaExclamationTriangle />
        </div>
        <div className="fb-toast-body">
          <strong>Error</strong>
          <span>{msg}</span>
        </div>
      </div>
    ),
    { duration: 3500 },
  );

const warnToast = (msg) =>
  toast.custom(
    (t) => (
      <div
        className={`fb-toast fb-toast-warn ${t.visible ? "fb-toast-in" : "fb-toast-out"}`}>
        <div className="fb-toast-icon-wrap fb-toast-icon-warn">
          <FaExclamationTriangle />
        </div>
        <div className="fb-toast-body">
          <strong>Required</strong>
          <span>{msg}</span>
        </div>
      </div>
    ),
    { duration: 3000 },
  );

/* ══════════════════════════════════════
   COMPONENT
══════════════════════════════════════ */
const BookService = () => {
  const { state: provider } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const today = new Date().toISOString().split("T")[0];

  /* ── real rating, same fields the provider search API returns ── */
  const rating = provider?.averageRating ?? 0;
  const totalReviews = provider?.totalReviews ?? 0;
  const hasReviews = totalReviews > 0;
  const filledStars = Math.round(rating);

  useEffect(() => {
    if (!provider) {
      errorToast("Please select a provider first.");
      navigate("/search");
    }
  }, [provider, navigate]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchAddresses = async () => {
      try {
        const res = await fixlyApi.get(`/api/addresses/${user.id}`);
        setAddresses(res.data);
      } catch {
        errorToast("Failed to load your saved addresses.");
      }
    };
    fetchAddresses();
  }, [user?.id]);

  /* ── generate a readable booking ref ── */
  const genRef = () =>
    "FXL-" + Math.random().toString(36).toUpperCase().slice(2, 8);

  const handleBooking = async () => {
    if (!addressId) {
      warnToast("Please select a service address.");
      return;
    }
    if (!serviceDate) {
      warnToast("Please pick a preferred date.");
      return;
    }

    setLoading(true);
    try {
      await fixlyApi.post("/api/bookings", {
        userId: user.id,
        providerId: provider.providerId,
        addressId,
        serviceDate,
      });
      setBookingRef(genRef());
      setSuccess(true);
      successToast("Your appointment has been booked!");
      setTimeout(() => navigate("/user/bookings"), 4000);
    } catch (err) {
      errorToast(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ══ SUCCESS SCREEN ══ */
  if (success) {
    const formattedDate = serviceDate
      ? new Date(serviceDate).toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

    return (
      <div className="fb-status-page">
        {/* confetti dots */}
        <div className="fb-confetti" aria-hidden="true">
          {[...Array(14)].map((_, i) => (
            <div key={i} className={`fb-dot fb-dot-${i % 5}`} />
          ))}
        </div>

        <div className="fb-success-card">
          {/* top accent bar */}
          <div className="fb-success-bar" />

          {/* icon */}
          <div className="fb-success-icon-wrap">
            <div className="fb-success-icon-ring" />
            <div className="fb-success-icon-inner">
              <FaCheckCircle />
            </div>
          </div>

          <div className="fb-success-tag">
            <FaTicketAlt /> Booking Confirmed
          </div>

          <h2>Appointment Scheduled!</h2>
          <p>
            Your booking with <strong>{provider?.fullName}</strong> has been
            confirmed successfully.
          </p>

          {/* detail grid */}
          <div className="fb-success-details">
            <div className="fb-sd-row">
              <div className="fb-sd-icon">
                <FaUserTie />
              </div>
              <div className="fb-sd-body">
                <span>Service Provider</span>
                <strong>{provider?.fullName}</strong>
              </div>
            </div>
            <div className="fb-sd-row">
              <div className="fb-sd-icon">
                <FaTools />
              </div>
              <div className="fb-sd-body">
                <span>Service</span>
                <strong>{provider?.category || "Home Service"}</strong>
              </div>
            </div>
            <div className="fb-sd-row">
              <div className="fb-sd-icon">
                <FaCalendarAlt />
              </div>
              <div className="fb-sd-body">
                <span>Date</span>
                <strong>{formattedDate}</strong>
              </div>
            </div>
            <div className="fb-sd-row">
              <div className="fb-sd-icon rupee">
                <FaRupeeSign />
              </div>
              <div className="fb-sd-body">
                <span>Amount</span>
                <strong className="fb-sd-price">
                  ₹ {provider?.pricePerVisit}
                </strong>
              </div>
            </div>
          </div>

          {/* booking ref */}
          <div className="fb-booking-ref">
            <span>Booking Reference</span>
            <strong>{bookingRef}</strong>
          </div>

          {/* redirect note */}
          <div className="fb-redirect-note">
            <FaClock />
            <span>Redirecting to your bookings in a moment…</span>
          </div>
        </div>
      </div>
    );
  }

  /* ══ MAIN LAYOUT ══ */
  return (
    <div className="fb-page">
      <div className="fb-wrapper">
        {/* ── LEFT PANEL ── */}
        <div className="fb-left">
          <div className="fb-left-inner">
            {/* Logo */}
            <div className="fb-logo">
              <div className="fb-logo-icon">
                <FaBolt />
              </div>
              <span className="fb-logo-text">
                Fix<strong>ly</strong>
              </span>
            </div>

            {/* Headline */}
            <div className="fb-left-headline">
              <h1>One step away from great service.</h1>
              <p>
                Confirm your appointment and let a verified Fixly professional
                handle the rest.
              </p>
            </div>

            {/* Provider hero card */}
            <div className="fb-provider-hero">
              <div className="fb-ph-glow" />
              <div className="fb-ph-top">
                <div className="fb-ph-avatar">
                  <FaUserTie />
                </div>

                {/* ⭐ Real average rating, same data the provider
                    search results already carry — no extra API call. */}
                {hasReviews ? (
                  <div className="fb-ph-rating">
                    <div className="fb-ph-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < filledStars
                              ? "fb-ph-star-filled"
                              : "fb-ph-star-empty"
                          }
                        />
                      ))}
                    </div>
                    <span className="fb-ph-rating-val">
                      {rating.toFixed(1)} ({totalReviews})
                    </span>
                  </div>
                ) : (
                  <span className="fb-ph-no-reviews">No reviews yet</span>
                )}
              </div>
              <div className="fb-ph-name">{provider?.fullName || "—"}</div>
              <div className="fb-ph-service">
                <FaTools /> {provider?.category || "Home Service"}
              </div>
              <div className="fb-ph-divider" />
              <div className="fb-ph-price">
                <div className="fb-ph-price-label">Price Per Visit</div>
                <div className="fb-ph-price-value">
                  <FaRupeeSign /> {provider?.pricePerVisit}
                </div>
              </div>
            </div>

            {/* Feature pills */}
            <div className="fb-left-pills">
              <div className="fb-pill">
                <FaShieldAlt />
                <span>Verified Pro</span>
              </div>
              <div className="fb-pill">
                <FaLock />
                <span>Secure Booking</span>
              </div>
              <div className="fb-pill">
                <FaStar />
                <span>Top Rated</span>
              </div>
            </div>

            {/* Trust line */}
            <div className="fb-trust">
              <FaLock />
              <span>Your payment &amp; data are 100% protected by Fixly.</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="fb-right">
          <div className="fb-right-inner">
            {/* Header */}
            <div className="fb-form-header">
              <div className="fb-form-icon">
                <FaCalendarAlt />
              </div>
              <h2>Complete Your Booking</h2>
              <p>Choose your address and preferred date to confirm</p>
            </div>

            {/* Mobile-only provider summary */}
            <div className="fb-mobile-summary">
              <div className="fb-ms-provider">
                <div className="fb-ms-avatar">
                  <FaUserTie />
                </div>
                <div className="fb-ms-info">
                  <span>Provider</span>
                  <strong>{provider?.fullName}</strong>
                  <em>
                    <FaTools /> {provider?.category || "Home Service"}
                  </em>
                </div>
                <div className="fb-ms-price">
                  <span>Price</span>
                  <strong>₹{provider?.pricePerVisit}</strong>
                </div>
              </div>
            </div>

            {/* ── Order summary strip ── */}
            <div className="fb-order-strip">
              <div className="fb-os-item">
                <FaUserTie />
                <div>
                  <span>Provider</span>
                  <strong>{provider?.fullName}</strong>
                </div>
              </div>
              <div className="fb-os-sep" />
              <div className="fb-os-item">
                <FaTools />
                <div>
                  <span>Service</span>
                  <strong>{provider?.category || "Home Service"}</strong>
                </div>
              </div>
              <div className="fb-os-sep" />
              <div className="fb-os-item price-item">
                <FaRupeeSign />
                <div>
                  <span>Total</span>
                  <strong>₹ {provider?.pricePerVisit}</strong>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="fb-form">
              {/* Address */}
              <div className="fb-field">
                <label className="fb-label">
                  <FaMapMarkerAlt />
                  <span>
                    Service Address <span className="fb-required">*</span>
                  </span>
                </label>
                <div className="fb-select-wrap">
                  <FaHome className="fb-select-icon" />
                  <select
                    value={addressId}
                    onChange={(e) => setAddressId(e.target.value)}
                    className={
                      !addressId && addresses.length > 0 ? "fb-invalid" : ""
                    }>
                    <option value="">— Choose a saved address —</option>
                    {addresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.area}, {a.city} ({a.pincode})
                      </option>
                    ))}
                  </select>
                </div>
                {addresses.length === 0 && (
                  <div className="fb-no-address">
                    <FaExclamationTriangle />
                    <span>
                      No addresses found. Please add one in your profile first.
                    </span>
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="fb-field">
                <label className="fb-label">
                  <FaCalendarAlt />
                  <span>
                    Preferred Date <span className="fb-required">*</span>
                  </span>
                </label>
                <div className="fb-date-wrap">
                  <FaCalendarAlt className="fb-select-icon" />
                  <input
                    type="date"
                    min={today}
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Price summary row */}
              <div className="fb-price-row">
                <div className="fb-price-left">
                  <FaRupeeSign />
                  <div>
                    <span>Payable Amount</span>
                    <strong>₹ {provider?.pricePerVisit}</strong>
                  </div>
                </div>
                <div className="fb-price-badge">
                  <FaShieldAlt /> Secure
                </div>
              </div>

              {/* Confirm */}
              <button
                className="fb-confirm-btn"
                onClick={handleBooking}
                disabled={loading || !addressId || !serviceDate}>
                {loading ? (
                  <>
                    <span className="fb-spinner" /> Processing…
                  </>
                ) : (
                  <>
                    <FaLock />
                    <span>Confirm &amp; Book Appointment</span>
                    <FaArrowRight />
                  </>
                )}
              </button>

              {/* Cancel */}
              <button className="fb-cancel-btn" onClick={() => navigate(-1)}>
                <FaArrowLeft />
                <span>Go Back</span>
              </button>
            </div>

            {/* Footer */}
            <div className="fb-info-box">
              <FaShieldAlt />
              <span>
                Your booking details are private and securely stored on Fixly
                servers.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;
