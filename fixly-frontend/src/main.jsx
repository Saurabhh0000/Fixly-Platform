import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./styles/fixly.css";
import "./styles/fixly-navbar-overrides.css";
import "./styles/fixly-home-redesign.css";
import "./styles/fixly-home-effects.css";

import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <>
        <App />
        <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 3500,
            className: "fixly-toast",
            style: {
              borderRadius: "14px",
              padding: "13px 15px",
              fontSize: "13px",
              fontWeight: 700,
              boxShadow: "0 12px 35px rgba(15,23,42,.14)"
            },
            success: {
              iconTheme: { primary: "#16a34a", secondary: "#f0fdf4" },
              style: { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }
            },
            error: {
              iconTheme: { primary: "#dc2626", secondary: "#fef2f2" },
              style: { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }
            }
          }}
        />
      </>
    </AuthProvider>
  </React.StrictMode>
);