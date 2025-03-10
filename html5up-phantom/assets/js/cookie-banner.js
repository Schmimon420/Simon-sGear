// Initialisiere das Cookie-Banner
function initializeCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) {
    console.error("Cookie-Banner nicht gefunden! Wurde es geladen?");
    return;
  }

  const acceptAllButton = document.getElementById("accept-all");
  const acceptSelectedButton = document.getElementById("accept-selected");
  const declineAllButton = document.getElementById("decline-all");

  const analyticsCheckbox = document.getElementById("analytics-cookies");
  const marketingCheckbox = document.getElementById("marketing-cookies");

  if (!acceptAllButton || !acceptSelectedButton || !declineAllButton) {
    console.error("Ein oder mehrere Buttons fehlen!");
    return;
  }

  console.log("Cookie-Banner erfolgreich geladen!");

  // Cookies setzen
  function setCookie(name, value, days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax;Secure`;
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

  // Sicherstellen, dass gtag verfügbar ist
  window.gtag = window.gtag || function() { dataLayer.push(arguments); };

  // Consent-Status aktualisieren (Google Consent Mode)
  function updateConsentStatus() {
    const analyticsConsent = getCookie("analyticsConsent") === "true";
    const marketingConsent = getCookie("marketingConsent") === "true";

    gtag("consent", "update", {
      analytics_storage: analyticsConsent ? "granted" : "denied",
      ad_storage: marketingConsent ? "granted" : "denied",
      functionality_storage: "granted",
      personalization_storage: marketingConsent ? "granted" : "denied",
      ad_personalization: marketingConsent ? "granted" : "denied",
      security_storage: "granted",
    });

    console.log("Consent aktualisiert:", {
      analytics: analyticsConsent,
      marketing: marketingConsent,
    });

    // Event für den Google Tag Manager senden
    gtag('event', 'consent_update');
  }

  // Überprüfen, ob der Benutzer bereits zugestimmt oder abgelehnt hat
  function checkExistingConsent() {
    const cookieConsent = getCookie("cookieConsent");
    let analyticsConsent = getCookie("analyticsConsent");
    let marketingConsent = getCookie("marketingConsent");

    if (cookieConsent === "true") {
      analyticsCheckbox.checked = analyticsConsent === "true";
      marketingCheckbox.checked = marketingConsent === "true";
      banner.style.display = "none";
    } else if (cookieConsent === "false") {
      analyticsConsent = "false";
      marketingConsent = "false";
      banner.style.display = "none";
    } else {
      analyticsConsent = "false";
      marketingConsent = "false";
      banner.style.display = "flex";
    }

    // Initialisiere GTM mit dem aktuellen Consent-Status
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "gtm.init_consent",
      analytics_storage: analyticsConsent === "true" ? "granted" : "denied",
      ad_storage: marketingConsent === "true" ? "granted" : "denied",
      functionality_storage: "granted",
      personalization_storage: marketingConsent === "true" ? "granted" : "denied",
      ad_personalization: marketingConsent === "true" ? "granted" : "denied",
      security_storage: "granted"
    });

    console.log("gtm.init_consent gesendet", {
      analytics_storage: analyticsConsent,
      ad_storage: marketingConsent,
      personalization_storage: marketingConsent,
      ad_personalization: marketingConsent
    });

    updateConsentStatus();
  }

  checkExistingConsent();

  // Klick auf "Alle akzeptieren"
  acceptAllButton.addEventListener("click", function () {
    setCookie("cookieConsent", "true", 365);
    setCookie("analyticsConsent", "true", 365);
    setCookie("marketingConsent", "true", 365);
    banner.style.display = "none";
    updateConsentStatus();
  });

  // Klick auf "Auswahl speichern"
  acceptSelectedButton.addEventListener("click", function () {
    setCookie("cookieConsent", "true", 365);
    setCookie("analyticsConsent", analyticsCheckbox.checked ? "true" : "false", 365);
    setCookie("marketingConsent", marketingCheckbox.checked ? "true" : "false", 365);
    banner.style.display = "none";
    updateConsentStatus();
  });

  // Klick auf "Alle ablehnen"
  declineAllButton.addEventListener("click", function () {
    setCookie("cookieConsent", "false", 365);
    setCookie("analyticsConsent", "false", 365);
    setCookie("marketingConsent", "false", 365);
    banner.style.display = "none";
    updateConsentStatus();
  });
}

// Warte auf das Laden des Cookie-Banners und initialisiere es
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("cookie-banner")) {
    initializeCookieBanner();
  } else {
    console.log("Warte auf das Laden des Cookie-Banners...");
    setTimeout(initializeCookieBanner, 500);
  }
});
