import { useState } from "react";
import fixlyApi from "../api/fixlyApi";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import "../styles/review-modal.css";

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    if (rating === 0) {
      toast.error("Please select rating");
      return;
    }

    try {
      await fixlyApi.post("/api/reviews", {
        bookingId: booking.bookingId,
        rating,
        comment,
      });

      toast.success("Thanks for your feedback ⭐");
      onSuccess();
    } catch {
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="review-overlay">
      <div className="review-modal">
        <h3>Rate Your Service</h3>

        <div className="stars">
          {[1, 2, 3, 4, 5].map((i) => (
            <FaStar
              key={i}
              className={i <= rating ? "star active" : "star"}
              onClick={() => setRating(i)}
            />
          ))}
        </div>

        <textarea
          placeholder="Write your experience (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="review-actions">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="submit" onClick={submitReview}>
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
