// Initialisiere das Cookie-Banner
function initializeCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  const acceptAllButton = document.getElementById("accept-all");
  const acceptSelectedButton = document.getElementById("accept-selected");
  const declineAllButton = document.getElementById("decline-all");
  const analyticsCheckbox = document.getElementById("analytics-cookies");
  const marketingCheckbox = document.getElementById("marketing-cookies");

  if (!banner || !acceptAllButton || !acceptSelectedButton || !declineAllButton || !analyticsCheckbox || !marketingCheckbox) {
    console.error("Cookie-Banner oder Buttons/Checkboxes nicht gefunden!");
    return;
  }

  // Cookies setzen
  function setCookie(name, value, days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  }

  // Cookies auslesen
  function getCookie(name) {
    let cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      let [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }

  // Google Tag aktualisieren
  function updateConsentStatus() {
    const analyticsConsent = getCookie("analyticsConsent") === "true";
    const marketingConsent = getCookie("marketingConsent") === "true";

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function() { dataLayer.push(arguments); };

    gtag("consent", "update", {
      analytics_storage: analyticsConsent ? "granted" : "denied",
      ad_storage: marketingConsent ? "granted" : "denied",
      functionality_storage: "granted",
      personalization_storage: marketingConsent ? "granted" : "denied",
      security_storage: "granted"
    });

    console.log("Consent aktualisiert:", {
      analytics: analyticsConsent,
      marketing: marketingConsent,
    });
  }

  // Prüfe vorhandene Zustimmung und aktualisiere den Consent-Status direkt beim Laden der Seite
  function checkExistingConsent() {
    const cookieConsent = getCookie("cookieConsent");
    const analyticsConsent = getCookie("analyticsConsent") === "true";
    const marketingConsent = getCookie("marketingConsent") === "true";

    if (cookieConsent === "true") {
      analyticsCheckbox.checked = analyticsConsent;
      marketingCheckbox.checked = marketingConsent;
      banner.style.display = "none";
    } else if (cookieConsent === "false") {
      banner.style.display = "none";
    } else {
      banner.style.display = "flex";
    }

    // Consent Status an GTM übermitteln
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: "gtm.init_consent",
      analytics_storage: analyticsConsent ? "granted" : "denied",
      ad_storage: marketingConsent ? "granted" : "denied",
      functionality_storage: "granted",
      personalization_storage: marketingConsent ? "granted" : "denied",
      security_storage: "granted"
    });

    console.log("gtm.init_consent gesendet mit Werten:", {
      analytics_storage: analyticsConsent,
      ad_storage: marketingConsent
    });

    // Banner entsprechend ausblenden oder anzeigen
    if (cookieConsent === "true" || cookieConsent === "false") {
      banner.style.display = "none";
    } else {
      banner.style.display = "flex";
    }
  }

  // Event Listener für Buttons
  acceptAllButton.addEventListener("click", function () {
    setCookie("cookieConsent", "true", 365);
    setCookie("analyticsConsent", "true", 365);
    setCookie("marketingConsent", "true", 365);
    banner.style.display = "none";
    updateConsentStatus();
  });

  acceptSelectedButton.addEventListener("click", function () {
    setCookie("cookieConsent", "true", 365);
    setCookie("analyticsConsent", analyticsCheckbox.checked ? "true" : "false", 365);
    setCookie("marketingConsent", marketingCheckbox.checked ? "true" : "false", 365);
    banner.style.display = "none";
    updateConsentStatus();
  });

  declineAllButton.addEventListener("click", function () {
    setCookie("cookieConsent", "false", 365);
    setCookie("analyticsConsent", "false", 365);
    setCookie("marketingConsent", "false", 365);
    banner.style.display = "none";
    updateConsentStatus();
  });

  // Consent-Status aktualisieren (hilfsfunktion)
  function updateConsentStatus() {
    const analyticsConsent = getCookie("analyticsConsent") === "true";
    const marketingConsent = getCookie("marketingConsent") === "true";

    gtag("consent", "update", {
      analytics_storage: analyticsConsent ? "granted" : "denied",
      ad_storage: marketingConsent ? "granted" : "denied",
      functionality_storage: "granted",
      personalization_storage: marketingConsent ? "granted" : "denied",
      security_storage: "granted"
    });

    console.log("Consent aktualisiert:", {
      analytics: analyticsConsent,
      marketing: marketingConsent
    });
  }

  checkExistingConsent();
}

// Event Listener um sicherzugehen, dass der DOM geladen ist
document.addEventListener("DOMContentLoaded", initializeCookieBanner);
