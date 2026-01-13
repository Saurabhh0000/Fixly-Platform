import { useState, useContext } from "react";
import {
  FaLock,
  FaKey,
  FaCheckCircle,
  FaShieldAlt,
  FaBolt,
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      return toast.error("All fields are required");
    }

    if (form.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      await fixlyApi.put("/api/users/change-password", form);

      toast.success("Password updated successfully 🔐");

      setTimeout(() => {
        logout();
        window.location.replace("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-wrapper">
      <div className="cp-card">
        {/* LEFT PANEL */}
        <div className="cp-left">
          <div className="cp-overlay">
            <h1>
              Fix<span>ly</span>
            </h1>
            <p className="tagline">Secure your account in seconds</p>

            <div className="cp-features">
              <div className="cp-feature-item">
                <FaShieldAlt /> <span>Enhanced Security</span>
              </div>
              <div className="cp-feature-item">
                <FaBolt /> <span>Instant Update</span>
              </div>
              <div className="cp-feature-item">
                <FaLock /> <span>Safe & Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="cp-right">
          <div className="cp-header">
            <div className="cp-icon">
              <FaKey />
            </div>
            <h3>Change Password</h3>
            <p>Update your Fixly account password</p>
          </div>

          <form onSubmit={submit}>
            <div className="input-box">
              <FaLock />
              <input
                type="password"
                name="oldPassword"
                placeholder="Current Password"
                value={form.oldPassword}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <FaLock />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={form.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <FaCheckCircle />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* ✅ BUTTON IS NOW VISIBLE */}
            <button type="submit" className="cp-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <div className="cp-note">
            🔒 You’ll be logged out after password change
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
