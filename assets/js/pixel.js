// Meta Pixel: loads the tracker, records a page view, and records a Lead
// on the thank-you page (<body data-lead="true">) when the visitor arrived there
// by submitting the quote form.

import { consumeLeadSubmitted } from "./lead-flag.js";

export function initPixel(pixelId) {
  if (!/^\d+$/.test(pixelId) || window.fbq) return;

  const fbq = function (...args) {
    fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", pixelId);
  fbq("track", "PageView");
  if (document.body.dataset.lead === "true" && consumeLeadSubmitted()) fbq("track", "Lead");
}
