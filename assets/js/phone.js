// US phone helpers: keep 10 digits and display them as (xxx) xxx-xxxx.

export function phoneDigits(value) {
  let digits = String(value).replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

export function formatPhone(digits) {
  if (!digits) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Format an input as the visitor types (deleting is left alone so backspace feels natural). */
export function bindPhoneFormatting(input) {
  const reformat = () => { input.value = formatPhone(phoneDigits(input.value)); };
  input.addEventListener("input", (event) => {
    if (event.inputType && event.inputType.startsWith("delete")) return;
    reformat();
  });
  input.addEventListener("blur", reformat);
  return reformat;
}
