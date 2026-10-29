/* Grade My Insurance — shared script
   1. Paste your Meta Pixel ID below (numbers only, inside the quotes).
   2. That is the only line you need to change in this file. */
var PIXEL_ID = "1155605003604700";

/* ---- Meta Pixel (loads only once a real ID is set) ---- */
(function () {
  if (!/^\d+$/.test(PIXEL_ID)) return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');
  if (document.body && document.body.dataset.lead === "true") fbq('track', 'Lead');
})();

/* ---- Quote form: remember the ad that sent them, check fields before sending ---- */
(function () {
  var form = document.getElementById("quoteForm");
  if (!form) return;

  var params = new URLSearchParams(location.search);
  ["utm_source", "utm_campaign", "utm_content"].forEach(function (k) {
    var el = form.querySelector('input[name="' + k + '"]');
    if (el && params.get(k)) el.value = params.get(k);
  });

  /* Phone: keep 10 digits and show them as (xxx) xxx-xxxx while typing */
  var phoneEl = document.getElementById("phone");
  function phoneDigits(s) {
    var d = s.replace(/\D/g, "");
    if (d.length === 11 && d.charAt(0) === "1") d = d.slice(1);
    return d.slice(0, 10);
  }
  function formatPhone(d) {
    if (d.length === 0) return "";
    if (d.length < 4) return "(" + d;
    if (d.length < 7) return "(" + d.slice(0, 3) + ") " + d.slice(3);
    return "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
  }
  if (phoneEl) {
    phoneEl.addEventListener("input", function (e) {
      if (e.inputType && e.inputType.indexOf("delete") === 0) return;
      phoneEl.value = formatPhone(phoneDigits(phoneEl.value));
    });
    phoneEl.addEventListener("blur", function () {
      phoneEl.value = formatPhone(phoneDigits(phoneEl.value));
    });
  }

  var err = document.getElementById("formErr");
  function fail(id, msg) { err.textContent = msg; document.getElementById(id).focus(); }

  form.addEventListener("submit", function (e) {
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var checks = [
      ["fName", v("fName") !== "", "Enter your first name."],
      ["lName", v("lName") !== "", "Enter your last name."],
      ["phone", phoneDigits(v("phone")).length === 10, "Enter a 10-digit phone number, like (864) 555-0123."],
      ["email", /^\S+@\S+\.\S+$/.test(v("email")), "Enter an email address like name@school.org."],
      ["zip", /^\d{5}$/.test(v("zip")), "Enter a 5-digit ZIP code."],
      ["role", v("role") !== "", "Please choose an option."]
    ];
    for (var i = 0; i < checks.length; i++) {
      if (!checks[i][1]) { e.preventDefault(); fail(checks[i][0], checks[i][2]); return; }
    }
    err.textContent = "";
    if (phoneEl) phoneEl.value = formatPhone(phoneDigits(phoneEl.value));
  });
})();
