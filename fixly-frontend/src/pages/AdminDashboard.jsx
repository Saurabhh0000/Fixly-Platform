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
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaLayerGroup,
  FaAlignLeft,
  FaPen,
} from "react-icons/fa";
import toast from "react-hot-toast";
import fixlyApi from "../api/fixlyApi";
import "../styles/fixly-admin.css";
import AdminLayout from "../layouts/AdminLayout";
import { AuthContext } from "../context/AuthContext";

const ROWS_PER_PAGE = 8;

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [page, setPage] = useState(1);

  /* ===== LOAD ===== */
  const loadCategories = async () => {
    try {
      const res = await fixlyApi.get("/api/categories");
      const data = res.data.map((c) => ({ ...c, active: true }));
      setCategories(data);
      setFiltered(data);
    } catch {
      toast.error("Unable to load categories. Please refresh.", {
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ===== SEARCH ===== */
  useEffect(() => {
    const q = search.toLowerCase();
    const result = categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
    setFiltered(result);
    setPage(1);
  }, [search, categories]);

  /* ===== CREATE / UPDATE ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required.", { duration: 3000 });
      return;
    }
    if (!description.trim()) {
      toast.error("Category description is required.", { duration: 3000 });
      return;
    }
    try {
      const payload = { name, description };
      if (editingId) {
        await fixlyApi.put(`/api/categories/${editingId}`, payload);
        toast.success("Category updated successfully.", { duration: 3500 });
      } else {
        await fixlyApi.post("/api/categories", payload);
        toast.success("New category added successfully.", { duration: 3500 });
      }
      setName("");
      setDescription("");
      setEditingId(null);
      loadCategories();
    } catch {
      toast.error("Operation failed. Please try again.", { duration: 3500 });
    }
  };

  /* ===== DELETE ===== */
  const confirmDelete = async () => {
    try {
      await fixlyApi.delete(`/api/categories/${confirmId}`);
      toast.success("Category deleted successfully.", { duration: 3500 });
      setConfirmId(null);
      loadCategories();
    } catch {
      toast.error("Delete failed. Please try again.", { duration: 3500 });
    }
  };

  /* ===== TOGGLE ===== */
  const toggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    );
    toast.success("Category status updated.", { duration: 2500 });
  };

  /* ===== EDIT FILL ===== */
  const startEdit = (c) => {
    setEditingId(c.id);
    setName(c.name);
    setDescription(c.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
  };

  /* ===== PAGINATION ===== */
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE,
  );

  return (
    <AdminLayout>
      <div className="adm-wrapper">
        {/* ===== WELCOME BANNER ===== */}
        <div className="adm-welcome">
          <div className="adm-welcome-icon">
            <FaSmile />
          </div>
          <div className="adm-welcome-text">
            <h2>
              Welcome back,{" "}
              <span className="adm-welcome-name">{user?.fullName}</span> 👋
            </h2>
            <p>Manage Fixly service categories and platform structure</p>
          </div>
          <div className="adm-welcome-stat">
            <span className="adm-stat-num">{categories.length}</span>
            <span className="adm-stat-label">Categories</span>
          </div>
        </div>

        {/* ===== SECTION HEADER ===== */}
        <div className="adm-section-header">
          <div className="adm-section-title-wrap">
            <div className="adm-section-icon">
              <FaTags />
            </div>
            <div>
              <h3 className="adm-section-title">Service Categories</h3>
              <p className="adm-section-sub">
                Add, edit, and manage all service categories
              </p>
            </div>
          </div>
        </div>

        {/* ===== ADD / EDIT FORM ===== */}
        <div className="adm-form-card">
          <div className="adm-form-card-header">
            <div className="adm-form-header-icon">
              {editingId ? <FaPen /> : <FaPlus />}
            </div>
            <div>
              <h4 className="adm-form-title">
                {editingId ? "Edit Category" : "Add New Category"}
              </h4>
              <p className="adm-form-sub">
                {editingId
                  ? "Update the name and description of this category"
                  : "Fill in the details to create a new service category"}
              </p>
            </div>
            {editingId && (
              <button className="adm-cancel-btn" onClick={cancelEdit}>
                <FaTimes /> Cancel
              </button>
            )}
          </div>

          <form className="adm-form" onSubmit={handleSubmit}>
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">
                  <FaLayerGroup className="adm-label-icon" />
                  Category Name <span className="adm-req">*</span>
                </label>
                <input
                  className="adm-input"
                  placeholder="e.g. Plumbing, Electrical, Cleaning…"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="adm-field">
                <label className="adm-label">
                  <FaAlignLeft className="adm-label-icon" />
                  Description <span className="adm-req">*</span>
                </label>
                <textarea
                  className="adm-input adm-textarea"
                  placeholder="Brief description of what this category covers…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  required
                />
              </div>
            </div>

            <div className="adm-form-footer">
              <button type="submit" className="adm-submit-btn">
                {editingId ? (
                  <>
                    <FaCheckCircle /> Update Category
                  </>
                ) : (
                  <>
                    <FaPlus /> Add Category
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ===== SEARCH ===== */}
        <div className="adm-search-row">
          <div className="adm-search-wrap">
            <FaSearch className="adm-search-icon" />
            <input
              className="adm-search-input"
              placeholder="Search by name or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="adm-search-clear"
                onClick={() => setSearch("")}>
                <FaTimes />
              </button>
            )}
          </div>
          {search && (
            <p className="adm-results-line">
              <strong>{filtered.length}</strong> result
              {filtered.length !== 1 ? "s" : ""} for "<em>{search}</em>"
            </p>
          )}
        </div>

        {/* ===== TABLE CARD ===== */}
        <div className="adm-table-card">
          {filtered.length === 0 ? (
            <div className="adm-empty">
              <div className="adm-empty-icon-wrap">
                <FaInfoCircle />
              </div>
              <h4>{search ? "No matching categories" : "No categories yet"}</h4>
              <p>
                {search
                  ? "Try a different search term."
                  : "Use the form above to add your first Fixly service category."}
              </p>
              {search && (
                <button
                  className="adm-empty-clear"
                  onClick={() => setSearch("")}>
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th className="adm-th adm-th-num">#</th>
                      <th className="adm-th">Category</th>
                      <th className="adm-th adm-th-desc">Description</th>
                      <th className="adm-th adm-th-status">Status</th>
                      <th className="adm-th adm-th-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((c, i) => (
                      <tr key={c.id} className="adm-tr">
                        <td className="adm-td adm-td-num">
                          {(safePage - 1) * ROWS_PER_PAGE + i + 1}
                        </td>
                        <td className="adm-td">
                          <div className="adm-cat-name-wrap">
                            <div className="adm-cat-dot" />
                            <span className="adm-cat-name">{c.name}</span>
                          </div>
                        </td>
                        <td className="adm-td adm-td-desc">
                          <span className="adm-desc-text">{c.description}</span>
                        </td>
                        <td className="adm-td adm-td-status">
                          <span
                            className={`adm-badge ${c.active ? "adm-badge-active" : "adm-badge-inactive"}`}>
                            {c.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="adm-td adm-td-actions">
                          <div className="adm-action-row">
                            <button
                              className={`adm-icon-btn adm-btn-toggle ${c.active ? "tog-on" : "tog-off"}`}
                              title={c.active ? "Deactivate" : "Activate"}
                              onClick={() => toggleStatus(c.id)}>
                              {c.active ? <FaToggleOn /> : <FaToggleOff />}
                            </button>
                            <button
                              className="adm-icon-btn adm-btn-edit"
                              title="Edit"
                              onClick={() => startEdit(c)}>
                              <FaEdit />
                            </button>
                            <button
                              className="adm-icon-btn adm-btn-delete"
                              title="Delete"
                              onClick={() => setConfirmId(c.id)}>
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="adm-pagination">
                  <button
                    className="adm-page-btn adm-page-arrow"
                    disabled={safePage === 1}
                    onClick={() => setPage(safePage - 1)}>
                    <FaChevronLeft />
                  </button>

                  <div className="adm-page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (n) => {
                        if (
                          totalPages > 7 &&
                          n !== 1 &&
                          n !== totalPages &&
                          Math.abs(n - safePage) > 2
                        ) {
                          if (n === safePage - 3 || n === safePage + 3)
                            return (
                              <span key={n} className="adm-page-ellipsis">
                                …
                              </span>
                            );
                          return null;
                        }
                        return (
                          <button
                            key={n}
                            className={`adm-page-btn ${safePage === n ? "adm-page-active" : ""}`}
                            onClick={() => setPage(n)}>
                            {n}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <button
                    className="adm-page-btn adm-page-arrow"
                    disabled={safePage === totalPages}
                    onClick={() => setPage(safePage + 1)}>
                    <FaChevronRight />
                  </button>

                  <span className="adm-page-info">
                    {safePage} / {totalPages} &nbsp;·&nbsp; {filtered.length}{" "}
                    total
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* ===== CONFIRM DELETE MODAL ===== */}
        {confirmId && (
          <div className="adm-modal-backdrop">
            <div className="adm-modal">
              <div className="adm-modal-icon-wrap">
                <FaExclamationTriangle />
              </div>
              <h4 className="adm-modal-title">Delete Category?</h4>
              <p className="adm-modal-desc">
                This action is permanent and cannot be undone. All associated
                data will be removed.
              </p>
              <div className="adm-modal-actions">
                <button
                  className="adm-modal-cancel"
                  onClick={() => setConfirmId(null)}>
                  Cancel
                </button>
                <button className="adm-modal-confirm" onClick={confirmDelete}>
                  <FaTrash /> Yes, Delete
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
