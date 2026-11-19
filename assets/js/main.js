// Entry point loaded on every page.

import { PIXEL_ID } from "./config.js";
import { initPixel } from "./pixel.js";
import { fillUtmFields } from "./utm.js";
import { initQuoteForm } from "./quote-form.js";

initPixel(PIXEL_ID);

const quoteForm = document.querySelector("form[data-quote-form]");
if (quoteForm) {
  fillUtmFields(quoteForm);
  initQuoteForm(quoteForm);
}
