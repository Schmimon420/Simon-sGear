document.addEventListener("DOMContentLoaded", function () {
    // DOM-Elemente abrufen
    const banner = document.getElementById("cookie-banner");
    if (!banner) {
        console.error("❌ Cookie-Banner nicht gefunden!");
        return;
    }

    const acceptAllButton = document.getElementById("accept-all");
    const acceptSelectedButton = document.getElementById("accept-selected");
    const declineAllButton = document.getElementById("decline-all");

    const analyticsCheckbox = document.getElementById("analytics-cookies");
    const marketingCheckbox = document.getElementById("marketing-cookies");

    // Funktion: Cookie setzen
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
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

    // Consent aktualisieren
    function updateConsentStatus() {
        const analyticsConsent = getCookie("analyticsConsent") === "true";
        const marketingConsent = getCookie("marketingConsent") === "true";

        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () { dataLayer.push(arguments); };

        gtag("consent", "update", {
            analytics_storage: analyticsConsent ? "granted" : "denied",
            ad_storage: marketingConsent ? "granted" : "denied",
            functionality_storage: "granted",
            personalization_storage: marketingConsent ? "granted" : "denied",
            security_storage: "granted",
        });

        console.log("✅ Consent aktualisiert:", {
            analytics_storage: analyticsConsent,
            ad_storage: marketingConsent,
        });
    }

    // Cookie-Banner-Status prüfen
    function checkExistingConsent() {
        const cookieConsent = getCookie("cookieConsent");

        if (cookieConsent === "true") {
            banner.style.display = "none";
        } else if (cookieConsent === "false") {
            banner.style.display = "none";
        } else {
            banner.style.display = "flex";
        }

        updateConsentStatus();
    }

    checkExistingConsent();

    // Event-Handler für Buttons
    acceptAllButton.addEventListener("click", () => {
        setCookie("cookieConsent", "true", 365);
        setCookie("analyticsConsent", "true", 365);
        setCookie("marketingConsent", "true", 365);
        banner.style.display = "none";
        updateConsentStatus();
    });

    acceptSelectedButton.addEventListener("click", () => {
        setCookie("cookieConsent", "true", 365);
        setCookie("analyticsConsent", analyticsCheckbox.checked ? "true" : "false", 365);
        setCookie("marketingConsent", marketingCheckbox.checked ? "true" : "false", 365);
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
});
