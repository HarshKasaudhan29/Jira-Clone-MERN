// ─────────────────────────────────────────────────────────────────────────────
// helpers.js — shared utility functions used across the frontend
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a date string into a readable format.
 * @param {string|Date} dateStr
 * @param {"short"|"long"} style
 * @returns {string}  e.g. "Jan 5" or "January 5, 2025"
 *
 * Usage:
 *   formatDate("2025-01-05")          → "Jan 5"
 *   formatDate("2025-01-05", "long")  → "January 5, 2025"
 */
export const formatDate = (dateStr, style = "short") => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date)) return "—";

  if (style === "long") {
    return date.toLocaleDateString("en-US", {
      year:  "numeric",
      month: "long",
      day:   "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
  });
};

/**
 * Check if a due date is overdue (past today).
 * @param {string|Date} dateStr
 * @returns {boolean}
 *
 * Usage:
 *   isOverdue("2024-01-01")  → true
 *   isOverdue("2099-01-01")  → false
 */
export const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
};

/**
 * Generate initials from a full name (max 2 characters).
 * @param {string} name
 * @returns {string}  e.g. "John Doe" → "JD", "Alice" → "A"
 *
 * Usage:
 *   getInitials("John Doe")   → "JD"
 *   getInitials("Alice")      → "A"
 *   getInitials("")           → "?"
 */
export const getInitials = (name = "") => {
  if (!name.trim()) return "?";
  return name
    .trim()
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Truncate a string to a max length and append "…".
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 *
 * Usage:
 *   truncate("Hello World", 5)  → "Hello…"
 */
export const truncate = (str = "", maxLength = 50) => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
};

/**
 * Return a Tailwind color class based on task priority.
 * @param {"High"|"Medium"|"Low"} priority
 * @returns {{ text: string, bg: string, border: string }}
 *
 * Usage:
 *   getPriorityClasses("High")  → { text: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30" }
 */
export const getPriorityClasses = (priority) => {
  const map = {
    High:   { text: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/30"    },
    Medium: { text: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" },
    Low:    { text: "text-green-400",  bg: "bg-green-400/10",  border: "border-green-400/30"  },
  };
  return map[priority] ?? map.Low;
};

/**
 * Return a Tailwind color class based on task status.
 * @param {"To Do"|"In Progress"|"Done"} status
 * @returns {string}  Tailwind text color class
 *
 * Usage:
 *   getStatusColor("Done")        → "text-green-400"
 *   getStatusColor("In Progress") → "text-yellow-400"
 */
export const getStatusColor = (status) => {
  const map = {
    "To Do":       "text-gray-400",
    "In Progress": "text-yellow-400",
    "Done":        "text-green-400",
  };
  return map[status] ?? "text-gray-400";
};

/**
 * Capitalise the first letter of a string.
 * @param {string} str
 * @returns {string}
 *
 * Usage:
 *   capitalise("hello world")  → "Hello world"
 */
export const capitalise = (str = "") =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Group an array of objects by a key.
 * @param {Array}  arr
 * @param {string} key
 * @returns {Object}
 *
 * Usage:
 *   groupBy(tasks, "status")
 *   → { "To Do": [...], "In Progress": [...], "Done": [...] }
 */
export const groupBy = (arr = [], key) =>
  arr.reduce((acc, item) => {
    const group = item[key] ?? "Unknown";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});