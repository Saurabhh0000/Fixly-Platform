import { useState, useRef } from "react";
import fixlyApi from "../api/fixlyApi";
import toast from "react-hot-toast";
import {
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
  FaLock,
  FaExclamationTriangle,
} from "react-icons/fa";
import "../styles/otp-modal.css";

const OtpVerifyModal = ({ bookingId, onClose, onSuccess }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("idle"); // idle | error | success
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.toLowerCase();
    setOtp(updated);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputsRef.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .trim()
      .toLowerCase()
      .slice(0, 6);
    if (!/^[a-z0-9]+$/.test(pasted)) return;
    const updated = [...otp];
    pasted.split("").forEach((ch, i) => {
      if (i < 6) updated[i] = ch;
    });
    setOtp(updated);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  const resetOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  const submitOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setStatus("error");
      setMessage("Please enter all 6 characters of the OTP.");
      return;
    }

    try {
      setLoading(true);
      await fixlyApi.put(`/api/bookings/${bookingId}/complete?otp=${finalOtp}`);

      setStatus("success");
      setMessage("OTP verified! Service marked as completed.");

      setTimeout(() => {
        toast.success("Service completed successfully! 🎉", { duration: 4000 });
        onSuccess();
        onClose();
      }, 1800);
    } catch {
      setStatus("error");
      setMessage("Invalid OTP. Please check and try again.");
      resetOtp();
    } finally {
      setLoading(false);
    }
  };

  const filled = otp.filter(Boolean).length;
  const progress = (filled / 6) * 100;

  return (
    <div
      className="ovm-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ovm-modal">
        {/* CLOSE BUTTON */}
        <button className="ovm-close-btn" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>

        {/* HEADER */}
        <div
          className={`ovm-header ${status === "success" ? "ovm-header-success" : ""}`}>
          <div
            className={`ovm-header-icon ${status === "success" ? "ovm-icon-success" : status === "error" ? "ovm-icon-error" : ""}`}>
            {status === "success" ? (
              <FaCheckCircle />
            ) : status === "error" ? (
              <FaExclamationTriangle />
            ) : (
              <FaShieldAlt />
            )}
          </div>
          <div>
            <h3 className="ovm-title">Verify Service OTP</h3>
            <p className="ovm-subtitle">
              Ask the customer for the 6-character OTP
            </p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="ovm-progress-wrap">
          <div className="ovm-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="ovm-progress-label">{filled} of 6 characters entered</p>

        {/* OTP BOXES */}
        <div
          className={`ovm-boxes ${status === "error" ? "ovm-shake" : ""}`}
          onPaste={handlePaste}>
          {otp.map((char, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              maxLength="1"
              value={char}
              className={`ovm-input ${status === "error" ? "ovm-input-error" : status === "success" ? "ovm-input-success" : char ? "ovm-input-filled" : ""}`}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              autoFocus={i === 0}
              disabled={status === "success" || loading}
              autoComplete="off"
            />
          ))}
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className={`ovm-message ${status === "error" ? "ovm-msg-error" : "ovm-msg-success"}`}>
            {status === "error" ? <FaTimesCircle /> : <FaCheckCircle />}
            {message}
          </div>
        )}

        {/* INFO NOTE */}
        {status === "idle" && (
          <div className="ovm-info-note">
            <FaLock className="ovm-note-icon" />
            Share OTP only after the service is fully completed
          </div>
        )}

        {/* ACTIONS */}
        <div className="ovm-actions">
          <button
            className="ovm-btn ovm-btn-cancel"
            onClick={onClose}
            disabled={loading}>
            <FaTimes /> Cancel
          </button>
          <button
            className="ovm-btn ovm-btn-verify"
            onClick={submitOtp}
            disabled={loading || status === "success" || filled < 6}>
            {loading ? (
              <>
                <span className="ovm-spinner" /> Verifying…
              </>
            ) : status === "success" ? (
              <>
                <FaCheckCircle /> Verified!
              </>
            ) : (
              <>
                <FaShieldAlt /> Verify OTP
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerifyModal;
