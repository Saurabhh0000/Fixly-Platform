import { useState, useEffect, useMemo, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaBell,
  FaCalendarAlt,
  FaStar,
  FaTools,
  FaMapMarkerAlt,
  FaUser,
  FaUserCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaCheck,
  FaSearch,
  FaTimes,
  FaCheckDouble,
  FaTrashAlt,
  FaExclamationTriangle,
  FaRedo,
  FaArrowRight,
  FaChevronDown,
} from "react-icons/fa";
// ⚠️ Adjust this import path to match where your existing fixlyApi instance lives
import fixlyApi from "../api/fixlyApi";
import { AuthContext } from "../context/AuthContext";
import "../styles/NotificationPage.css";

/* ══════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════ */

/** Converts an ISO date string into a short relative-time label. */
function formatRelativeTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

/* Single source of truth for icon + badge color per notification type.
   Values pulled directly from the supplied Fixly palette. */
const TYPE_META = {
  BOOKING: {
    label: "Booking",
    icon: FaCalendarAlt,
    color: "#2563EB",
    bg: "#DBEAFE",
  },
  REVIEW: { label: "Review", icon: FaStar, color: "#CA8A04", bg: "#FEF9C3" },
  PROVIDER: {
    label: "Provider",
    icon: FaTools,
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
  ADDRESS: {
    label: "Address",
    icon: FaMapMarkerAlt,
    color: "#0F766E",
    bg: "#CCFBF1",
  },
  ACCOUNT: { label: "Account", icon: FaUser, color: "#0891B2", bg: "#E0F2FE" },
  APPROVAL: {
    label: "Approval",
    icon: FaCheckCircle,
    color: "#15803D",
    bg: "#DCFCE7",
  },
  REJECTION: {
    label: "Rejection",
    icon: FaTimesCircle,
    color: "#DC2626",
    bg: "#FEE2E2",
  },
  SUSPENDED: {
    label: "Suspended",
    icon: FaBan,
    color: "#C2410C",
    bg: "#FFEDD5",
  },
  UNSUSPENDED: {
    label: "Unsuspended",
    icon: FaUserCheck,
    color: "#16A34A",
    bg: "#DCFCE7",
  },
  COMPLETED: {
    label: "Completed",
    icon: FaCheck,
    color: "#16A34A",
    bg: "#DCFCE7",
  },
  DEFAULT: { label: "Update", icon: FaBell, color: "#475569", bg: "#F1F5F9" },
};

/** Returns the icon component for a notification type. */
function getNotificationIcon(type) {
  return (TYPE_META[type] || TYPE_META.DEFAULT).icon;
}

/** Returns { label, color, bg } for a notification type's badge. */
function getNotificationColor(type) {
  const meta = TYPE_META[type] || TYPE_META.DEFAULT;
  return { label: meta.label, color: meta.color, bg: meta.bg };
}

/* Filter chips shown on the page, in the requested order. */
const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "UNREAD", label: "Unread" },
  { key: "BOOKING", label: "Booking" },
  { key: "PROVIDER", label: "Provider" },
  { key: "REVIEW", label: "Review" },
  { key: "ADDRESS", label: "Address" },
  { key: "ACCOUNT", label: "Account" },
  { key: "APPROVAL", label: "Approval" },
  { key: "REJECTION", label: "Rejection" },
  { key: "SUSPENDED", label: "Suspended" },
  { key: "COMPLETED", label: "Completed" },
];

/* Maps a notification type to its optional call-to-action button.
   ⚠️ These target routes are best-guess based on the paths already used
   elsewhere in Fixly — adjust to match your actual route params. */
function getNotificationAction(type, referenceId, role) {
  const isProvider = role === "PROVIDER";

  const ACTION_META = {
    BOOKING: {
      label: "Go to Booking",
      path: isProvider
        ? "/provider/dashboard"
        : referenceId
          ? `/user/bookings/${referenceId}`
          : "/user/bookings",
    },
    COMPLETED: {
      label: "Go to Booking",
      path: isProvider
        ? "/provider/dashboard"
        : referenceId
          ? `/user/bookings/${referenceId}`
          : "/user/bookings",
    },
    PROVIDER: {
      label: "View Provider Request",
      path: referenceId
        ? `/admin/providers/${referenceId}`
        : "/admin/providers",
    },
    REVIEW: {
      label: "View Review",
      path: referenceId ? `/user/bookings/${referenceId}` : "/user/bookings",
    },
    ADDRESS: { label: "Edit Profile", path: "/profile" },
    ACCOUNT: { label: "Edit Profile", path: "/profile" },
    APPROVAL: { label: "View Status", path: "/become-provider" },
    REJECTION: { label: "View Status", path: "/become-provider" },
    SUSPENDED: { label: "View Status", path: "/provider/dashboard" },
    UNSUSPENDED: { label: "View Status", path: "/provider/dashboard" },
  };

  return ACTION_META[type] || null;
}

