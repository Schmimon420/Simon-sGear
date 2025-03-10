function initializeCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  const acceptAllButton = document.getElementById("accept-all");
  const acceptSelectedButton = document.getElementById("accept-selected");
  const declineAllButton = document.getElementById("decline-all");
  const analyticsCheckbox = document.getElementById("analytics-cookies");
  const marketingCheckbox = document.getElementById("marketing-cookies");

  if (!banner || !acceptAllButton || !acceptSelectedButton || !declineAllButton || !analyticsCheckbox || !marketingCheckbox) {
    console.error("Elemente fehlen im Cookie-Banner!");
    return;
  }

  // Cookie setzen
  function setCookie(name, value, days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  }

  // Cookie auslesen
  function getCookie(name) {
    let cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      let [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) return cookieValue;
    }
    return null;
  }

  // Consent aktualisieren und an GTM senden
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

    console.log("Consent aktualisiert:", { analyticsConsent, marketingConsent });
  }

  // Bestehenden Consent prüfen und Banner anzeigen/verbergen
  function checkExistingConsent() {
    const consentGiven = getCookie("cookieConsent");
    if (consentGiven === "true") {
      analyticsCheckbox.checked = getCookie("analyticsConsent") === "true";
      marketingCheckbox.checked = getCookie("marketingConsent") === "true";
      banner.style.display = "none";
    } else if (consentGiven === "false") {
      banner.style.display = "none";
    } else {
      banner.style.display = "flex";
    }

    updateConsentStatus(); // Initialer Consent an GTM
  }

  // Button-Eventlistener:
  acceptAllButton.addEventListener("click", () => {
    setCookie("cookieConsent", "true", 365);
    setCookie("analyticsConsent", "true", 365);
    setCookie("marketingConsent", "true", 365);
    banner.style.display = "none";
    updateConsentStatus();
  });

  acceptSelectedButton.addEventListener("click", () => {
    setCookie("cookieConsent", "true", 365);
    setCookie("analyticsConsent", analyticsCheckbox.checked, 365);
    setCookie("marketingConsent", marketingCheckbox.checked, 365);
    banner.style.display = "none";
    updateConsentStatus();
  });

  declineAllButton.addEventListener("click", () => {
    setCookie("cookieConsent", "false", 365);
    setCookie("analyticsConsent", "false", 365);
    setCookie("marketingConsent", "false", 365);
    banner.style.display = "none";
    updateConsentStatus();
  });

  // Consent-Status auch beim Laden der Seite setzen
  updateConsentStatus();
}

// Prüfe den Consent-Status nach dem Laden der Seite
document.addEventListener("DOMContentLoaded", initializeCookieBanner);
