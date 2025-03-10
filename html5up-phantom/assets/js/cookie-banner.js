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

  // Consent-Status aktualisieren (Google Consent Mode)
  function updateConsentStatus() {
    const analyticsConsent = getCookie("analyticsConsent") === "true";
    const marketingConsent = getCookie("marketingConsent") === "true";

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }

    gtag("consent", "update", {
      analytics_storage: analyticsConsent ? "granted" : "denied",
      ad_storage: marketingConsent ? "granted" : "denied",
      functionality_storage: "granted",
      personalization_storage: marketingConsent ? "granted" : "denied",
      security_storage: "granted",
    });

    console.log("Consent aktualisiert:", {
      analytics: analyticsConsent,
      marketing: marketingConsent,
    });
  }

  // Überprüfen, ob der Benutzer bereits zugestimmt oder abgelehnt hat
  function checkExistingConsent() {
    const cookieConsent = getCookie("cookieConsent");
    if (cookieConsent === "true") {
      analyticsCheckbox.checked = getCookie("analyticsConsent") === "true";
      marketingCheckbox.checked = getCookie("marketingConsent") === "true";
      banner.style.display = "none"; // Banner ausblenden
    } else if (cookieConsent === "false") {
      banner.style.display = "none"; // Banner ausblenden, wenn abgelehnt
    } else {
      banner.style.display = "flex"; // Banner anzeigen, wenn noch keine Entscheidung getroffen wurde
    }
  }

  // Aufrufen der Funktion zur Prüfung der vorhandenen Zustimmung
  checkExistingConsent();

  // Klick auf "Alle akzeptieren"
  acceptAllButton.addEventListener("click", function () {
    setCookie("cookieConsent", "true", 365);
    setCookie("analyticsConsent", "true", 365);
    setCookie("marketingConsent", "true", 365);
    banner.style.display = "none"; // Banner ausblenden
    updateConsentStatus();
  });

  // Klick auf "Auswahl speichern"
  acceptSelectedButton.addEventListener("click", function () {
    setCookie("cookieConsent", "true", 365);
    setCookie("analyticsConsent", analyticsCheckbox.checked ? "true" : "false", 365);
    setCookie("marketingConsent", marketingCheckbox.checked ? "true" : "false", 365);
    banner.style.display = "none"; // Banner ausblenden
    updateConsentStatus();
  });

  // Klick auf "Alle ablehnen"
  declineAllButton.addEventListener("click", function () {
    setCookie("cookieConsent", "false", 365);
    setCookie("analyticsConsent", "false", 365);
    setCookie("marketingConsent", "false", 365);
    banner.style.display = "none"; // Banner ausblenden
    updateConsentStatus();
  });
}

// Warte auf das Laden des Cookie-Banners und initialisiere es
document.addEventListener("DOMContentLoaded", function () {
  // Prüfen, ob das Cookie-Banner bereits existiert, bevor die Funktion ausgeführt wird
  if (document.getElementById("cookie-banner")) {
    initializeCookieBanner();
  } else {
    console.log("Warte auf das Laden des Cookie-Banners...");
    setTimeout(initializeCookieBanner, 500); // Warte 500ms und versuche es erneut
  }
});
