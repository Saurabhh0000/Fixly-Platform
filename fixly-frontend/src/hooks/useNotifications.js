import { useState, useEffect, useCallback, useRef } from "react";
// ⚠️ Adjust this import path to match where your existing fixlyApi instance lives
// e.g. "../api/fixlyApi" or "../services/fixlyApi"
import fixlyApi from "../api/fixlyApi";

const POLL_INTERVAL_MS = 30000; // refresh unread count every 30s

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const pollRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fixlyApi.get("/api/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fixlyApi.get("/api/notifications/count");
      setUnreadCount(res.data || 0);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fixlyApi.put(`/api/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      // Revert on failure
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [fetchNotifications, fetchUnreadCount]);

  const markAllAsRead = useCallback(async () => {
    const prevNotifications = notifications;
    const prevUnread = unreadCount;

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await fixlyApi.put("/api/notifications/read-all");
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      // Revert on failure
      setNotifications(prevNotifications);
      setUnreadCount(prevUnread);
    }
  }, [notifications, unreadCount]);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    pollRef.current = setInterval(fetchUnreadCount, POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  };
}