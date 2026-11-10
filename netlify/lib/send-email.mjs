// Sends one email through the Resend API (https://resend.com).
// Settings come from Netlify environment variables, never from the repo:
//   RESEND_API_KEY  – the sending key from Resend (keep secret)
//   MAIL_FROM       – e.g. "Grade My Insurance <quote@grademyinsurance.com>"
//   MAIL_REPLY_TO   – e.g. "quote@grademyinsurance.com"

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function readConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const replyTo = process.env.MAIL_REPLY_TO;
  const missing = [
    ["RESEND_API_KEY", apiKey],
    ["MAIL_FROM", from],
  ].filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) {
    throw new Error(`Missing environment variable(s): ${missing.join(", ")}`);
  }
  return { apiKey, from, replyTo };
}

/**
 * @param {{ to: string, subject: string, html: string, text: string }} message
 * @returns {Promise<string>} the Resend message id
 */
export async function sendEmail({ to, subject, html, text }) {
  const { apiKey, from, replyTo } = readConfig();

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Resend error ${response.status}: ${result.message || "unknown error"}`);
  }
  return result.id;
}
