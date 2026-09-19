import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaBolt,
  FaCheckCircle,
  FaStar,
  FaUserFriends,
} from "react-icons/fa";
import toast from "react-hot-toast";
import fixlyApi from "../api/fixlyApi";
import { AuthContext } from "../context/AuthContext";
import "../styles/fixly-auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) return toast.error("Please enter your email address.");
    if (!email.includes("@")) return toast.error("Please enter a valid email address.");
    if (!password.trim()) return toast.error("Please enter your password.");
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");

    try {
      setLoading(true);
      const res = await fixlyApi.post("/api/auth/login", { email, password });

      login(res.data);
      localStorage.setItem("auth", btoa(`${email}:${password}`));

      toast.success(`Welcome back, ${res.data.fullName} 👋`, { duration: 4000 });

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
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid email or password", {
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fx-auth-page">
      <div className="fx-auth-shell">
        <section className="fx-auth-visual">
          <div className="fx-auth-orbit fx-auth-orbit-one" />
          <div className="fx-auth-orbit fx-auth-orbit-two" />

          <Link to="/" className="fx-auth-logo" aria-label="Fixly home">
            <span className="fx-auth-logo-mark"><FaBolt /></span>
            <span>Fix<span>ly</span></span>
          </Link>

          <div className="fx-auth-visual-content">
            <span className="fx-auth-kicker">YOUR EVERYDAY SERVICE PARTNER</span>
            <h1>
              Get things done.
              <strong> Without the hassle.</strong>
            </h1>
            <p>
              Find trusted local professionals for home, personal and everyday
              services — all from one simple platform.
            </p>

            <div className="fx-auth-benefits">
              <div><FaCheckCircle /><span><b>Verified professionals</b><small>Trusted local service providers</small></span></div>
              <div><FaShieldAlt /><span><b>Safe & secure bookings</b><small>Your information stays protected</small></span></div>
              <div><FaStar /><span><b>Real customer ratings</b><small>Choose services with confidence</small></span></div>
            </div>
          </div>

          <div className="fx-auth-visual-footer">
            <div className="fx-auth-mini-users">
              <span>F</span><span>R</span><span>A</span><span>+</span>
            </div>
            <div>
              <b>Built for everyday moments</b>
              <small>Find help · Book confidently · Get it done</small>
            </div>
          </div>
        </section>

        <section className="fx-auth-form-panel">
          <div className="fx-auth-form-wrap">
            <div className="fx-auth-mobile-logo">
              <Link to="/" className="fx-auth-logo fx-auth-logo-dark">
                <span className="fx-auth-logo-mark"><FaBolt /></span>
                <span>Fix<span>ly</span></span>
              </Link>
            </div>

            <div className="fx-auth-heading">
              <div className="fx-auth-icon"><FaLock /></div>
              <div>
                <span>WELCOME BACK</span>
                <h2>Sign in to Fixly</h2>
                <p>Your trusted services are one sign-in away.</p>
              </div>
            </div>

            <form className="fx-auth-form" onSubmit={handleLogin}>
              <label className="fx-auth-field">
                <span>Email address</span>
                <div className="fx-auth-input">
                  <FaEnvelope />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </label>

              <label className="fx-auth-field">
                <span>Password</span>
                <div className="fx-auth-input">
                  <FaLock />
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="fx-auth-eye"
                    onClick={() => setShowPwd((value) => !value)}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>

              <div className="fx-auth-meta">
                <label><input type="checkbox" /> Remember me</label>
                <span>Forgot password?</span>
              </div>

              <button type="submit" className="fx-auth-primary" disabled={loading}>
                {loading ? (
                  <><span className="fx-auth-spinner" /> Signing in…</>
                ) : (
                  <>Sign in to Fixly <FaArrowRight /></>
                )}
              </button>
            </form>

            <div className="fx-auth-secure">
              <FaShieldAlt />
              <span>Your account and personal information are protected.</span>
            </div>

            <p className="fx-auth-switch">
              New to Fixly? <Link to="/register">Create your account <FaArrowRight /></Link>
            </p>

            <p className="fx-auth-bottom-note">
              <FaUserFriends /> Trusted by people looking for reliable local services
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
