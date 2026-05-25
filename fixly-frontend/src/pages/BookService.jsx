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
} from "react-icons/fa";
import "../styles/fixly-book.css";

/* ─── toast helpers ─── */
const successToast = (msg) =>
  toast.success(msg, {
    duration: 4000,
    icon: "✅",
    style: {
      background: "#f0fdf4",
      color: "#15803d",
      border: "1px solid #86efac",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "0.85rem",
    },
  });

const errorToast = (msg) =>
  toast.error(msg, {
    duration: 3500,
    style: {
      background: "#fef2f2",
      color: "#991b1b",
      border: "1px solid #fca5a5",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "0.85rem",
    },
  });

const BookService = () => {
  const { state: provider } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

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

  const handleBooking = async () => {
    if (!addressId) {
      errorToast("Please select a service address.");
      return;
    }
    if (!serviceDate) {
      errorToast("Please select a service date.");
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
      setSuccess(true);
      successToast("Booking confirmed! Redirecting…");
      setTimeout(() => navigate("/user/bookings"), 2500);
    } catch (err) {
      errorToast(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="fb-status-page">
        <div className="fb-success-card">
          <div className="fb-success-icon-wrap">
            <FaCheckCircle />
          </div>
          <h2>Booking Confirmed!</h2>
          <p>
            Your appointment with <strong>{provider?.fullName}</strong> has been
            scheduled successfully.
          </p>
          <div className="fb-redirect-note">
            <FaBolt />
            <span>Redirecting to your bookings…</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main layout ── */
  return (
    <div className="fb-page">
      <div className="fb-wrapper">
        {/* ── LEFT PANEL ── */}
        <div className="fb-left">
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
              Confirm your appointment details and let a verified Fixly
              professional handle the rest.
            </p>
          </div>

          {/* Provider summary card */}
          <div className="fb-provider-card">
            <div className="fb-provider-avatar">
              <FaUserTie />
            </div>
            <div className="fb-provider-info">
              <span className="fb-provider-label">Your Provider</span>
              <strong>{provider?.fullName || "—"}</strong>
              <span className="fb-provider-service">
                <FaTools /> {provider?.serviceName || "Home Service"}
              </span>
            </div>
          </div>

          {/* Price chip */}
          <div className="fb-price-chip">
            <div className="fb-price-icon">
              <FaRupeeSign />
            </div>
            <div className="fb-price-body">
              <span>Service Price</span>
              <strong>₹ {provider?.pricePerVisit}</strong>
            </div>
          </div>

          {/* Trust badge */}
          <div className="fb-trust">
            <FaShieldAlt />
            <span>Payments &amp; bookings are 100% secure on Fixly.</span>
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
              <p>Review the details and confirm your appointment</p>
            </div>

            {/* Provider summary (mobile only) */}
            <div className="fb-mobile-summary">
              <div className="fb-ms-row">
                <FaUserTie />
                <div>
                  <span>Provider</span>
                  <strong>{provider?.fullName}</strong>
                </div>
              </div>
              <div className="fb-ms-row">
                <FaTools />
                <div>
                  <span>Service</span>
                  <strong>{provider?.serviceName || "Home Service"}</strong>
                </div>
              </div>
              <div className="fb-ms-row price-row">
                <FaRupeeSign />
                <div>
                  <span>Price</span>
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

                {addresses.length === 0 && (
                  <div className="fb-no-address">
                    <FaExclamationTriangle />
                    <span>No addresses found. Add one in your profile.</span>
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
                <input
                  type="date"
                  min={today}
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                />
              </div>

              {/* Confirm button */}
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
                    <span>Confirm Appointment</span>
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

            {/* Info footer */}
            <div className="fb-info-box">
              <FaShieldAlt />
              <span>Your booking details are private and securely stored.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;
