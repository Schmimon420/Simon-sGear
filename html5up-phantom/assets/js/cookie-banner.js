<script>
// --- Cookie-Banner Initialisierung ---
function initializeCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) {
    console.error("Cookie-Banner nicht gefunden!");
    return;
  }

  // Buttons
  const acceptAllButton      = document.getElementById("accept-all");
  const acceptSelectedButton = document.getElementById("accept-selected");
  const declineAllButton     = document.getElementById("decline-all");

  // Checkboxen
  const analyticsCheckbox  = document.getElementById("analytics-cookies");
  const marketingCheckbox  = document.getElementById("marketing-cookies");

  // Safety-Check, ob alle Elemente existieren
  if (!acceptAllButton || !acceptSelectedButton || !declineAllButton ||
      !analyticsCheckbox || !marketingCheckbox) {
    console.error("Ein oder mehrere benötigte DOM-Elemente fehlen!");
    return;
  }

  // Funktion: Cookie setzen
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    // SameSite=Lax sorgt dafür, dass Cookies in den meisten Fällen akzeptiert werden
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax;`;
  }

  // Funktion: Cookie lesen
  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const c of cookies) {
      const [cookieName, cookieValue] = c.split("=");
      if (cookieName === name) return cookieValue;
    }
    return null;
  }

  // Funktion: Consent an Google Tag / Tag Manager übermitteln
  function updateConsentStatus() {
    const analyticsConsent  = (getCookie("analyticsConsent")  === "true");
    const marketingConsent  = (getCookie("marketingConsent")  === "true");

    // gtag & dataLayer sicherstellen
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function() { dataLayer.push(arguments); };

    // Google Consent Mode Update
    gtag("consent", "update", {
      analytics_storage:   analyticsConsent ? "granted" : "denied",
      ad_storage:          marketingConsent ? "granted" : "denied",
      functionality_storage: "granted",
      personalization_storage: marketingConsent ? "granted" : "denied",
      security_storage:    "granted"
    });

    console.log("Consent aktualisiert ->", {
      analytics_storage: analyticsConsent,
      ad_storage: marketingConsent
    });
  }

  // Funktion: Beim Seitenaufruf prüfen, was in den Cookies steht
  function checkExistingConsent() {
    const cookieConsent = getCookie("cookieConsent");
    const analyticsConsent = getCookie("analyticsConsent") === "true";
    const marketingConsent = getCookie("marketingConsent") === "true";

    // 1. Banner ein- oder ausblenden
    if (cookieConsent === "true") {
      // User hat zugestimmt
      analyticsCheckbox.checked = analyticsConsent;
      marketingCheckbox.checked = marketingConsent;
      banner.style.display = "none";
    } else if (cookieConsent === "false") {
      // User hat abgelehnt
      banner.style.display = "none";
    } else {
      // User hat noch nicht entschieden
      banner.style.display = "flex";
    }

    // 2. dataLayer & Tag Manager informieren (gtm.init_consent)
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: "gtm.init_consent",
      analytics_storage: analyticsConsent ? "granted" : "denied",
      ad_storage: marketingConsent ? "granted" : "denied",
      functionality_storage: "granted",
      personalization_storage: marketingConsent ? "granted" : "denied",
      security_storage: "granted"
    });

    console.log("gtm.init_consent gesendet ->", {
      analytics_storage: analyticsConsent,
      ad_storage: marketingConsent
    });

    // 3. Danach "updateConsentStatus" aufrufen, um den Status (z.B. gtag) zu aktualisieren
    updateConsentStatus();
  }

  // Aufrufen, sobald das Skript durchgelaufen ist
  checkExistingConsent();

  // **Click-Handler** für Buttons:

  // [1] Alle akzeptieren
  acceptAllButton.addEventListener("click", () => {
    setCookie("cookieConsent",      "true",  365);
    setCookie("analyticsConsent",   "true",  365);
    setCookie("marketingConsent",   "true",  365);
    banner.style.display = "none";
    updateConsentStatus();
  });

  // [2] Auswahl speichern
  acceptSelectedButton.addEventListener("click", () => {
    setCookie("cookieConsent",      "true", 365);
    setCookie("analyticsConsent",   analyticsCheckbox.checked ? "true" : "false", 365);
    setCookie("marketingConsent",   marketingCheckbox.checked ? "true" : "false", 365);
    banner.style.display = "none";
    updateConsentStatus();
  });

  // [3] Alle ablehnen
  declineAllButton.addEventListener("click", () => {
    setCookie("cookieConsent",      "false", 365);
    setCookie("analyticsConsent",   "false", 365);
    setCookie("marketingConsent",   "false", 365);
    banner.style.display = "none";
    updateConsentStatus();
  });
}

// DOMContentLoaded -> Cookie Banner initialisieren
document.addEventListener("DOMContentLoaded", initializeCookieBanner);
</script>
