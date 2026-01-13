import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProviderFooter from "../components/footer/ProviderFooter";

const ProviderLayout = ({ children }) => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    // ❌ Not logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // ❌ Wrong role
    if (user.role !== "PROVIDER") {
      navigate("/unauthorized");
      return;
    }

    // ❌ Provider account broken (THIS WAS YOUR BUG)
    if (!user.providerId) {
      console.error("❌ providerId missing in session", user);
      logout();
      navigate("/login");
    }
  }, [user, loading, navigate, logout]);

  if (loading || !user || user.role !== "PROVIDER") {
    return null; // or loader
  }

  return (
    <>
      <main className="provider-layout-main">{children}</main>
      <ProviderFooter />
    </>
  );
};

export default ProviderLayout;
