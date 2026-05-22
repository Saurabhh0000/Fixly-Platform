import { useState, useContext } from "react";
import {
  FaLock,
  FaKey,
  FaCheckCircle,
  FaShieldAlt,
  FaBolt,
  FaEye,
  FaEyeSlash,
  FaUserShield,
  FaFingerprint,
} from "react-icons/fa";
import toast from "react-hot-toast";
import fixlyApi from "../api/fixlyApi";
import { AuthContext } from "../context/AuthContext";
import "../styles/change-password.css";

const ChangePassword = () => {
  const { logout } = useContext(AuthContext);

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleShow = (field) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  /* ===== PASSWORD STRENGTH ===== */
  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: "", cls: "" };
    if (pwd.length < 6)
      return { level: 1, label: "Too short", cls: "str-weak" };
    if (pwd.length < 8) return { level: 2, label: "Weak", cls: "str-weak" };
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const score = [hasUpper, hasNum, hasSpecial].filter(Boolean).length;
    if (score === 0) return { level: 2, label: "Weak", cls: "str-weak" };
    if (score === 1) return { level: 3, label: "Fair", cls: "str-fair" };
    if (score === 2) return { level: 4, label: "Good", cls: "str-good" };
    return { level: 5, label: "Strong", cls: "str-strong" };
  };

  const strength = getStrength(form.newPassword);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Please fill in all fields before continuing.", {
        duration: 3500,
      });
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.", {
        duration: 3500,
      });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirmation do not match.", {
        duration: 3500,
      });
      return;
    }

    if (form.newPassword === form.oldPassword) {
      toast.error(
        "New password must be different from your current password.",
        { duration: 3500 },
      );
      return;
    }

    try {
      setLoading(true);
      await fixlyApi.put("/api/users/change-password", form);

      toast.success("Password updated! You'll be logged out shortly.", {
        duration: 3000,
      });

      setTimeout(() => {
        logout();
        window.location.replace("/login");
      }, 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update password. Please try again.",
        { duration: 4000 },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cpw-wrapper">
      <div className="cpw-card">
        {/* ===== LEFT PANEL ===== */}
        <div className="cpw-left">
          <div className="cpw-left-inner">
            <div className="cpw-brand">
              <div className="cpw-brand-icon">
                <FaFingerprint />
              </div>
              <h1 className="cpw-brand-name">
                Fix<span>ly</span>
              </h1>
            </div>

            <p className="cpw-tagline">
              Keep your account secure. Update your password anytime in seconds.
            </p>

            <div className="cpw-features">
              <div className="cpw-feature-item">
                <div className="cpw-feature-icon">
                  <FaShieldAlt />
                </div>
                <div className="cpw-feature-text">
                  <strong>End-to-End Encrypted</strong>
                  <span>Your data is always protected</span>
                </div>
              </div>

              <div className="cpw-feature-item">
                <div className="cpw-feature-icon">
                  <FaBolt />
                </div>
                <div className="cpw-feature-text">
                  <strong>Instant Update</strong>
                  <span>Changes apply immediately</span>
                </div>
              </div>

              <div className="cpw-feature-item">
                <div className="cpw-feature-icon">
                  <FaUserShield />
                </div>
                <div className="cpw-feature-text">
                  <strong>Verified Identity</strong>
                  <span>Only you can update your account</span>
                </div>
              </div>
            </div>

            <div className="cpw-left-note">
              🔒 You'll be automatically logged out after a successful password
              change.
            </div>
          </div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div className="cpw-right">
          {/* HEADER */}
          <div className="cpw-header">
            <div className="cpw-header-icon">
              <FaKey />
            </div>
            <h3>Change Password</h3>
            <p>Update your Fixly account password securely</p>
          </div>

          {/* FORM */}
          <form onSubmit={submit} className="cpw-form">
            {/* CURRENT PASSWORD */}
            <div className="cpw-field">
              <label className="cpw-label">
                <FaLock className="cpw-label-icon" />
                Current Password
              </label>
              <div className="cpw-input-wrap">
                <FaLock className="cpw-input-icon" />
                <input
                  type={show.oldPassword ? "text" : "password"}
                  name="oldPassword"
                  placeholder="Enter your current password"
                  value={form.oldPassword}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="cpw-eye-btn"
                  onClick={() => toggleShow("oldPassword")}
                  tabIndex={-1}>
                  {show.oldPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="cpw-field">
              <label className="cpw-label">
                <FaKey className="cpw-label-icon" />
                New Password
              </label>
              <div className="cpw-input-wrap">
                <FaKey className="cpw-input-icon" />
                <input
                  type={show.newPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Create a strong new password"
                  value={form.newPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="cpw-eye-btn"
                  onClick={() => toggleShow("newPassword")}
                  tabIndex={-1}>
                  {show.newPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* STRENGTH BAR */}
              {form.newPassword.length > 0 && (
                <div className="cpw-strength">
                  <div className="cpw-strength-bars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className={`cpw-bar ${n <= strength.level ? strength.cls : ""}`}
                      />
                    ))}
                  </div>
                  <span className={`cpw-strength-label ${strength.cls}`}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="cpw-field">
              <label className="cpw-label">
                <FaCheckCircle className="cpw-label-icon" />
                Confirm New Password
              </label>
              <div
                className={`cpw-input-wrap ${
                  form.confirmPassword &&
                  form.newPassword !== form.confirmPassword
                    ? "wrap-error"
                    : form.confirmPassword &&
                        form.newPassword === form.confirmPassword
                      ? "wrap-success"
                      : ""
                }`}>
                <FaCheckCircle className="cpw-input-icon" />
                <input
                  type={show.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="cpw-eye-btn"
                  onClick={() => toggleShow("confirmPassword")}
                  tabIndex={-1}>
                  {show.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {form.confirmPassword &&
                form.newPassword !== form.confirmPassword && (
                  <p className="cpw-field-error">Passwords do not match.</p>
                )}
              {form.confirmPassword &&
                form.newPassword === form.confirmPassword && (
                  <p className="cpw-field-success">
                    <FaCheckCircle /> Passwords match!
                  </p>
                )}
            </div>

            {/* SUBMIT */}
            <button type="submit" className="cpw-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="cpw-spinner" />
                  Updating Password...
                </>
              ) : (
                <>
                  <FaShieldAlt className="cpw-btn-icon" />
                  Update Password
                </>
              )}
            </button>
          </form>

          {/* FOOTER NOTE */}
          <div className="cpw-note">
            <FaLock />
            You'll be logged out automatically after a successful update.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
