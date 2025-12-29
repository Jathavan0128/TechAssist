export function formatDate(date) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleString();
  } catch {
    return date;
  }
}

export function truncate(str, length = 100) {
  if (!str) return "";
  return str.length > length ? str.slice(0, length) + "…" : str;
}
