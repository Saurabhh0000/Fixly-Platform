import { useState, useRef } from "react";
import fixlyApi from "../api/fixlyApi";
import toast from "react-hot-toast";
import "../styles/otp-modal.css";

const OtpVerifyModal = ({ bookingId, onClose, onSuccess }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("idle"); // idle | error | success
  const [message, setMessage] = useState("");
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value.toLowerCase();
    setOtp(updated);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const resetOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  const submitOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setStatus("error");
      setMessage("Enter 6-character OTP");
      return;
    }

    try {
      await fixlyApi.put(`/api/bookings/${bookingId}/complete?otp=${finalOtp}`);

      setStatus("success");
      setMessage("OTP Verified Successfully!");

      setTimeout(() => {
        toast.success("Service completed successfully 🎉");
        onSuccess(); // refresh bookings
        onClose(); // ✅ AUTO CLOSE MODAL
      }, 2000);
    } catch {
      setStatus("error");
      setMessage("Invalid OTP. Try again.");
      resetOtp();
    }
  };

  return (
    <div className="otp-overlay">
      <div className="otp-modal">
        <h3>Verify Service OTP</h3>
        <p className="otp-subtitle">Ask customer for the 6-character OTP</p>

        <div className={`otp-boxes ${status === "error" ? "shake" : ""}`}>
          {otp.map((char, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              maxLength="1"
              value={char}
              className={`otp-input ${status}`}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {message && <p className={`otp-message ${status}`}>{message}</p>}

        <div className="otp-actions">
          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn verify" onClick={submitOtp}>
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerifyModal;
