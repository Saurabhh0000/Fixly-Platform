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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.fullName.trim().length < 3) {
      toast.error("Full name must be at least 3 characters");
      return;
    }
    if (!form.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Phone number must be 10 digits");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!form.city || !form.area) {
      toast.error("Please enter your address");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error("Pincode must be 6 digits");
      return;
    }

    try {
      await fixlyApi.post("/api/auth/register", {
        ...form,
        role: "USER",
      });

      toast.success("🎉 Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="fixly-register-wrapper">
      <div className="fixly-register-card">
        {/* LEFT PANEL */}
        <div className="register-left">
          <div className="left-overlay">
            <h1>
              Join <span className="brand-fix">Fix</span>
              <span className="brand-ly">ly</span>
            </h1>

            <p className="tagline">Trusted home services, just a click away.</p>

            <div className="feature-list">
              <div className="feature-item">
                <FaCheckCircle />
                <span>Verified Professionals</span>
              </div>
              <div className="feature-item">
                <FaShieldAlt />
                <span>Secure & Reliable Booking</span>
              </div>
              <div className="feature-item">
                <FaStar />
                <span>Real Customer Ratings</span>
              </div>
              <div className="feature-item">
                <FaClock />
                <span>Quick Response Time</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="register-right">
          <h3>Create Account</h3>

          <form onSubmit={handleRegister}>
            <div className="input-box">
              <FaUser />
              <input
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <FaEnvelope />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <FaPhone />
              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <FaLock />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <FaCity />
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <FaMapMarkerAlt />
              <input
                name="area"
                placeholder="Area / Locality"
                value={form.area}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <FaHashtag />
              <input
                name="pincode"
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="register-btn">
              REGISTER
            </button>
          </form>

          <p className="login-text">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
