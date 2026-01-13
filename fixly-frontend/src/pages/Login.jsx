import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaCheckCircle,
  FaShieldAlt,
  FaStar,
  FaClock,
} from "react-icons/fa";
import toast from "react-hot-toast";
import fixlyApi from "../api/fixlyApi";
import { AuthContext } from "../context/AuthContext";
import "../styles/fixly-login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    /* ================= VALIDATION ================= */
    if (!email.trim()) return toast.error("Please enter your email");
    if (!email.includes("@")) return toast.error("Enter a valid email address");
    if (!password.trim()) return toast.error("Please enter your password");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");

    try {
      const res = await fixlyApi.post("/api/auth/login", {
        email,
        password,
      });

      // ✅ SAVE USER
      login(res.data);

      // ✅ SAVE BASIC AUTH CORRECTLY
      localStorage.setItem("auth", btoa(`${email}:${password}`));

      toast.success(`Welcome back, ${res.data.fullName} 👋`);

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
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="fixly-login-wrapper">
      <div className="fixly-login-card">
        {/* LEFT PANEL */}
        <div className="login-left">
          <div className="left-overlay">
            <h1>
              Welcome to <span className="brand-fix">Fix</span>
              <span className="brand-ly">ly</span>
            </h1>

            <p className="tagline">Trusted home services, just a click away.</p>

            <div className="feature-list">
              <div className="feature-item">
                <FaCheckCircle /> <span>Verified Professionals</span>
              </div>
              <div className="feature-item">
                <FaShieldAlt /> <span>Secure & Safe Bookings</span>
              </div>
              <div className="feature-item">
                <FaStar /> <span>Real Customer Ratings</span>
              </div>
              <div className="feature-item">
                <FaClock /> <span>Fast Service Response</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">
          <h3>Login to Fixly</h3>

          <form onSubmit={handleLogin}>
            <div className="input-box">
              <FaUser />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="input-box">
              <FaLock />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="login-btn">
              LOGIN
            </button>
          </form>

          <p className="register-text">
            Don’t have an account?{" "}
            <Link to="/register" className="register-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