const PAGE_SIZE = 10;

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════════════════════════ */

function NotificationCard({ notification, role, onOpen }) {
  const { id, title, message, type, read, createdAt, referenceId } =
    notification;

  const Icon = getNotificationIcon(type);
  const badge = getNotificationColor(type);
  const action = getNotificationAction(type, referenceId, role);

  const handleActivate = () => onOpen(notification);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    }
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    handleActivate();
  };

  return (
    <article
      className={`np-card ${!read ? "np-card-unread" : ""}`}
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      aria-label={`${title}. ${message}. ${!read ? "Unread." : "Read."}`}>
      {!read && <span className="np-unread-dot" aria-hidden="true" />}

      <span
        className="np-card-icon"
        style={{ color: badge.color, background: badge.bg }}
        aria-hidden="true">
        <Icon />
      </span>

      <div className="np-card-body">
        <div className="np-card-top">
          <h3 className="np-card-title">{title}</h3>
          <span
            className="np-type-badge"
            style={{ color: badge.color, background: badge.bg }}>
            {badge.label}
          </span>
        </div>

        <p className="np-card-message">{message}</p>

        <div className="np-card-bottom">
          <span className="np-card-time">{formatRelativeTime(createdAt)}</span>

          {action && (
            <button
              type="button"
              className="np-action-btn"
              onClick={handleActionClick}
              aria-label={`${action.label} for "${title}"`}>
              {action.label}
              <FaArrowRight aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="np-skeleton-card" aria-hidden="true">
      <div className="np-skeleton-icon" />
      <div className="np-skeleton-lines">
        <div className="np-skeleton-line np-skeleton-line-title" />
        <div className="np-skeleton-line np-skeleton-line-msg" />
        <div className="np-skeleton-line np-skeleton-line-time" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════ */

export default function NotificationPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [markingAll, setMarkingAll] = useState(false);
  const [clearing, setClearing] = useState(false);

  /* ---------- FETCH ---------- */
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fixlyApi.get("/api/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("We couldn't load your notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /* Reset pagination whenever the visible set changes shape */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, activeFilter, sortOrder]);

  /* ---------- ACTIONS ---------- */
  const handleOpen = useCallback(
    async (notification) => {
      const { id, read, referenceId, type } = notification;

      if (!read) {
        // Optimistic update
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
        try {
          await fixlyApi.put(`/api/notifications/${id}/read`);
        } catch (err) {
          console.error("Failed to mark notification as read:", err);
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: false } : n)),
          );
        }
      }

      const action = getNotificationAction(type, referenceId, user?.role);
      if (referenceId && action) {
        navigate(action.path);
      }
    },
    [navigate, user?.role],
  );

  const handleMarkAllRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;

    const prevNotifications = notifications;
    setMarkingAll(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await fixlyApi.put("/api/notifications/read-all");
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      setNotifications(prevNotifications);
      toast.error("Couldn't mark all as read. Please try again.");
    } finally {
      setMarkingAll(false);
    }
  }, [notifications]);

  const handleClearRead = useCallback(async () => {
    const readOnes = notifications.filter((n) => n.read);
    if (readOnes.length === 0) return;

    const prevNotifications = notifications;
    setClearing(true);
    setNotifications((prev) => prev.filter((n) => !n.read));

    try {
      await fixlyApi.delete("/api/notifications/read");
      toast.success("Read notifications cleared");
    } catch (err) {
      console.error("Failed to clear read notifications:", err);
      setNotifications(prevNotifications);
      toast.error("Couldn't clear read notifications. Please try again.");
    } finally {
      setClearing(false);
    }
  }, [notifications]);

  /* ---------- DERIVED DATA ---------- */
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );
  const readCount = notifications.length - unreadCount;

  const filtered = useMemo(() => {
    let list = notifications;

    if (activeFilter === "UNREAD") {
      list = list.filter((n) => !n.read);
    } else if (activeFilter !== "ALL") {
      list = list.filter((n) => n.type === activeFilter);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.message?.toLowerCase().includes(q),
      );
    }

    return list;
  }, [notifications, activeFilter, search]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const diff = new Date(a.createdAt) - new Date(b.createdAt);
      return sortOrder === "newest" ? -diff : diff;
    });
    return list;
  }, [filtered, sortOrder]);

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  const clearFiltersAndSearch = () => {
    setSearch("");
    setActiveFilter("ALL");
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="np-page">
      <div className="np-container">
        {/* ── HEADER ───────────────────────────────────────── */}
        <header className="np-header">
          <div className="np-header-text">
            <h1 className="np-title">Notifications</h1>
            <p className="np-subtitle">
              Stay updated with your bookings, provider requests, account
              activity and important updates.
            </p>
          </div>

          <div className="np-header-actions">
            {unreadCount > 0 && (
              <span className="np-unread-count" aria-live="polite">
                {unreadCount} unread
              </span>
            )}

            <button
              type="button"
              className="np-btn np-btn-outline"
              onClick={handleMarkAllRead}
              disabled={markingAll || unreadCount === 0}
              aria-label="Mark all notifications as read">
              <FaCheckDouble aria-hidden="true" />
              Mark All Read
            </button>

            <button
              type="button"
              className="np-btn np-btn-ghost"
              onClick={handleClearRead}
              disabled={clearing || readCount === 0}
              aria-label="Clear read notifications">
              <FaTrashAlt aria-hidden="true" />
              Clear Read
            </button>
          </div>
        </header>

        {/* ── TOOLBAR: search + sort ──────────────────────── */}
        <div className="np-toolbar">
          <div className="np-search-wrap">
            <FaSearch className="np-search-icon" aria-hidden="true" />
            <input
              type="text"
              className="np-search-input"
              placeholder="Search notifications…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search notifications by title or message"
            />
            {search && (
              <button
                type="button"
                className="np-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search">
                <FaTimes />
              </button>
            )}
          </div>

          <div className="np-sort-wrap">
            <label htmlFor="np-sort" className="np-sr-only">
              Sort notifications
            </label>
            <select
              id="np-sort"
              className="np-sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort notifications">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <FaChevronDown className="np-sort-chevron" aria-hidden="true" />
          </div>
        </div>

        {/* ── FILTER CHIPS ─────────────────────────────────── */}
        <div
          className="np-filters"
          role="tablist"
          aria-label="Filter notifications">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={activeFilter === f.key}
              className={`np-chip ${activeFilter === f.key ? "np-chip-active" : ""}`}
              onClick={() => setActiveFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        {/* ── LIST ─────────────────────────────────────────── */}
        {loading ? (
          <div className="np-list">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="np-state np-error-state" role="alert">
            <span className="np-state-icon np-error-icon">
              <FaExclamationTriangle />
            </span>
            <h2 className="np-state-title">Something went wrong</h2>
            <p className="np-state-body">{error}</p>
            <button
              type="button"
              className="np-btn np-btn-solid"
              onClick={fetchNotifications}>
              <FaRedo aria-hidden="true" />
              Retry
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="np-state np-empty-state">
            <span className="np-state-icon np-empty-icon">
              <FaBell />
            </span>
            <h2 className="np-state-title">No notifications yet</h2>
            <p className="np-state-body">You'll receive updates here.</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="np-state np-empty-state">
            <span className="np-state-icon np-empty-icon">
              <FaSearch />
            </span>
            <h2 className="np-state-title">No matching notifications</h2>
            <p className="np-state-body">
              Try a different search term or filter.
            </p>
            <button
              type="button"
              className="np-btn np-btn-outline"
              onClick={clearFiltersAndSearch}>
              Clear search &amp; filters
            </button>
          </div>
        ) : (
          <>
            <div className="np-list">
              {visible.map((n, i) => (
                <div
                  key={n.id}
                  className="np-card-enter"
                  style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                  <NotificationCard
                    notification={n}
                    role={user?.role}
                    onOpen={handleOpen}
                  />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="np-load-more-wrap">
                <button
                  type="button"
                  className="np-btn np-btn-outline np-load-more"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
