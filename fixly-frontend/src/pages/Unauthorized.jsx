import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
        fontFamily: "Inter, system-ui",
      }}>
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          textAlign: "center",
          maxWidth: "420px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
        }}>
        <FaLock size={42} color="#dc2626" />

        <h2 style={{ marginTop: "16px", fontWeight: 800 }}>Access Denied</h2>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          You don’t have permission to access this page.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "22px",
            padding: "12px 20px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg,#2563eb,#1e40af)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
