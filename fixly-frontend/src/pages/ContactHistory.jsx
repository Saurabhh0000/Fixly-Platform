import { useCallback, useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaExclamationCircle,
  FaHistory,
  FaSearch,
  FaSync,
  FaUser,
  FaUserTie,
  FaUserSlash,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { getMyContactHistory } from "../api/contactService";
import "../styles/contact-history.css";

const PAGE_SIZE = 20;

const STATUS_FILTERS = [
  { value: "", label: "All Queries" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "NEW", label: "New" },
];

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const reasonLabel = (value) =>
  value
    ? value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "General";

const StatusBadge = ({ status }) => {
  const config = {
    NEW: { label: "New", cls: "fch-status-new", icon: <FaEnvelope /> },
    IN_PROGRESS: {
      label: "In Progress",
      cls: "fch-status-progress",
      icon: <FaClock />,
    },
    RESOLVED: {
      label: "Resolved",
      cls: "fch-status-resolved",
      icon: <FaCheckCircle />,
    },
  }[status] || {
    label: status || "Unknown",
    cls: "fch-status-new",
    icon: <FaEnvelope />,
  };

  return (
    <span className={`fch-status ${config.cls}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

const UserTypeBadge = ({ type }) => {
  const config = {
    USER: { label: "User", icon: <FaUser />, cls: "fch-type-user" },
    PROVIDER: {
      label: "Provider",
      icon: <FaUserTie />,
      cls: "fch-type-provider",
    },
    GUEST: {
      label: "Guest",
      icon: <FaUserSlash />,
      cls: "fch-type-guest",
    },
  }[type] || {
    label: type || "Unknown",
    icon: <FaUser />,
    cls: "fch-type-guest",
  };

  return (
    <span className={`fch-type ${config.cls}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

const ContactHistory = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    page: 0,
    first: true,
    last: true,
  });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await getMyContactHistory({
        page,
        size: PAGE_SIZE,
        status: statusFilter || undefined,
        search: search.trim() || undefined,
      });
      setData(result);
    } catch {
      setError(true);
      toast.error("Unable to load contact history.", { duration: 3500 });
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(0);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setPage(0);
  };

  const resolvedOnPage = data.content.filter(
    (contact) => contact.status === "RESOLVED",
  ).length;
  const openOnPage = data.content.filter((contact) => contact.status !== "RESOLVED").length;

  return (
    <div className="fixly-contact-history">
        <header className="fch-header">
          <div className="fch-title-block">
            <div className="fch-title-icon" aria-hidden="true">
              <FaHistory />
            </div>
            <div>
              <h1>Contact History</h1>
              <p>
                Track your support queries and see whether Fixly has resolved them.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="fch-refresh"
            onClick={loadHistory}
            disabled={loading}>
            <FaSync className={loading ? "fch-spin" : ""} />
            Refresh
          </button>
        </header>

        <section className="fch-summary" aria-label="Contact history summary">
          <div className="fch-summary-card fch-summary-total">
            <div className="fch-summary-icon">
              <FaEnvelope />
            </div>
            <div>
              <strong>{data.totalElements}</strong>
              <span>Total queries</span>
              <small>Matching history</small>
            </div>
          </div>

          <div className="fch-summary-card fch-summary-resolved">
            <div className="fch-summary-icon">
              <FaCheckCircle />
            </div>
            <div>
              <strong>{resolvedOnPage}</strong>
              <span>Resolved</span>
              <small>On current page</small>
            </div>
          </div>

          <div className="fch-summary-card fch-summary-open">
            <div className="fch-summary-icon">
              <FaClock />
            </div>
            <div>
              <strong>{openOnPage}</strong>
              <span>Not resolved</span>
              <small>New or in progress</small>
            </div>
          </div>
        </section>

        <section className="fch-filter-card">
          <div className="fch-search">
            <FaSearch aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search name, email, subject or message..."
              aria-label="Search contact history"
            />
          </div>

          <div className="fch-status-filters" role="group" aria-label="Filter by status">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value || "all"}
                type="button"
                className={
                  statusFilter === filter.value ? "fch-filter-active" : ""
                }
                onClick={() => handleStatusFilter(filter.value)}>
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        <section className="fch-list-card">
          <div className="fch-list-header">
            <div>
              <h2>Query history</h2>
              <p>
                {data.totalElements}{" "}
                {data.totalElements === 1 ? "query" : "queries"} found
              </p>
            </div>
            <span className="fch-list-note">
              Status reflects the latest support action
            </span>
          </div>

          {loading && (
            <div className="fch-loading-list">
              {Array.from({ length: 5 }).map((_, index) => (
                <div className="fch-skeleton" key={index} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="fch-state">
              <FaExclamationCircle />
              <h3>Unable to load history</h3>
              <p>Something went wrong while retrieving contact queries.</p>
              <button type="button" onClick={loadHistory}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && data.content.length === 0 && (
            <div className="fch-state">
              <FaHistory />
              <h3>No contact history found</h3>
              <p>
                Try changing the status filter or search term.
              </p>
            </div>
          )}

          {!loading && !error && data.content.length > 0 && (
            <div className="fch-items">
              {data.content.map((contact) => (
                <article className="fch-item" key={contact.id}>
                  <div className="fch-item-status">
                    <StatusBadge status={contact.status} />
                  </div>

                  <div className="fch-item-main">
                    <div className="fch-item-heading">
                      <h3>{contact.subject}</h3>
                      <UserTypeBadge type={contact.userType} />
                    </div>

                    <p className="fch-message">{contact.message}</p>

                    <div className="fch-meta">
                      <span>
                        <strong>From:</strong> {contact.name}
                      </span>
                      <span>{contact.email}</span>
                      <span>
                        <strong>Reason:</strong> {reasonLabel(contact.reason)}
                      </span>
                    </div>
                  </div>

                  <div className="fch-item-dates">
                    <div>
                      <span>Submitted</span>
                      <strong>{formatDateTime(contact.createdAt)}</strong>
                    </div>

                    {contact.status === "RESOLVED" ? (
                      <div className="fch-resolved-date">
                        <span>Resolved</span>
                        <strong>{formatDateTime(contact.resolvedAt)}</strong>
                      </div>
                    ) : (
                      <div className="fch-unresolved-date">
                        <span>Resolution</span>
                        <strong>Not resolved yet</strong>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && data.content.length > 0 && (
            <footer className="fch-pagination">
              <span>
                Page {data.page + 1} of {Math.max(data.totalPages, 1)}
              </span>
              <div>
                <button
                  type="button"
                  disabled={data.first}
                  onClick={() => setPage((current) => Math.max(0, current - 1))}>
                  Previous
                </button>
                <button
                  type="button"
                  disabled={data.last}
                  onClick={() => setPage((current) => current + 1)}>
                  Next
                </button>
              </div>
            </footer>
          )}
        </section>
      </div>
  );
};

export default ContactHistory;
