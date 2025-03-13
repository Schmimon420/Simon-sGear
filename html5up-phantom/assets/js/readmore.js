document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("toggle-button");
    const textContainer = document.getElementById("hidden-content");
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    // Funktion zum Smooth-Scrolling
    function smoothScrollTo(element) {
        const elementTop = element.getBoundingClientRect().top + window.scrollY;
        const offsetForCenter = elementTop - (window.innerHeight / 6) + (element.offsetHeight / 6);
        
        window.scrollTo({
            top: offsetForCenter,
            behavior: "smooth"
        });
    }

    // "Mehr Lesen"-Button
    button.addEventListener("click", function () {
        if (textContainer.classList.contains("expanded")) {
            textContainer.classList.remove("expanded");
            button.textContent = "Mehr lesen";
        } else {
            textContainer.classList.add("expanded");
            button.textContent = "Weniger lesen";
        }
    });

    // Inhaltsverzeichnis-Links mit Auto-Ausklappen
    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const targetID = link.getAttribute("href").substring(1); // Entfernt das "#"
            const targetElement = document.getElementById(targetID);
            if (!targetElement) return; // Falls kein Ziel existiert, nichts tun

            // Prüfen, ob das Ziel im versteckten Bereich liegt
            if (textContainer.contains(targetElement) && !textContainer.classList.contains("expanded")) {
                textContainer.classList.add("expanded"); // Erst ausklappen
                
                // Warte kurz, damit der Inhalt sichtbar wird, dann scrollen
                setTimeout(() => {
                    smoothScrollTo(targetElement);
                }, 500);
            } else {
                smoothScrollTo(targetElement);
            }
        });
    });
});
