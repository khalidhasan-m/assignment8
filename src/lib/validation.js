const LOCAL_ORIGIN = "http://suncart.local";

export function getSafeRedirect(value, fallback = "/") {
  if (typeof value !== "string" || value.length === 0) return fallback;

  const candidate = value.trim();
  if (
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(candidate)
  ) {
    return fallback;
  }

  try {
    const url = new URL(candidate, LOCAL_ORIGIN);
    if (url.origin !== LOCAL_ORIGIN) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function isValidHttpUrl(value) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getInitials(value, fallback = "U") {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized ? normalized.charAt(0).toUpperCase() : fallback;
}
