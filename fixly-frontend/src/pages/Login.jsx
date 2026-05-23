import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaShieldAlt,
  FaStar,
  FaClock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaBolt,
  FaArrowRight,
  FaUserCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import fixlyApi from "../api/fixlyApi";
import { AuthContext } from "../context/AuthContext";
import "../styles/fixly-login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.", { duration: 3500 });
      return;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.", { duration: 3500 });
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter your password.", { duration: 3500 });
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.", {
        duration: 3500,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fixlyApi.post("/api/auth/login", { email, password });

      login(res.data);
      localStorage.setItem("auth", btoa(`${email}:${password}`));

      toast.success(`Welcome back, ${res.data.fullName} 👋`, {
        duration: 4000,
      });

      switch (res.data.role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "PROVIDER":
          navigate("/provider/dashboard");
          break;
        default:
          navigate("/user/dashboard");
      }
    } catch {
      toast.error("Invalid email or password. Please try again.", {
        duration: 4000,
      });
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
      title: "Secure & Safe Bookings",
      sub: "End-to-end encrypted transactions",
    },
    {
      icon: <FaStar />,
      title: "Real Customer Ratings",
      sub: "Honest reviews from real users",
    },
    {
      icon: <FaClock />,
      title: "Fast Service Response",
      sub: "Providers respond within minutes",
    },
  ];

  return (
    <div className="lg-wrapper">
      <div className="lg-card">
        {/* ===== LEFT PANEL ===== */}
        <div className="lg-left">
          <div className="lg-left-inner">
            <div className="lg-brand">
              <div className="lg-brand-icon">
                <FaBolt />
              </div>
              <span className="lg-brand-name">
                Fix<span>ly</span>
              </span>
            </div>

            <h2 className="lg-left-heading">
              Trusted home services,
              <br />
              just a click away.
            </h2>

            <p className="lg-left-sub">
              Thousands of happy customers across India trust Fixly for
              reliable, affordable home services.
            </p>

            <div className="lg-features">
              {features.map((f, i) => (
                <div key={i} className="lg-feature-item">
                  <div className="lg-feature-icon">{f.icon}</div>
                  <div className="lg-feature-text">
                    <strong>{f.title}</strong>
                    <span>{f.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg-left-note">
              🔒 Your data is safe and never shared with third parties.
            </div>
          </div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div className="lg-right">
          <div className="lg-right-header">
            <div className="lg-right-icon">
              <FaSignInAlt />
            </div>
            <h3 className="lg-right-title">Welcome Back</h3>
            <p className="lg-right-sub">
              Sign in to continue to your Fixly account
            </p>
          </div>

          <form className="lg-form" onSubmit={handleLogin}>
            <div className="lg-field">
              <label className="lg-label">
                <FaEnvelope className="lg-label-icon" /> Email Address
              </label>
              <div className="lg-input-wrap">
                <FaEnvelope className="lg-input-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="lg-field">
              <label className="lg-label">
                <FaLock className="lg-label-icon" /> Password
              </label>
              <div className="lg-input-wrap">
                <FaLock className="lg-input-icon" />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lg-eye-btn"
                  onClick={() => setShowPwd(!showPwd)}
                  tabIndex={-1}>
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="lg-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="lg-spinner" /> Signing in…
                </>
              ) : (
                <>
                  <FaUserCircle className="lg-btn-icon" /> Sign In{" "}
                  <FaArrowRight className="lg-btn-arrow" />
                </>
              )}
            </button>
          </form>

          <p className="lg-register-text">
            Don't have an account?{" "}
            <Link to="/register" className="lg-register-link">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
