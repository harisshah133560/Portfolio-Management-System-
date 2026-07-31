export const CATEGORIES = [
  { value: "web-app", label: "Web Application", color: "#3B82F6" },
  { value: "mobile-app", label: "Mobile Application", color: "#8B5CF6" },
  { value: "desktop-app", label: "Desktop Application", color: "#6366F1" },
  { value: "api", label: "API / Backend", color: "#14B8A6" },
  { value: "library", label: "Library / Package", color: "#F97316" },
  { value: "ui-ux", label: "UI/UX Design", color: "#EC4899" },
  { value: "other", label: "Other", color: "#64748B" }
]

export const STATUSES = [
  { value: "completed", label: "Completed", className: "badge-completed" },
  { value: "in-progress", label: "In Progress", className: "badge-in-progress" },
  { value: "planned", label: "Planned", className: "badge-planned" }
]

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "updated", label: "Recently Updated" },
  { value: "alpha-asc", label: "A to Z" },
  { value: "alpha-desc", label: "Z to A" }
]

export const ITEMS_PER_PAGE = 6