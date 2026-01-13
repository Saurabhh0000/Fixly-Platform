import {
  FaCalendarCheck,
  FaSearch,
  FaHeadset,
  FaUser,
  FaHeart,
} from "react-icons/fa";
import "../../styles/fixly-user-footer.css";

const UserFooter = () => {
  return (
    <footer className="fixly-footer user">
      <div className="footer-container">
        {/* LEFT */}
        <div className="footer-brand">
          <h3>
            Fix<span>ly</span>
          </h3>
          <p className="footer-desc">
            Book trusted home services with verified professionals. Fast,
            reliable and stress-free.
          </p>

          <div className="footer-badges">
            <span>Verified Pros</span>
            <span>Secure Booking</span>
            <span>Easy Payments</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="footer-links">
          <h4>Quick Links</h4>

          <span>
            <FaSearch /> Search Services
          </span>

          <span>
            <FaCalendarCheck /> My Bookings
          </span>

          <span>
            <FaUser /> Profile
          </span>

          <span>
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
