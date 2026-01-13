import {
  FaShieldAlt,
  FaBolt,
  FaUserCheck,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import "../../styles/fixly-footer.css";

const HomeFooter = () => {
  return (
    <footer className="fixly-footer">
      <div className="footer-container">
        {/* LEFT : BRAND */}
        <div className="footer-brand">
          <h3 className="footer-logo">
            Fix<span>ly</span>
          </h3>

          <p className="footer-tagline">
            India’s trusted platform for{" "}
            <span className="highlight">home services</span>.
          </p>

          <p className="footer-desc">
            Fixly connects you with <span>verified professionals</span> for
            plumbing, electrical, cleaning, appliance repair and more. We focus
            on <span>quality</span>, <span>transparency</span> and{" "}
            <span>peace of mind</span>—so you never worry about your home again.
          </p>

          <div className="footer-badges">
            <span>
              <FaShieldAlt /> Background Verified
            </span>
            <span>
              <FaBolt /> Instant Booking
            </span>
            <span>
              <FaUserCheck /> Trusted by Users
            </span>
          </div>
        </div>

        {/* RIGHT : SOCIAL + META */}
        <div className="footer-meta">
          <h4>Connect with Fixly</h4>

          <div className="footer-social">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
          </div>

          <p className="footer-copy">
            © {new Date().getFullYear()} Fixly Technologies Pvt. Ltd.
            <br />
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
