/**
 * Converts an ISO date string into a short relative-time label
 * e.g. "Just now", "2 min ago", "Yesterday", "3 days ago"
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return "";

    console.log("API Date:", dateString);

  const date = new Date(dateString);
  const now = new Date();

  console.log("Parsed Date:", date);
  console.log("Now:", now);
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