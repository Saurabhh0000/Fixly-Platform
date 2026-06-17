import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const HelpSupport = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="help-page">
      <h1>Help & Support</h1>

      {user?.role === "USER" && (
        <>
          <h3>User Help</h3>

          <ul>
            <li>Booking Issues</li>
            <li>Payments & Pricing</li>
            <li>Account Help</li>
            <li>FAQs</li>
            <li>Contact Support</li>
          </ul>
        </>
      )}

      {user?.role === "PROVIDER" && (
        <>
          <h3>Provider Help</h3>

          <ul>
            <li>Verification Help</li>
            <li>Booking Management</li>
            <li>Availability & Visibility</li>
            <li>Account Status</li>
            <li>Contact Support</li>
          </ul>
        </>
      )}
    </div>
  );
};

export default HelpSupport;
