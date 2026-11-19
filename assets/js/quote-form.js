// Two-step quote form.
// Step 1 asks only for what's needed to call (first name, phone, ZIP).
// Step 2 holds the optional details. Without JavaScript, both steps show as one form.
//
// Markup contract:
//   <form data-quote-form>
//     <fieldset data-step="1"> ... <button type="button" data-next hidden>Continue</button>
//     <fieldset data-step="2"> ... <button type="button" data-back hidden>Back</button>
//     <p data-step-label hidden></p>   (optional "Step 1 of 2" text)
//     <div data-error role="alert"></div>

import { phoneDigits, bindPhoneFormatting } from "./phone.js";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const STEP_RULES = {
  1: [
    { name: "first_name", test: (v) => v !== "", message: "Enter your first name." },
    { name: "phone", test: (v) => phoneDigits(v).length === 10, message: "Enter a 10-digit phone number, like (864) 555-0123." },
    { name: "zip", test: (v) => /^\d{5}$/.test(v), message: "Enter a 5-digit ZIP code." },
  ],
  2: [
    { name: "email", test: (v) => v === "" || EMAIL_PATTERN.test(v), message: "Check your email address, or leave it blank." },
  ],
};

export function initQuoteForm(form) {
  const steps = new Map(
    [...form.querySelectorAll("[data-step]")].map((el) => [Number(el.dataset.step), el])
  );
  const nextButton = form.querySelector("[data-next]");
  const backButton = form.querySelector("[data-back]");
  const stepLabel = form.querySelector("[data-step-label]");
  const errorBox = form.querySelector("[data-error]");
  const phoneInput = form.elements.namedItem("phone");
  const reformatPhone = phoneInput ? bindPhoneFormatting(phoneInput) : () => {};

  let current = 1;

  const showError = (message, field) => {
    errorBox.textContent = message;
    if (field) field.focus();
  };

  const validateStep = (step) => {
    for (const rule of STEP_RULES[step] || []) {
      const field = form.elements.namedItem(rule.name);
      if (field && !rule.test(field.value.trim())) {
        showError(rule.message, field);
        return false;
      }
    }
    errorBox.textContent = "";
    return true;
  };

  const goTo = (step, { focus = true } = {}) => {
    current = step;
    for (const [number, el] of steps) el.hidden = number !== step;
    if (nextButton) nextButton.hidden = step !== 1;
    if (backButton) backButton.hidden = step === 1;
    if (stepLabel) stepLabel.textContent = `Step ${step} of ${steps.size}`;
    if (!focus) return;
    const firstField = steps.get(step)?.querySelector("input:not([type=hidden]), select");
    if (firstField) firstField.focus({ preventScroll: true });
  };

  // Turn on step-by-step mode (the HTML works as a single page until this runs).
  form.classList.add("is-stepped");
  if (stepLabel) stepLabel.hidden = false;
  goTo(1, { focus: false });

  nextButton?.addEventListener("click", () => {
    if (validateStep(1)) goTo(2);
  });
  backButton?.addEventListener("click", () => goTo(1));

  form.addEventListener("submit", (event) => {
    // Pressing Enter on step 1 moves forward instead of sending a half-finished form.
    if (current === 1) {
      event.preventDefault();
      if (validateStep(1)) goTo(2);
      return;
    }
    if (!validateStep(1)) {
      event.preventDefault();
      goTo(1);
      validateStep(1);
      return;
    }
    if (!validateStep(2)) {
      event.preventDefault();
      return;
    }
    reformatPhone();
  });
}
