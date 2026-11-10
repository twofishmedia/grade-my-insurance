// Runs automatically whenever Netlify accepts a (non-spam) form submission.
// For the "quote" form, it emails the person an auto-reply.

import { buildAutoReplyEmail } from "../lib/auto-reply-email.mjs";
import { sendEmail } from "../lib/send-email.mjs";

const QUOTE_FORM_NAME = "quote";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async (request) => {
  let payload;
  try {
    ({ payload } = await request.json());
  } catch {
    console.error("Auto-reply skipped: could not read the submission event.");
    return new Response("Bad event", { status: 400 });
  }

  if (payload?.form_name !== QUOTE_FORM_NAME) {
    return new Response("Not the quote form; nothing to do.");
  }

  const data = payload.data || {};
  const to = String(data.email || "").trim();
  if (!EMAIL_PATTERN.test(to)) {
    console.warn(`Auto-reply skipped for submission ${payload.id}: no valid email address.`);
    return new Response("No valid email address.");
  }

  try {
    const message = buildAutoReplyEmail({ firstName: data.first_name });
    const id = await sendEmail({ to, ...message });
    console.log(`Auto-reply sent for submission ${payload.id} (Resend id ${id}).`);
    return new Response("Auto-reply sent.");
  } catch (error) {
    // Logged so it shows in Netlify → Logs → Functions; the lead itself is already saved in Netlify Forms.
    console.error(`Auto-reply failed for submission ${payload.id}: ${error.message}`);
    return new Response("Auto-reply failed.", { status: 500 });
  }
};
