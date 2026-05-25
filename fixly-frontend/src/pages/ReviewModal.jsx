import { useState } from "react";
import fixlyApi from "../api/fixlyApi";
import toast from "react-hot-toast";
import {
  FaStar,
  FaTimes,
  FaCheckCircle,
  FaPen,
  FaSmile,
  FaMeh,
  FaFrown,
  FaGrinStars,
  FaGrin,
} from "react-icons/fa";
import "../styles/review-modal.css";

const RATING_CONFIG = [
  { score: 1, label: "Poor", icon: <FaFrown />, cls: "rv-mood-red" },
  { score: 2, label: "Fair", icon: <FaMeh />, cls: "rv-mood-orange" },
  { score: 3, label: "Good", icon: <FaSmile />, cls: "rv-mood-yellow" },
  { score: 4, label: "Great", icon: <FaGrin />, cls: "rv-mood-blue" },
  { score: 5, label: "Excellent", icon: <FaGrinStars />, cls: "rv-mood-green" },
];

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const active = hovered || rating;
  const moodCfg = RATING_CONFIG.find((r) => r.score === active);

  const submitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating before submitting.", {
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      await fixlyApi.post("/api/reviews", {
        bookingId: booking.bookingId,
        rating,
        comment,
      });

      setSubmitted(true);
      toast.success("Thank you for your feedback! ⭐", { duration: 3500 });

      setTimeout(() => {
        onSuccess();
      }, 1400);
    } catch {
      toast.error("Failed to submit review. Please try again.", {
        duration: 3500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rv-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rv-modal">
        {/* CLOSE */}
        <button className="rv-close" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>

        {/* SUCCESS STATE */}
        {submitted ? (
          <div className="rv-success">
            <div className="rv-success-icon">
              <FaCheckCircle />
            </div>
            <h3 className="rv-success-title">Review Submitted!</h3>
            <p className="rv-success-sub">
              Thank you for sharing your experience.
            </p>
          </div>
        ) : (
          <>
            {/* HEADER BAND */}
            <div className="rv-header">
              <div className="rv-header-deco rv-hd-1" />
              <div className="rv-header-deco rv-hd-2" />
              <div className="rv-header-icon">
                <FaStar />
              </div>
              <div className="rv-header-text">
                <h3 className="rv-title">Rate Your Service</h3>
                <p className="rv-sub">
                  {booking?.category
                    ? `How was your ${booking.category} experience?`
                    : "How was your service experience?"}
                </p>
              </div>
            </div>

            {/* BODY */}
            <div className="rv-body">
              {/* MOOD INDICATOR */}
              <div
                className={`rv-mood ${moodCfg ? moodCfg.cls : "rv-mood-empty"}`}>
                {moodCfg ? (
                  <>
                    {moodCfg.icon} <span>{moodCfg.label}</span>
                  </>
                ) : (
                  <span className="rv-mood-placeholder">
                    Tap a star to rate
                  </span>
                )}
              </div>

              {/* STARS */}
              <div className="rv-stars">
                {RATING_CONFIG.map(({ score, label }) => (
                  <button
                    key={score}
                    className="rv-star-btn"
                    onClick={() => setRating(score)}
                    onMouseEnter={() => setHovered(score)}
                    onMouseLeave={() => setHovered(0)}
                    aria-label={`Rate ${score} — ${label}`}>
                    <FaStar
                      className={`rv-star ${
                        score <= active
                          ? score <= 2
                            ? "rv-star-red"
                            : score === 3
                              ? "rv-star-yellow"
                              : "rv-star-gold"
                          : "rv-star-empty"
                      }`}
                    />
                    <span className="rv-star-num">{score}</span>
                  </button>
                ))}
              </div>

              {/* QUICK LABELS */}
              <div className="rv-star-labels">
                <span>Poor</span>
                <span>Excellent</span>
              </div>

              {/* COMMENT */}
              <div className="rv-textarea-wrap">
                <label className="rv-textarea-label">
                  <FaPen className="rv-pen-icon" /> Your Feedback
                  <span className="rv-optional">Optional</span>
                </label>
                <textarea
                  className="rv-textarea"
                  placeholder="Tell us about your experience with this service…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  maxLength={500}
                />
                <span className="rv-char-count">{comment.length}/500</span>
              </div>

              {/* ACTIONS */}
              <div className="rv-actions">
                <button
                  className="rv-btn rv-btn-cancel"
                  onClick={onClose}
                  disabled={loading}>
                  <FaTimes /> Cancel
                </button>
                <button
                  className="rv-btn rv-btn-submit"
                  onClick={submitReview}
                  disabled={loading || rating === 0}>
                  {loading ? (
                    <>
                      <span className="rv-spinner" /> Submitting…
                    </>
                  ) : (
                    <>
                      <FaStar /> Submit Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
