// Content of the automatic reply sent to someone who submits the quote form.
// Edit the wording here; the sending logic lives elsewhere.

const POLICY_SHARE_URL = "https://app.usecanopy.com/c/horace-mann-friar-dixon";
const PHONE_DISPLAY = "(864) 707-1131";
const PHONE_LINK = "tel:+18647071131";

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Tidy a submitted first name: trim, collapse spaces, capitalize the first letter. */
const cleanFirstName = (raw) => {
  const name = String(raw || "").trim().replace(/\s+/g, " ").slice(0, 40);
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
};

/**
 * Build the auto-reply for one lead.
 * @param {{ firstName?: string }} lead
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildAutoReplyEmail({ firstName } = {}) {
  const name = cleanFirstName(firstName);
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const subject = name ? `We got your request, ${name}` : "We got your request";

  const html = `<p>${escapeHtml(greeting)}</p>
<p>Thanks for requesting a free insurance review. We have your information, and someone from our team will reach out shortly. During business hours, that's usually within a few minutes.</p>
<p>Want the fastest, most accurate quote? <a href="${POLICY_SHARE_URL}"><strong>Share your current policy</strong></a> in about two minutes. Just sign in to your current insurance company, and we'll take it from there. No digging for paperwork.</p>
<p>With your current coverage in hand, we can compare side by side and skip most of the back-and-forth questions.</p>
<p>Prefer to talk now? Call or text us at <a href="${PHONE_LINK}">${PHONE_DISPLAY}</a>.</p>
<p>Thanks,<br>The Grade My Insurance Team<br>Dixon Insurance Agency · Licensed in South Carolina and North Carolina</p>`;

  const text = `${greeting}

Thanks for requesting a free insurance review. We have your information, and someone from our team will reach out shortly. During business hours, that's usually within a few minutes.

Want the fastest, most accurate quote? Share your current policy in about two minutes: ${POLICY_SHARE_URL}
Just sign in to your current insurance company, and we'll take it from there. No digging for paperwork.

With your current coverage in hand, we can compare side by side and skip most of the back-and-forth questions.

Prefer to talk now? Call or text us at ${PHONE_DISPLAY}.

Thanks,
The Grade My Insurance Team
Dixon Insurance Agency · Licensed in South Carolina and North Carolina`;

  return { subject, html, text };
}
