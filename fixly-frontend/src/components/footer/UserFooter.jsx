import {
  FaCalendarCheck,
  FaSearch,
  FaHeadset,
  FaUser,
  FaHeart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import "../../styles/fixly-user-footer.css";

const UserFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="fixly-footer user">
      <div className="footer-container">
        {/* LEFT */}
        <div className="footer-brand">
          <h3>
            Fix<span>ly</span>
          </h3>
          <p className="footer-desc">
            Book trusted home services with{" "}
            <span className="highlight">verified</span> professionals.{" "}
            <span className="highlight">Fast</span>,{" "}
            <span className="highlight">reliable</span> and{" "}
            <span className="highlight">stress-free</span>.
          </p>

          <div className="footer-badges">
            <span>Verified Pros</span>
            <span>Secure Booking</span>
            <span>Easy Payments</span>
          </div>
        </div>

        {/* RIGHT */}
        {/* RIGHT */}
        <div className="footer-links">
          <h4>Quick Links</h4>

          <span onClick={() => navigate("/search")}>
            <FaSearch /> Search Services
          </span>

          <span onClick={() => navigate("/user/bookings")}>
            <FaCalendarCheck /> My Bookings
          </span>

          <span onClick={() => navigate("/profile")}>
            <FaUser /> Profile
          </span>

          <span onClick={() => toast("Help & Support coming soon 🚧")}>
            <FaHeadset /> Help & Support
          </span>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>
          Made with <FaHeart className="heart" /> for happy homes
        </p>
        <p>© {new Date().getFullYear()} Fixly</p>
      </div>
    </footer>
  );
};

export default UserFooter;
