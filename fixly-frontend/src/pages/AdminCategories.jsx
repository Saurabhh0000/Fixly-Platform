import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTools,
  FaSearch,
  FaTimes,
  FaExclamationTriangle,
  FaLayerGroup,
  FaAlignLeft,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
  FaTags,
  FaRedo,
  FaList,
} from "react-icons/fa";
import toast from "react-hot-toast";
import fixlyApi from "../api/fixlyApi";
import "../styles/admin-categories.css";
import AdminLayout from "../layouts/AdminLayout";

const CARDS_PER_PAGE = 6;

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ── Add / Edit modal ── */
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null = add mode
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ── Delete confirm ── */
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ===== LOAD ===== */
  const loadCategories = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await fixlyApi.get("/api/categories");
      setCategories(res.data || []);
    } catch {
      setLoadError(true);
      toast.error("Unable to load service categories.", { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ===== BODY SCROLL LOCK + ESCAPE WHILE A MODAL IS OPEN ===== */
  useEffect(() => {
    const anyModalOpen = modalOpen || !!deleteTarget;
    if (!anyModalOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") {
        if (modalOpen) closeModal();
        if (deleteTarget) setDeleteTarget(null);
      }
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, deleteTarget]);

  /* ===== SEARCH + PAGINATION ===== */
  const filtered = categories.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * CARDS_PER_PAGE,
    safePage * CARDS_PER_PAGE,
  );

  const handleSearchChange = (v) => {
    setSearch(v);
    setPage(1);
  };

  /* ===== MODAL OPEN/CLOSE ===== */
  const openAddModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormDescription("");
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormName(category.name || "");
    setFormDescription(category.description || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return; // don't allow closing mid-submit
    setModalOpen(false);
    setEditingCategory(null);
    setFormName("");
    setFormDescription("");
  };

  /* ===== CREATE / UPDATE ===== */
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // prevent duplicate submission

    const trimmedName = formName.trim();
    const trimmedDescription = formDescription.trim();

    if (!trimmedName) {
      toast.error("Category name is required.", { duration: 3000 });
      return;
    }
    if (!trimmedDescription) {
      toast.error("Category description is required.", { duration: 3000 });
      return;
    }

    setSubmitting(true);
    try {
      const payload = { name: trimmedName, description: trimmedDescription };

      if (editingCategory) {
        await fixlyApi.put(`/api/categories/${editingCategory.id}`, payload);
        toast.success("Category updated successfully.", { duration: 3500 });
      } else {
        await fixlyApi.post("/api/categories", payload);
        toast.success("New category added successfully.", { duration: 3500 });
      }

      setModalOpen(false);
      setEditingCategory(null);
      setFormName("");
      setFormDescription("");
      await loadCategories();
    } catch {
      toast.error("Operation failed. Please try again.", { duration: 3500 });
    } finally {
      setSubmitting(false);
    }
  };

  /* ===== DELETE ===== */
  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await fixlyApi.delete(`/api/categories/${deleteTarget.id}`);
      toast.success("Category deleted successfully.", { duration: 3500 });
      setDeleteTarget(null);

      // if we just deleted the last item on the last page, step back a page
      const remaining = filtered.length - 1;
      const newTotalPages = Math.max(1, Math.ceil(remaining / CARDS_PER_PAGE));
      if (safePage > newTotalPages) setPage(newTotalPages);

      await loadCategories();
    } catch {
      toast.error("Delete failed. Please try again.", { duration: 3500 });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="adc-wrapper">
        {/* ===== PAGE HEADER ===== */}
        <div className="adc-page-header">
          <div className="adc-header-left">
            <div className="adc-header-icon">
              <FaTags />
            </div>
            <div>
              <h2 className="adc-page-title">Service Categories</h2>
              <p className="adc-page-sub">
                Manage the service categories available across Fixly
              </p>
            </div>
          </div>

          <div className="adc-header-right">
            <div className="adc-total-badge">
              <FaList />
              {categories.length} Categor{categories.length !== 1 ? "ies" : "y"}
            </div>
            <button
              className="adc-add-btn"
              onClick={openAddModal}
              aria-label="Add a new service category">
              <FaPlus /> Add Category
            </button>
          </div>
        </div>

        {/* ===== SEARCH ===== */}
        <div className="adc-search-wrap">
          <FaSearch className="adc-search-icon" />
          <input
            className="adc-search-input"
            type="text"
            placeholder="Search categories by name or description…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Search service categories"
          />
          {search && (
            <button
              className="adc-search-clear"
              onClick={() => handleSearchChange("")}
              aria-label="Clear search">
              <FaTimes />
            </button>
          )}
        </div>

        {search && !loading && !loadError && (
          <p className="adc-results-line">
            Showing <strong>{filtered.length}</strong> result
            {filtered.length !== 1 ? "s" : ""} for "<em>{search}</em>"
          </p>
        )}

        {/* ===== LOADING SKELETON ===== */}
        {loading && (
          <div className="adc-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="adc-skel-card" key={i}>
                <div className="adc-skel-icon" />
                <div className="adc-skel-line adc-skel-line-title" />
                <div className="adc-skel-line" />
                <div className="adc-skel-line adc-skel-line-short" />
              </div>
            ))}
          </div>
        )}

        {/* ===== ERROR STATE ===== */}
        {!loading && loadError && (
          <div className="adc-empty">
            <div className="adc-empty-icon-wrap adc-empty-icon-error">
              <FaExclamationTriangle />
            </div>
            <h4>Unable to load service categories</h4>
            <p>
              Something went wrong while fetching categories. Please try again.
            </p>
            <button className="adc-empty-btn" onClick={loadCategories}>
              <FaRedo /> Retry
            </button>
          </div>
        )}

        {/* ===== EMPTY STATE ===== */}
        {!loading && !loadError && filtered.length === 0 && (
          <div className="adc-empty">
            <div className="adc-empty-icon-wrap">
              <FaInfoCircle />
            </div>
            <h4>
              {search
                ? "No matching categories"
                : "No service categories found"}
            </h4>
            <p>
              {search
                ? "Try a different search term or clear the search."
                : "Get started by adding your first Fixly service category."}
            </p>
            {search ? (
              <button
                className="adc-empty-btn"
                onClick={() => handleSearchChange("")}>
                Clear Search
              </button>
            ) : (
              <button className="adc-empty-btn" onClick={openAddModal}>
                <FaPlus /> Add Your First Category
              </button>
            )}
          </div>
        )}

        {/* ===== GRID ===== */}
        {!loading && !loadError && filtered.length > 0 && (
          <>
            <div className="adc-grid">
              {paginated.map((c) => (
                <div className="adc-card" key={c.id}>
                  <div className="adc-card-top">
                    <div className="adc-card-icon">
                      <FaTools />
                    </div>
                    <div className="adc-card-text">
                      <h4 className="adc-card-name">{c.name}</h4>
                      <p className="adc-card-desc">{c.description}</p>
                    </div>
                  </div>

                  <div className="adc-card-actions">
                    <button
                      className="adc-action-btn adc-action-edit"
                      onClick={() => openEditModal(c)}
                      aria-label={`Edit ${c.name}`}>
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="adc-action-btn adc-action-delete"
                      onClick={() => setDeleteTarget(c)}
                      aria-label={`Delete ${c.name}`}>
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ===== PAGINATION ===== */}
            {totalPages > 1 && (
              <div className="adc-pagination">
                <button
                  className="adc-page-btn adc-page-arrow"
                  disabled={safePage === 1}
                  onClick={() => setPage(safePage - 1)}
                  aria-label="Previous page">
                  <FaChevronLeft />
                </button>

                <div className="adc-page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (n) => {
                      if (
                        totalPages > 7 &&
                        n !== 1 &&
                        n !== totalPages &&
                        Math.abs(n - safePage) > 2
                      ) {
                        if (n === safePage - 3 || n === safePage + 3) {
                          return (
                            <span key={n} className="adc-page-ellipsis">
                              …
                            </span>
                          );
                        }
                        return null;
                      }
                      return (
                        <button
                          key={n}
                          className={`adc-page-btn ${safePage === n ? "adc-page-active" : ""}`}
                          onClick={() => setPage(n)}
                          aria-current={safePage === n ? "page" : undefined}>
                          {n}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  className="adc-page-btn adc-page-arrow"
                  disabled={safePage === totalPages}
                  onClick={() => setPage(safePage + 1)}
                  aria-label="Next page">
                  <FaChevronRight />
                </button>

                <span className="adc-page-info">
                  {safePage} / {totalPages} &nbsp;·&nbsp; {filtered.length}{" "}
                  total
                </span>
              </div>
            )}
          </>
        )}

        {/* ===== ADD / EDIT MODAL ===== */}
        {modalOpen && (
          <div
            className="adc-modal-backdrop"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}>
            <div
              className="adc-modal"
              role="dialog"
              aria-modal="true"
              aria-label={
                editingCategory
                  ? "Edit service category"
                  : "Add service category"
              }>
              <div className="adc-modal-header">
                <div className="adc-modal-header-icon">
                  {editingCategory ? <FaEdit /> : <FaLayerGroup />}
                </div>
                <h3 className="adc-modal-title">
                  {editingCategory
                    ? "Edit Service Category"
                    : "Add Service Category"}
                </h3>
                <button
                  className="adc-modal-close"
                  onClick={closeModal}
                  aria-label="Close">
                  <FaTimes />
                </button>
              </div>

              <form className="adc-modal-form" onSubmit={handleModalSubmit}>
                <div className="adc-field">
                  <label className="adc-label" htmlFor="adc-name">
                    <FaLayerGroup className="adc-label-icon" />
                    Category Name <span className="adc-req">*</span>
                  </label>
                  <input
                    id="adc-name"
                    className="adc-input"
                    placeholder="e.g. Plumbing, Electrical, Cleaning…"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    disabled={submitting}
                    autoFocus
                  />
                </div>

                <div className="adc-field">
                  <label className="adc-label" htmlFor="adc-description">
                    <FaAlignLeft className="adc-label-icon" />
                    Description <span className="adc-req">*</span>
                  </label>
                  <textarea
                    id="adc-description"
                    className="adc-input adc-textarea"
                    placeholder="Brief description of what this category covers…"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                    disabled={submitting}
                  />
                </div>

                <div className="adc-modal-actions">
                  <button
                    type="button"
                    className="adc-modal-cancel"
                    onClick={closeModal}
                    disabled={submitting}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="adc-modal-submit"
                    disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="adc-spinner" />
                        {editingCategory ? "Updating…" : "Adding…"}
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        {editingCategory ? "Update Category" : "Add Category"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== DELETE CONFIRM MODAL ===== */}
        {deleteTarget && (
          <div
            className="adc-modal-backdrop"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget && !deleting)
                setDeleteTarget(null);
            }}>
            <div
              className="adc-modal adc-modal-sm"
              role="dialog"
              aria-modal="true"
              aria-label="Confirm delete category">
              <div className="adc-confirm-icon-wrap">
                <FaExclamationTriangle />
              </div>
              <h4 className="adc-confirm-title">Delete Category?</h4>
              <p className="adc-confirm-desc">
                Are you sure you want to delete{" "}
                <strong>{deleteTarget.name}</strong>? This action is permanent
                and cannot be undone.
              </p>
              <div className="adc-modal-actions">
                <button
                  className="adc-modal-cancel"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}>
                  Cancel
                </button>
                <button
                  className="adc-modal-delete"
                  onClick={confirmDelete}
                  disabled={deleting}>
                  {deleting ? (
                    <>
                      <span className="adc-spinner" /> Deleting…
                    </>
                  ) : (
                    <>
                      <FaTrash /> Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
