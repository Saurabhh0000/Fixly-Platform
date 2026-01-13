import { useEffect, useState, useContext } from "react";
import fixlyApi from "../api/fixlyApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/become-provider.css";

const BecomeProvider = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    categoryId: "",
    experienceYears: "",
    pricePerVisit: "",
  });

  useEffect(() => {
    fixlyApi
      .get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  const submit = async () => {
    if (loading) return; // 🛑 prevent double click

    if (!form.categoryId) {
      toast.error("Please select a service category");
      return;
    }

    if (form.experienceYears === "" || Number(form.experienceYears) < 0) {
      toast.error("Enter valid experience years");
      return;
    }

    if (form.pricePerVisit === "" || Number(form.pricePerVisit) <= 0) {
      toast.error("Enter valid price per visit");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        userId: user.id,
        categoryId: Number(form.categoryId),
        experienceYears: Number(form.experienceYears),
        pricePerVisit: Number(form.pricePerVisit),
      };

      await fixlyApi.post("/api/providers/register", payload);

      // ✅ SUCCESS TOAST
      toast.success(
        "🎉 Registration successful! Please login again as a Provider."
      );
      // ⏳ WAIT so user can read toast
      setTimeout(() => {
        logout();
        localStorage.clear();
        window.location.replace("/login");
      }, 2000);
    } catch (err) {
      if (err?.response?.status >= 400) {
        toast.error(err.response?.data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(
    (c) => c.id === Number(form.categoryId)
  );

  return (
    <div className="become-provider-page">
      <div className="become-provider-card">
        <div className="become-provider-header">
          <h2>Become a Service Provider</h2>
          <p>Start offering services and earn with Fixly</p>
        </div>

        <div className="become-provider-form">
          <div className="input-group">
            <label>Service Category</label>
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }>
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {selectedCategory && (
              <div className="category-description">
                💡 {selectedCategory.description}
              </div>
            )}
          </div>

          <div className="input-group">
            <label>Experience (Years)</label>
            <input
              type="number"
              min="0"
              value={form.experienceYears}
              onChange={(e) =>
                setForm({ ...form, experienceYears: e.target.value })
              }
            />
          </div>

          <div className="input-group price-input">
            <label>Price Per Visit</label>
            <span>₹</span>
            <input
              type="number"
              min="1"
              value={form.pricePerVisit}
              onChange={(e) =>
                setForm({ ...form, pricePerVisit: e.target.value })
              }
            />
          </div>

          <button className="submit-btn" disabled={loading} onClick={submit}>
            {loading ? "Registering..." : "Register as Provider"}
          </button>
        </div>

        <div className="info-box">
          💡 Once registered, your profile will be visible to users searching
          for services.
        </div>
      </div>
    </div>
  );
};

export default BecomeProvider;
