// Marks that this visitor just submitted the quote form, so the thank-you page
// counts a Lead only after a real submission (not when someone opens it directly).

const KEY = "gmi_lead_submitted";

export function markLeadSubmitted() {
  try { sessionStorage.setItem(KEY, "1"); } catch { /* storage unavailable: skip */ }
}

/** Returns true once per submission, then clears the mark. */
export function consumeLeadSubmitted() {
  try {
    const submitted = sessionStorage.getItem(KEY) === "1";
    sessionStorage.removeItem(KEY);
    return submitted;
  } catch {
    return false;
  }
}
