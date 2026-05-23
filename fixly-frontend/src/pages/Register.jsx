import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaCity,
  FaMapMarkerAlt,
  FaHashtag,
  FaCheckCircle,
  FaShieldAlt,
  FaStar,
  FaClock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaUserPlus,
  FaBolt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import fixlyApi from "../api/fixlyApi";
import "../styles/fixly-register.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    area: "",
    pincode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.fullName.trim().length < 3) {
      toast.error("Full name must be at least 3 characters.", {
        duration: 3500,
      });
      return;
    }
    if (!form.email.includes("@")) {
      toast.error("Please enter a valid email address.", { duration: 3500 });
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Phone number must be exactly 10 digits.", {
        duration: 3500,
      });
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.", {
        duration: 3500,
      });
      return;
    }
    if (!form.city.trim() || !form.area.trim()) {
      toast.error("Please enter your city and area.", { duration: 3500 });
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error("Pincode must be exactly 6 digits.", { duration: 3500 });
      return;
    }

    try {
      setLoading(true);
      await fixlyApi.post("/api/auth/register", { ...form, role: "USER" });
      toast.success("Account created successfully! Please log in.", {
        duration: 4000,
      });
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again.",
        { duration: 4000 },
      );
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaCheckCircle />,
      title: "Verified Professionals",
      sub: "All providers are identity-verified",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure & Reliable Booking",
      sub: "End-to-end encrypted transactions",
    },
    {
      icon: <FaStar />,
      title: "Real Customer Ratings",
      sub: "Honest reviews from real users",
    },
    {
      icon: <FaClock />,
      title: "Quick Response Time",
      sub: "Providers respond within minutes",
    },
  ];

  return (
    <div className="rg-wrapper">
      <div className="rg-card">
        {/* ===== LEFT PANEL ===== */}
        <div className="rg-left">
          <div className="rg-left-inner">
            {/* BRAND */}
            <div className="rg-brand">
              <div className="rg-brand-icon">
                <FaBolt />
              </div>
              <span className="rg-brand-name">
                Fix<span>ly</span>
              </span>
            </div>

            <h2 className="rg-left-heading">
              Trusted home services,
              <br />
              just a click away.
            </h2>

            <p className="rg-left-sub">
              Join thousands of happy customers across India who trust Fixly for
              their home service needs.
            </p>

            {/* FEATURES */}
            <div className="rg-features">
              {features.map((f, i) => (
                <div key={i} className="rg-feature-item">
                  <div className="rg-feature-icon">{f.icon}</div>
                  <div className="rg-feature-text">
                    <strong>{f.title}</strong>
                    <span>{f.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM NOTE */}
            <div className="rg-left-note">
              🔒 Your data is safe and never shared with third parties.
            </div>
          </div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div className="rg-right">
          {/* HEADER */}
          <div className="rg-right-header">
            <div className="rg-right-icon">
              <FaUserPlus />
            </div>
            <h3 className="rg-right-title">Create Account</h3>
            <p className="rg-right-sub">
              Fill in the details below to get started
            </p>
          </div>

          <form className="rg-form" onSubmit={handleRegister}>
            {/* SECTION: Personal Info */}
            <p className="rg-field-section">Personal Information</p>

            <div className="rg-field">
              <label className="rg-label">
                <FaUser className="rg-label-icon" /> Full Name
              </label>
              <div className="rg-input-wrap">
                <FaUser className="rg-input-icon" />
                <input
                  name="fullName"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="rg-two-col">
              <div className="rg-field">
                <label className="rg-label">
                  <FaEnvelope className="rg-label-icon" /> Email
                </label>
                <div className="rg-input-wrap">
                  <FaEnvelope className="rg-input-icon" />
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="rg-field">
                <label className="rg-label">
                  <FaPhone className="rg-label-icon" /> Phone
                </label>
                <div className="rg-input-wrap">
                  <FaPhone className="rg-input-icon" />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="10-digit number"
                    maxLength={10}
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>

            <div className="rg-field">
              <label className="rg-label">
                <FaLock className="rg-label-icon" /> Password
              </label>
              <div className="rg-input-wrap">
                <FaLock className="rg-input-icon" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="rg-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* SECTION: Address */}
            <p className="rg-field-section">Address Details</p>

            <div className="rg-three-col">
              <div className="rg-field">
                <label className="rg-label">
                  <FaCity className="rg-label-icon" /> City
                </label>
                <div className="rg-input-wrap">
                  <FaCity className="rg-input-icon" />
                  <input
                    name="city"
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="rg-field">
                <label className="rg-label">
                  <FaMapMarkerAlt className="rg-label-icon" /> Area
                </label>
                <div className="rg-input-wrap">
                  <FaMapMarkerAlt className="rg-input-icon" />
                  <input
                    name="area"
                    type="text"
                    placeholder="e.g. Andheri West"
                    value={form.area}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="rg-field">
                <label className="rg-label">
                  <FaHashtag className="rg-label-icon" /> Pincode
                </label>
                <div className="rg-input-wrap">
                  <FaHashtag className="rg-input-icon" />
                  <input
                    name="pincode"
                    type="text"
                    placeholder="6 digits"
                    maxLength={6}
                    value={form.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            <button type="submit" className="rg-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="rg-spinner" /> Creating Account…
                </>
              ) : (
                <>
                  <FaUserPlus className="rg-btn-icon" /> Create Account{" "}
                  <FaArrowRight className="rg-btn-arrow" />
                </>
              )}
            </button>
          </form>

          <p className="rg-login-text">
            Already have an account?{" "}
            <Link to="/login" className="rg-login-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
