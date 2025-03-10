document.addEventListener("DOMContentLoaded", function () {
    console.log("Cookie-Banner wird initialisiert...");

    // Warten, bis das Banner geladen wurde
    function waitForBanner(callback) {
        let check = setInterval(() => {
            let banner = document.getElementById("cookie-banner");
            if (banner) {
                clearInterval(check);
                callback();
            }
        }, 100);
    }

    // Funktion zum Setzen eines Cookies
    function setCookie(name, value, days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax;`;
    }

    // Funktion zum Abrufen eines Cookies
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

    // Consent an Google Tag Manager weitergeben
    function updateConsentStatus() {
        let analyticsConsent = getCookie("analyticsConsent") === "true";
        let marketingConsent = getCookie("marketingConsent") === "true";

        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () { dataLayer.push(arguments); };

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

    // Banner einblenden oder ausblenden
    function checkExistingConsent() {
        let cookieConsent = getCookie("cookieConsent");

        if (cookieConsent === "true") {
            document.getElementById("cookie-banner").style.display = "none";
        } else {
            document.getElementById("cookie-banner").style.display = "flex";
        }
    }

    // Banner-Funktionalität laden
    waitForBanner(function () {
        let banner = document.getElementById("cookie-banner");
        let acceptAll = document.getElementById("accept-all");
        let acceptSelected = document.getElementById("accept-selected");
        let declineAll = document.getElementById("decline-all");

        let analyticsCheckbox = document.getElementById("analytics-cookies");
        let marketingCheckbox = document.getElementById("marketing-cookies");

        if (!banner || !acceptAll || !acceptSelected || !declineAll) {
            console.error("Ein oder mehrere DOM-Elemente fehlen!");
            return;
        }

        // Klick-Events
        acceptAll.addEventListener("click", function () {
            setCookie("cookieConsent", "true", 365);
            setCookie("analyticsConsent", "true", 365);
            setCookie("marketingConsent", "true", 365);
            banner.style.display = "none";
            updateConsentStatus();
        });

        acceptSelected.addEventListener("click", function () {
            setCookie("cookieConsent", "true", 365);
            setCookie("analyticsConsent", analyticsCheckbox.checked ? "true" : "false", 365);
            setCookie("marketingConsent", marketingCheckbox.checked ? "true" : "false", 365);
            banner.style.display = "none";
            updateConsentStatus();
        });

        declineAll.addEventListener("click", function () {
            setCookie("cookieConsent", "false", 365);
            setCookie("analyticsConsent", "false", 365);
            setCookie("marketingConsent", "false", 365);
            banner.style.display = "none";
            updateConsentStatus();
        });

        checkExistingConsent();
    });
});
