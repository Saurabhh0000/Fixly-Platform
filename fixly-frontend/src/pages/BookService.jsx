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
} from "react-icons/fa";
import "../styles/fixly-book.css";

const BookService = () => {
  const { state: provider } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Get today's date in YYYY-MM-DD format to disable past dates
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!provider) {
      toast.error("Please select a provider first");
      navigate("/search");
    }
  }, [provider, navigate]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAddresses = async () => {
      try {
        const res = await fixlyApi.get(`/api/addresses/${user.id}`);
        setAddresses(res.data);
      } catch (err) {
        toast.error("Failed to load addresses");
      }
    };

    fetchAddresses();
  }, [user?.id]);

  const handleBooking = async () => {
    if (!addressId || !serviceDate) {
      toast.error("Please fill in all fields");
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
      toast.success("Booking confirmed!");
      setTimeout(() => navigate("/user/bookings"), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="booking-status-container">
        <div className="success-card">
          <FaCheckCircle className="success-icon" />
          <h2>Booking Confirmed!</h2>
          <p>
            Your appointment with <strong>{provider?.fullName}</strong> has been
            scheduled successfully.
          </p>
          <p className="redirect-text">Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixly-book-container">
      <div className="fixly-book-card">
        <div className="booking-header">
          <h2>Complete Your Booking</h2>
          <p>Please review the details and confirm your appointment</p>
        </div>

        <div className="booking-summary">
          <div className="summary-item">
            <FaUserTie />
            <div>
              <span className="summary-label">Service Provider</span>
              <strong>{provider?.fullName}</strong>
            </div>
          </div>

          <div className="summary-item">
            <FaMapMarkerAlt />
            <div>
              <span className="summary-label">Service Type</span>
              <strong>{provider?.serviceName || "Home Service"}</strong>
            </div>
          </div>

          {/* ✅ PRICE */}
          <div className="summary-item price">
            <FaRupeeSign />
            <div>
              <span className="summary-label">Service Price</span>
              <strong>₹ {provider?.pricePerVisit}</strong>
            </div>
          </div>
        </div>

        <div className="booking-form">
          <div className="form-group">
            <label>
              <FaMapMarkerAlt /> Select Service Address
            </label>
            <select
              value={addressId}
              onChange={(e) => setAddressId(e.target.value)}
              className={!addressId ? "invalid" : ""}>
              <option value="">-- Choose an Address --</option>
              {addresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.area}, {a.city} ({a.pincode})
                </option>
              ))}
            </select>
            {addresses.length === 0 && (
              <small className="form-help">
                No addresses found. Add one in your profile.
              </small>
            )}
          </div>

          <div className="form-group">
            <label>
              <FaCalendarAlt /> Select Date
            </label>
            <input
              type="date"
              min={today}
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
            />
          </div>

          <button
            className="confirm-btn"
            onClick={handleBooking}
            disabled={loading || !addressId || !serviceDate}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              "Confirm Appointment"
            )}
          </button>

          <button className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookService;
