import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fixlyApi from "../api/fixlyApi";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronRight,
  FaClock,
  FaHome,
  FaLock,
  FaMapMarkerAlt,
  FaPlus,
  FaRupeeSign,
  FaShieldAlt,
  FaStar,
  FaTools,
  FaUserTie,
} from "react-icons/fa";
import "../styles/fixly-book.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const BACKEND_BASE = API_BASE.replace(/\/api$/, "");

const resolveImage = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${BACKEND_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

const getLocalDate = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
};

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

  const today = useMemo(() => getLocalDate(), []);
  const providerImage = resolveImage(provider?.profilePicture);
  const rating = Number(provider?.rating || 0);
  const reviewCount = Number(provider?.ratingCount || 0);
  const filledStars = Math.round(rating);

  useEffect(() => {
    if (!provider) {
      toast.error("Please select a provider first.");
      navigate("/search", { replace: true });
    }
  }, [provider, navigate]);

  useEffect(() => {
    if (!user?.id) return;

    const loadAddresses = async () => {
      try {
        const res = await fixlyApi.get(`/api/addresses/${user.id}`);
        setAddresses(res.data || []);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Unable to load your saved addresses.",
        );
      }
    };

    loadAddresses();
  }, [user?.id]);

  const generateReference = () =>
    `FXL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const handleBooking = async () => {
    if (!addressId) {
      toast.error("Please select a service address.");
      return;
    }

    if (!serviceDate) {
      toast.error("Please select a preferred service date.");
      return;
    }

    setLoading(true);

    try {
      await fixlyApi.post("/api/bookings", {
        userId: user.id,
        providerId: provider.providerId,
        addressId: Number(addressId),
        serviceDate,
      });

      setBookingRef(generateReference());
      setSuccess(true);
      toast.success("Booking request sent successfully.");

      window.setTimeout(() => navigate("/user/bookings"), 4500);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!provider) return null;

  const formattedDate = serviceDate
    ? new Date(`${serviceDate}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  if (success) {
    return (
      <main className="fb-page fb-success-page">
        <div className="fb-success-shell">
          <div className="fb-success-top">
            <div className="fb-success-check">
              <FaCheckCircle />
            </div>
            <span className="fb-eyebrow">BOOKING REQUEST SENT</span>
            <h1>You're all set.</h1>
            <p>
              Your service request has been sent to{" "}
              <strong>{provider.fullName}</strong>.
            </p>
          </div>

          <div className="fb-success-provider">
            <div className="fb-provider-avatar fb-provider-avatar-large">
              {providerImage ? (
                <img src={providerImage} alt={provider.fullName} />
              ) : (
                <span>{provider.fullName?.charAt(0)?.toUpperCase() || "P"}</span>
              )}
            </div>
            <div>
              <span>Service provider</span>
              <strong>{provider.fullName}</strong>
              <small>
                <FaTools /> {provider.category || "Home Service"}
              </small>
            </div>
            <div className="fb-success-price">
              <span>Price / visit</span>
              <strong>₹{provider.pricePerVisit}</strong>
            </div>
          </div>

          <div className="fb-success-grid">
            <div>
              <span><FaCalendarAlt /> Date</span>
              <strong>{formattedDate}</strong>
            </div>
            <div>
              <span><FaMapMarkerAlt /> Address</span>
              <strong>
                {addresses.find((a) => String(a.id) === String(addressId))?.area},{" "}
                {addresses.find((a) => String(a.id) === String(addressId))?.city}
              </strong>
            </div>
          </div>

          <div className="fb-reference">
            <span>Request reference</span>
            <strong>{bookingRef}</strong>
          </div>

          <div className="fb-success-footer">
            <FaClock />
            <span>Taking you to My Bookings shortly.</span>
            <button onClick={() => navigate("/user/bookings")}>
              View bookings <FaArrowRight />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="fb-page">
      <div className="fb-book-shell">
        <header className="fb-book-topbar">
          <button className="fb-back-link" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back to providers
          </button>
          <div className="fb-step-indicator">
            <span className="fb-step-active">01</span>
            <i />
            <span>02</span>
            <i />
            <span>03</span>
          </div>
          <span className="fb-step-label">BOOK SERVICE</span>
        </header>

        <div className="fb-book-layout">
          <section className="fb-provider-panel">
            <div className="fb-provider-cover">
              <span className="fb-verified-badge">
                <FaCheckCircle /> Verified Fixly Pro
              </span>
              <div className="fb-cover-orb fb-cover-orb-one" />
              <div className="fb-cover-orb fb-cover-orb-two" />
            </div>

            <div className="fb-provider-content">
              <div className="fb-provider-avatar-wrap">
                <div className="fb-provider-avatar">
                  {providerImage ? (
                    <img src={providerImage} alt={provider.fullName || "Provider"} />
                  ) : (
                    <span>{provider.fullName?.charAt(0)?.toUpperCase() || "P"}</span>
                  )}
                </div>
                <span className="fb-online-dot" title="Provider availability" />
              </div>

              <div className="fb-provider-name-row">
                <div>
                  <span className="fb-mini-label">YOU ARE BOOKING</span>
                  <h1>{provider.fullName || "Fixly Provider"}</h1>
                  <p><FaTools /> {provider.category || "Home Service"}</p>
                </div>
                <div className="fb-rating">
                  <strong>{rating.toFixed(1)}</strong>
                  <div>
                    <div className="fb-stars">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <FaStar key={i} className={i < filledStars ? "filled" : ""} />
                      ))}
                    </div>
                    <span>{reviewCount} reviews</span>
                  </div>
                </div>
              </div>

              <div className="fb-provider-facts">
                <div>
                  <span>Experience</span>
                  <strong>
                    {provider.experienceYears === 0
                      ? "Fresher"
                      : `${provider.experienceYears} yrs`}
                  </strong>
                </div>
                <div>
                  <span>Location</span>
                  <strong>{provider.area || provider.city || "Local"}</strong>
                </div>
                <div>
                  <span>Rate</span>
                  <strong>₹{provider.pricePerVisit}</strong>
                </div>
              </div>

              <div className="fb-trust-card">
                <div className="fb-trust-icon"><FaShieldAlt /></div>
                <div>
                  <strong>Verified professional</strong>
                  <span>Identity and service profile verified by Fixly.</span>
                </div>
                <FaCheckCircle />
              </div>
            </div>
          </section>

          <section className="fb-book-panel">
            <div className="fb-panel-heading">
              <span className="fb-eyebrow">STEP 01 · SERVICE DETAILS</span>
              <h2>Where & when?</h2>
              <p>Tell us where the service is needed and choose a convenient date.</p>
            </div>

            <div className="fb-progress-line">
              <span />
            </div>

            <div className="fb-form">
              <div className="fb-form-field">
                <div className="fb-field-heading">
                  <div className="fb-field-number">01</div>
                  <div>
                    <label>Service address <em>*</em></label>
                    <p>Where should the professional visit?</p>
                  </div>
                </div>

                {addresses.length > 0 ? (
                  <div className="fb-address-options">
                    {addresses.map((address, index) => (
                      <button
                        type="button"
                        key={address.id}
                        className={`fb-address-option ${String(addressId) === String(address.id) ? "selected" : ""}`}
                        onClick={() => setAddressId(String(address.id))}
                      >
                        <span className="fb-address-radio">
                          <span />
                        </span>
                        <span className="fb-address-icon"><FaHome /></span>
                        <span className="fb-address-copy">
                          <strong>{address.area}, {address.city}</strong>
                          <small>{address.pincode}{index === 0 ? " · Saved address" : ""}</small>
                        </span>
                        <FaChevronRight className="fb-address-arrow" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="fb-empty-address">
                    <div><FaMapMarkerAlt /></div>
                    <div>
                      <strong>No saved address</strong>
                      <span>Add an address before booking this service.</span>
                    </div>
                    <button type="button" onClick={() => navigate("/profile")}>
                      <FaPlus /> Add address
                    </button>
                  </div>
                )}
              </div>

              <div className="fb-form-field">
                <div className="fb-field-heading">
                  <div className="fb-field-number">02</div>
                  <div>
                    <label>Preferred date <em>*</em></label>
                    <p>Choose a date that works for you.</p>
                  </div>
                </div>

                <div className="fb-simple-date">
                  <div className="fb-simple-date-head">
                    <div className="fb-simple-date-icon"><FaCalendarAlt /></div>
                    <div>
                      <label htmlFor="fb-service-date">Preferred service date <em>*</em></label>
                      <p>Tap the date field to open the calendar and select a day.</p>
                    </div>
                  </div>
                  <div className={`fb-native-date-wrap ${serviceDate ? "selected" : ""}`}>
                    <FaCalendarAlt className="fb-native-date-leading" />
                    <input
                      id="fb-service-date"
                      type="date"
                      min={today}
                      value={serviceDate}
                      onChange={(e) => setServiceDate(e.target.value)}
                      aria-label="Preferred service date"
                    />
                  </div>
                  {serviceDate && (
                    <div className="fb-selected-date">
                      <FaCheckCircle />
                      <span>
                        Selected:{" "}
                        <strong>
                          {new Date(`${serviceDate}T00:00:00`).toLocaleDateString("en-IN", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="fb-book-summary">
                <div>
                  <span>Payable amount</span>
                  <strong>₹{provider.pricePerVisit}</strong>
                </div>
                <span className="fb-secure-pill"><FaLock /> Secure booking</span>
              </div>

              <button
                className="fb-confirm"
                type="button"
                disabled={loading || !addressId || !serviceDate || addresses.length === 0}
                onClick={handleBooking}
              >
                {loading ? (
                  <>
                    <span className="fb-spinner" /> Sending request...
                  </>
                ) : (
                  <>
                    <span>Confirm booking</span>
                    <FaArrowRight />
                  </>
                )}
              </button>

              <button className="fb-cancel" type="button" onClick={() => navigate(-1)}>
                Cancel and return
              </button>
            </div>

            <div className="fb-privacy">
              <FaLock />
              <span>Your booking information is private and securely handled by Fixly.</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default BookService;
