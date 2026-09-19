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
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaUserPlus,
  FaBolt,
  FaCheckCircle,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";
import toast from "react-hot-toast";
import fixlyApi from "../api/fixlyApi";
import "../styles/fixly-auth.css";

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
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.fullName.trim().length < 3)
      return toast.error("Full name must be at least 3 characters.");
    if (!form.email.includes("@"))
      return toast.error("Please enter a valid email address.");
    if (!/^\d{10}$/.test(form.phone))
      return toast.error("Phone number must be exactly 10 digits.");
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters.");
    if (!form.city.trim() || !form.area.trim())
      return toast.error("Please enter your city and area.");
    if (!/^\d{6}$/.test(form.pincode))
      return toast.error("Pincode must be exactly 6 digits.");

    try {
      setLoading(true);
      await fixlyApi.post("/api/auth/register", { ...form, role: "USER" });

      toast.success("Account created successfully! Please log in.", {
        duration: 4000,
      });
      navigate("/login");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Registration failed. Please try again.",
        { duration: 4000 },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fx-auth-page">
      <div className="fx-auth-shell fx-auth-shell-register">
        <section className="fx-auth-visual">
          <div className="fx-auth-orbit fx-auth-orbit-one" />
          <div className="fx-auth-orbit fx-auth-orbit-two" />

          <Link to="/" className="fx-auth-logo" aria-label="Fixly home">
            <span className="fx-auth-logo-mark"><FaBolt /></span>
            <span>Fix<span>ly</span></span>
          </Link>

          <div className="fx-auth-visual-content">
            <span className="fx-auth-kicker">WELCOME TO FIXLY</span>
            <h1>
              A better way to
              <strong> get things done.</strong>
            </h1>
            <p>
              Create your account and discover a simpler way to find, book and
              manage trusted local services.
            </p>

            <div className="fx-auth-benefits">
              <div><FaCheckCircle /><span><b>Find trusted help</b><small>Discover professionals near you</small></span></div>
              <div><FaShieldAlt /><span><b>Book with confidence</b><small>Secure and transparent service experience</small></span></div>
              <div><FaStar /><span><b>Make better choices</b><small>Compare genuine customer ratings</small></span></div>
            </div>
          </div>

          <div className="fx-auth-visual-footer">
            <div className="fx-auth-mini-users">
              <span>F</span><span>R</span><span>A</span><span>+</span>
            </div>
            <div>
              <b>Everything you need, in one place</b>
              <small>Find · Book · Track · Review</small>
            </div>
          </div>
        </section>

        <section className="fx-auth-form-panel">
          <div className="fx-auth-form-wrap fx-auth-register-wrap">
            <div className="fx-auth-mobile-logo">
              <Link to="/" className="fx-auth-logo fx-auth-logo-dark">
                <span className="fx-auth-logo-mark"><FaBolt /></span>
                <span>Fix<span>ly</span></span>
              </Link>
            </div>

            <div className="fx-auth-heading">
              <div className="fx-auth-icon"><FaUserPlus /></div>
              <div>
                <span>GET STARTED</span>
                <h2>Create your Fixly account</h2>
                <p>A few details now. A smarter service experience next.</p>
              </div>
            </div>

            <form className="fx-auth-form fx-auth-register-form" onSubmit={handleRegister}>
              <div className="fx-auth-section-label">Personal information</div>

              <label className="fx-auth-field">
                <span>Full name</span>
                <div className="fx-auth-input">
                  <FaUser />
                  <input
                    name="fullName"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={form.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              </label>

              <div className="fx-auth-grid-2">
                <label className="fx-auth-field">
                  <span>Email</span>
                  <div className="fx-auth-input">
                    <FaEnvelope />
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </div>
                </label>

                <label className="fx-auth-field">
                  <span>Phone</span>
                  <div className="fx-auth-input">
                    <FaPhone />
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
                </label>
              </div>

              <label className="fx-auth-field">
                <span>Password</span>
                <div className="fx-auth-input">
                  <FaLock />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="fx-auth-eye"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>

              <div className="fx-auth-section-label">Service location</div>

              <div className="fx-auth-grid-3">
                <label className="fx-auth-field">
                  <span>City</span>
                  <div className="fx-auth-input">
                    <FaCity />
                    <input
                      name="city"
                      type="text"
                      placeholder="e.g. Delhi"
                      value={form.city}
                      onChange={handleChange}
                    />
                  </div>
                </label>

                <label className="fx-auth-field">
                  <span>Area</span>
                  <div className="fx-auth-input">
                    <FaMapMarkerAlt />
                    <input
                      name="area"
                      type="text"
                      placeholder="e.g. Rohini"
                      value={form.area}
                      onChange={handleChange}
                    />
                  </div>
                </label>

                <label className="fx-auth-field">
                  <span>Pincode</span>
                  <div className="fx-auth-input">
                    <FaHashtag />
                    <input
                      name="pincode"
                      type="text"
                      placeholder="6 digits"
                      maxLength={6}
                      value={form.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </label>
              </div>

              <label className="fx-auth-terms">
                <input type="checkbox" required />
                <span>I agree to the <b>Terms & Conditions</b> and <b>Privacy Policy</b>.</span>
              </label>

              <button type="submit" className="fx-auth-primary" disabled={loading}>
                {loading ? (
                  <><span className="fx-auth-spinner" /> Creating account…</>
                ) : (
                  <>Create Fixly account <FaArrowRight /></>
                )}
              </button>
            </form>

            <p className="fx-auth-switch">
              Already have an account? <Link to="/login">Sign in <FaArrowRight /></Link>
            </p>

            <p className="fx-auth-bottom-note">
              <FaShieldAlt /> Your data is safe and never shared with third parties
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;
