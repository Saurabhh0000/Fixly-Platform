import { useEffect, useState, useContext } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTags,
  FaSearch,
  FaToggleOn,
  FaToggleOff,
  FaInfoCircle,
  FaExclamationTriangle,
  FaSmile,
} from "react-icons/fa";
import toast from "react-hot-toast";
import fixlyApi from "../api/fixlyApi";
import "../styles/fixly-admin.css";
import AdminLayout from "../layouts/AdminLayout";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  /* LOAD CATEGORIES */
  const loadCategories = async () => {
    try {
      const res = await fixlyApi.get("/api/categories");
      const data = res.data.map((c) => ({ ...c, active: true }));
      setCategories(data);
      setFiltered(data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* SEARCH */
  useEffect(() => {
    const value = search.toLowerCase();
    setFiltered(
      categories.filter(
        (c) =>
          c.name.toLowerCase().includes(value) ||
          c.description.toLowerCase().includes(value)
      )
    );
  }, [search, categories]);

  /* CREATE / UPDATE */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, description };
      if (editingId) {
        await fixlyApi.put(`/api/categories/${editingId}`, payload);
        toast.success("Category updated");
      } else {
        await fixlyApi.post("/api/categories", payload);
        toast.success("Category added");
      }
      setName("");
      setDescription("");
      setEditingId(null);
      loadCategories();
    } catch {
      toast.error("Operation failed");
    }
  };

  /* DELETE */
  const confirmDelete = async () => {
    try {
      await fixlyApi.delete(`/api/categories/${confirmId}`);
      toast.success("Category deleted");
      setConfirmId(null);
      loadCategories();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* TOGGLE */
  const toggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    toast.success("Status updated");
  };

  return (
    <AdminLayout>
      <div className="admin-wrapper">
        {/* WELCOME */}
        <div className="admin-welcome">
          <FaSmile className="welcome-icon" />
          <div className="adminName">
            <h2>
              Welcome back, <span>{user?.fullName}</span> !👋
            </h2>
            <p>Manage Fixly service categories and platform structure</p>
          </div>
        </div>

        {/* HEADER */}
        <div className="admin-header">
          <h3>
            <FaTags /> Service Categories
          </h3>
        </div>

        {/* SEARCH */}
        <div className="admin-search-bar">
          <div className="search-input">
            <FaSearch />
            <input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="search-btn">Search</button>
        </div>

        {/* FORM */}
        <form className="category-form" onSubmit={handleSubmit}>
          <input
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            placeholder="Category description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            required
          />

          <button className="primary-btn">
            <FaPlus /> {editingId ? "Update" : "Add"}
          </button>
        </form>

        {/* TABLE */}
        <div className="category-card">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <FaInfoCircle />
              <h4>No categories found</h4>
              <p>Add your first Fixly service category</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td className="cat-name">{c.name}</td>
                    <td className="desc-cell">{c.description}</td>

                    <td>
                      <span
                        className={`badge ${c.active ? "active" : "inactive"}`}>
                        {c.active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>

                    <td className="action-col">
                      <button
                        className="icon-btn toggle"
                        onClick={() => toggleStatus(c.id)}>
                        {c.active ? <FaToggleOn /> : <FaToggleOff />}
                      </button>

                      <button
                        className="icon-btn edit"
                        onClick={() => {
                          setEditingId(c.id);
                          setName(c.name);
                          setDescription(c.description);
                        }}>
                        <FaEdit />
                      </button>

                      <button
                        className="icon-btn delete"
                        onClick={() => setConfirmId(c.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* CONFIRM MODAL */}
        {confirmId && (
          <div className="modal-backdrop">
            <div className="confirm-modal">
              <FaExclamationTriangle className="warn-icon" />
              <h4>Delete Category?</h4>
              <p>This action cannot be undone.</p>

              <div className="modal-actions">
                <button onClick={() => setConfirmId(null)}>Cancel</button>
                <button className="danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
