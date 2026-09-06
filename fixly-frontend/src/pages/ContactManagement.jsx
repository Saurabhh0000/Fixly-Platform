import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaSync,
  FaTimes,
  FaChevronDown,
  FaUser,
  FaUserTie,
  FaUserSlash,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getAdminContacts,
  updateContactStatus,
} from "../../services/contactService";
import "../../styles/contact-management.css";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
];

const USER_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "GUEST", label: "Guest" },
  { value: "USER", label: "User" },
  { value: "PROVIDER", label: "Provider" },
];

const REASON_OPTIONS = [
  { value: "", label: "All Reasons" },
  { value: "GENERAL_QUESTION", label: "General Question" },
  { value: "BOOKING_SUPPORT", label: "Booking Support" },
  { value: "PROVIDER_SUPPORT", label: "Provider Support" },
  { value: "ACCOUNT_SUPPORT", label: "Account Support" },
  { value: "PAYMENT_QUESTION", label: "Payment Question" },
  { value: "OTHER", label: "Other" },
];

const STATUS_UPDATE_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
];

const PAGE_SIZE = 20;

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function reasonLabel(reason) {
  const found = REASON_OPTIONS.find((r) => r.value === reason);
  return found ? found.label : reason || "—";
}

const TypeBadge = ({ type }) => {
  const config = {
    GUEST: {
      label: "Guest",
      icon: <FaUserSlash />,
      cls: "fac-badge-type-guest",
    },
    USER: { label: "User", icon: <FaUser />, cls: "fac-badge-type-user" },
    PROVIDER: {
      label: "Provider",
      icon: <FaUserTie />,
      cls: "fac-badge-type-provider",
    },
  }[type] || {
    label: type || "Unknown",
    icon: null,
    cls: "fac-badge-type-guest",
  };

  return (
    <span className={`fac-badge-type ${config.cls}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    NEW: { label: "New", cls: "fac-badge-status-new" },
    IN_PROGRESS: { label: "In Progress", cls: "fac-badge-status-progress" },
    RESOLVED: { label: "Resolved", cls: "fac-badge-status-resolved" },
  }[status] || { label: status || "Unknown", cls: "fac-badge-status-new" };

  return (
    <span className={`fac-badge-status ${config.cls}`}>{config.label}</span>
  );
};

const StatusSelect = ({ value, onChange, disabled, ariaLabel }) => (
  <div className="fac-status-select-wrap">
    <select
      className="fac-status-select"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel || "Update status"}>
      {STATUS_UPDATE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <FaChevronDown className="fac-status-select-chevron" aria-hidden="true" />
    {disabled && (
      <span className="fac-status-select-spinner" aria-hidden="true" />
    )}
  </div>
);

const SkeletonRow = () => (
  <tr className="fac-skeleton-row">
    <td colSpan={7}>
      <div className="fac-skeleton-bar" />
    </td>
  </tr>
);

const ContactDrawer = ({
  contact,
  onClose,
  onStatusChange,
  statusUpdating,
}) => {
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!contact) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [contact, onClose]);

  if (!contact) return null;

  const handleOverlayClick = (e) => {
    if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
  };

  return (
    <div
      className="fac-drawer-overlay"
      onMouseDown={handleOverlayClick}
      role="presentation">
      <div
        className="fac-drawer-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fac-drawer-title">
        <div className="fac-drawer-header">
          <h2 id="fac-drawer-title" className="fac-drawer-title">
            Contact Query
          </h2>
          <button
            type="button"
            className="fac-drawer-close"
            onClick={onClose}
            aria-label="Close contact query details"
            ref={closeBtnRef}>
            <FaTimes />
          </button>
        </div>

        <div className="fac-drawer-body">
          <div className="fac-drawer-row">
            <span className="fac-drawer-label">Subject</span>
            <p className="fac-drawer-subject">{contact.subject}</p>
          </div>

          <div className="fac-drawer-row">
            <span className="fac-drawer-label">Status</span>
            <StatusSelect
              value={contact.status}
              disabled={statusUpdating}
              onChange={(newStatus) => onStatusChange(contact.id, newStatus)}
              ariaLabel="Update contact status"
            />
          </div>

          <div className="fac-drawer-grid">
            <div className="fac-drawer-row">
              <span className="fac-drawer-label">Sender</span>
              <p className="fac-drawer-value">{contact.name}</p>
              <p className="fac-drawer-value-sub">{contact.email}</p>
              {contact.phone && (
                <p className="fac-drawer-value-sub">{contact.phone}</p>
              )}
            </div>

            <div className="fac-drawer-row">
              <span className="fac-drawer-label">Sender Type</span>
              <TypeBadge type={contact.userType} />
            </div>
          </div>

          <div className="fac-drawer-row">
            <span className="fac-drawer-label">Reason</span>
            <p className="fac-drawer-value">{reasonLabel(contact.reason)}</p>
          </div>

          <div className="fac-drawer-row">
            <span className="fac-drawer-label">Customer Message</span>
            <p className="fac-drawer-message">{contact.message}</p>
          </div>

          <div className="fac-drawer-grid">
            <div className="fac-drawer-row">
              <span className="fac-drawer-label">Created At</span>
              <p className="fac-drawer-value-sub">
                {formatDateTime(contact.createdAt)}
              </p>
            </div>
            <div className="fac-drawer-row">
              <span className="fac-drawer-label">Updated At</span>
              <p className="fac-drawer-value-sub">
                {formatDateTime(contact.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactManagement = () => {
  const [filters, setFilters] = useState({
    status: "",
    userType: "",
    reason: "",
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);

  const [data, setData] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [statusUpdatingIds, setStatusUpdatingIds] = useState(() => new Set());

  const searchDebounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const loadContacts = useCallback(
    async (overridePage) => {
      const targetPage = overridePage ?? page;
      const currentRequestId = ++requestIdRef.current;
      setLoading(true);
      setError(false);
      try {
        const res = await getAdminContacts({
          page: targetPage,
          size: PAGE_SIZE,
          status: filters.status || undefined,
          userType: filters.userType || undefined,
          reason: filters.reason || undefined,
          search: filters.search || undefined,
        });
        if (currentRequestId !== requestIdRef.current) return; // stale response
        setData(res);
      } catch {
        if (currentRequestId !== requestIdRef.current) return;
        setError(true);
      } finally {
        if (currentRequestId === requestIdRef.current) setLoading(false);
      }
    },
    [page, filters],
  );

  useEffect(() => {
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setPage(0);
      setFilters((f) => ({ ...f, search: value.trim() }));
    }, 400);
  };

  const clearSearch = () => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    setSearchInput("");
    setPage(0);
    setFilters((f) => ({ ...f, search: "" }));
  };

  const handleFilterChange = (key, value) => {
    setPage(0);
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const clearAllFilters = () => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    setSearchInput("");
    setPage(0);
    setFilters({ status: "", userType: "", reason: "", search: "" });
  };

  const hasActiveFilters =
    filters.status || filters.userType || filters.reason || filters.search;

  const handleStatusChange = async (id, newStatus) => {
    setStatusUpdatingIds((prev) => new Set(prev).add(id));
    try {
      const updated = await updateContactStatus(id, newStatus);
      setData((prev) => ({
        ...prev,
        content: prev.content.map((c) => (c.id === id ? updated : c)),
      }));
      toast.success("Contact status updated successfully.", { duration: 3500 });
    } catch {
      toast.error("Unable to update contact status. Please try again.", {
        duration: 4000,
      });
    } finally {
      setStatusUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const selectedContact = data.content.find((c) => c.id === selectedId) || null;

  // Page-scoped counts only — no backend aggregate endpoint exists yet,
  // so these deliberately reflect the currently loaded page, not the
  // full dataset. Labeled accordingly in the UI rather than implying
  // global totals.
  const pageCounts = data.content.reduce(
    (acc, c) => {
      acc.total += 1;
      if (c.status === "NEW") acc.new += 1;
      else if (c.status === "IN_PROGRESS") acc.inProgress += 1;
      else if (c.status === "RESOLVED") acc.resolved += 1;
      return acc;
    },
    { total: 0, new: 0, inProgress: 0, resolved: 0 },
  );

  const from = data.content.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const to = page * PAGE_SIZE + data.content.length;

  return (
    <AdminLayout>
      <div className="fixly-admin-contact">
        {/* Header */}
        <div className="fac-header">
          <div>
            <h1 className="fac-header-title">Contact Management</h1>
            <p className="fac-header-sub">
              Manage customer queries submitted by guests, users, and service
              providers.
            </p>
          </div>
          <button
            type="button"
            className="fac-refresh-btn"
            onClick={() => loadContacts()}
            aria-label="Refresh contact queries">
            <FaSync className={loading ? "fac-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Summary — page-scoped, clearly labeled */}
        <div className="fac-summary">
          <div className="fac-summary-item">
            <span className="fac-summary-label">On This Page</span>
            <span className="fac-summary-value">{pageCounts.total}</span>
          </div>
          <div className="fac-summary-item">
            <span className="fac-summary-label">New</span>
            <span className="fac-summary-value fac-summary-value-new">
              {pageCounts.new}
            </span>
          </div>
          <div className="fac-summary-item">
            <span className="fac-summary-label">In Progress</span>
            <span className="fac-summary-value">{pageCounts.inProgress}</span>
          </div>
          <div className="fac-summary-item">
            <span className="fac-summary-label">Resolved</span>
            <span className="fac-summary-value fac-summary-value-resolved">
              {pageCounts.resolved}
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="fac-toolbar">
          <div className="fac-search-wrap">
            <FaSearch className="fac-search-icon" aria-hidden="true" />
            <input
              type="search"
              className="fac-search-input"
              placeholder="Search by name, email, subject…"
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              aria-label="Search contact queries"
            />
            {searchInput && (
              <button
                type="button"
                className="fac-search-clear"
                onClick={clearSearch}
                aria-label="Clear search">
                <FaTimes />
              </button>
            )}
          </div>

          <div className="fac-filters">
            <select
              className="fac-filter-select"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              aria-label="Filter by status">
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <select
              className="fac-filter-select"
              value={filters.userType}
              onChange={(e) => handleFilterChange("userType", e.target.value)}
              aria-label="Filter by sender type">
              {USER_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <select
              className="fac-filter-select"
              value={filters.reason}
              onChange={(e) => handleFilterChange("reason", e.target.value)}
              aria-label="Filter by reason">
              {REASON_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                className="fac-clear-filters-btn"
                onClick={clearAllFilters}>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="fac-table-card">
          <div className="fac-table-scroll">
            <table className="fac-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Type</th>
                  <th>Subject</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>
                    <span className="fac-sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}

                {!loading && error && (
                  <tr>
                    <td colSpan={7}>
                      <div className="fac-state fac-state-error">
                        <FaExclamationCircle
                          className="fac-state-icon"
                          aria-hidden="true"
                        />
                        <p className="fac-state-title">
                          Unable to load contact queries.
                        </p>
                        <p className="fac-state-sub">Please try again.</p>
                        <button
                          type="button"
                          className="fac-state-btn"
                          onClick={() => loadContacts()}>
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && !error && data.content.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="fac-state">
                        <p className="fac-state-title">
                          {hasActiveFilters
                            ? "No matching queries"
                            : "No contact queries yet"}
                        </p>
                        <p className="fac-state-sub">
                          {hasActiveFilters
                            ? "Try adjusting your search or filters."
                            : "Contact submissions will appear here when customers reach out to Fixly."}
                        </p>
                        {hasActiveFilters && (
                          <button
                            type="button"
                            className="fac-state-btn"
                            onClick={clearAllFilters}>
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  data.content.map((c) => (
                    <tr
                      key={c.id}
                      className="fac-row"
                      onClick={() => setSelectedId(c.id)}>
                      <td>
                        <p className="fac-cell-primary">{c.name}</p>
                        <p className="fac-cell-secondary">{c.email}</p>
                      </td>
                      <td>
                        <TypeBadge type={c.userType} />
                      </td>
                      <td className="fac-subject-cell">
                        <p className="fac-cell-primary fac-subject-link">
                          {c.subject}
                        </p>
                        <p className="fac-cell-secondary fac-message-preview">
                          {c.message}
                        </p>
                      </td>
                      <td>
                        <span className="fac-cell-secondary">
                          {reasonLabel(c.reason)}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <StatusSelect
                          value={c.status}
                          disabled={statusUpdatingIds.has(c.id)}
                          onChange={(newStatus) =>
                            handleStatusChange(c.id, newStatus)
                          }
                          ariaLabel={`Update status for ${c.subject}`}
                        />
                      </td>
                      <td>
                        <span className="fac-cell-secondary">
                          {formatDateTime(c.createdAt)}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="fac-view-btn"
                          onClick={() => setSelectedId(c.id)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list (shown ≤768px via CSS; table hidden there) */}
          <div className="fac-card-list">
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div className="fac-mobile-skeleton" key={i} />
              ))}

            {!loading &&
              !error &&
              data.content.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  className="fac-mobile-card"
                  onClick={() => setSelectedId(c.id)}>
                  <div className="fac-mobile-card-top">
                    <TypeBadge type={c.userType} />
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="fac-cell-primary">{c.subject}</p>
                  <p className="fac-cell-secondary fac-message-preview">
                    {c.message}
                  </p>
                  <div className="fac-mobile-card-footer">
                    <span className="fac-cell-secondary">{c.name}</span>
                    <span className="fac-cell-secondary">
                      {formatDateTime(c.createdAt)}
                    </span>
                  </div>
                </button>
              ))}
          </div>

          {/* Pagination */}
          {!loading && !error && data.content.length > 0 && (
            <div className="fac-pagination">
              <span className="fac-pagination-info">
                {from}–{to} of {data.totalElements}
              </span>
              <div className="fac-pagination-controls">
                <button
                  type="button"
                  className="fac-pagination-btn"
                  disabled={data.first}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}>
                  Previous
                </button>
                <span className="fac-pagination-page">
                  Page {data.page + 1} of {Math.max(data.totalPages, 1)}
                </span>
                <button
                  type="button"
                  className="fac-pagination-btn"
                  disabled={data.last}
                  onClick={() => setPage((p) => p + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ContactDrawer
        contact={selectedContact}
        onClose={() => setSelectedId(null)}
        onStatusChange={handleStatusChange}
        statusUpdating={
          selectedContact ? statusUpdatingIds.has(selectedContact.id) : false
        }
      />
    </AdminLayout>
  );
};

export default ContactManagement;
