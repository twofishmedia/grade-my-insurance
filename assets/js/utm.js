// Copies ad tracking parameters from the page URL into the form's hidden fields,
// so each lead records which campaign and ad it came from.

const UTM_KEYS = ["utm_source", "utm_campaign", "utm_content"];

export function fillUtmFields(form, search = window.location.search) {
  const params = new URLSearchParams(search);
  for (const key of UTM_KEYS) {
    const field = form.elements.namedItem(key);
    const value = params.get(key);
    if (field && value) field.value = value;
  }
}
