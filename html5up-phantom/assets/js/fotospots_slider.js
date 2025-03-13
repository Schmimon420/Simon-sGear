document.addEventListener("DOMContentLoaded", function () {
    var swiper = new Swiper(".swiper", {
        loop: true, // Endloser Loop-Modus
        centeredSlides: true, // Das aktive Slide bleibt mittig
        slidesPerView: 1.2, // Standard-Anzeigegröße
        loopedSlides: 4, // Verhindert Fehler mit Loop
        spaceBetween: 10, // Abstand zwischen Slides
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            768: { slidesPerView: 1.5 }, // Etwas breiter auf Tablets
            1024: { slidesPerView: 2 } // Zeigt 2 Slides nebeneinander auf größeren Bildschirmen
        },
        on: {
            slideChange: function () {
                updateText(this.slides[this.activeIndex]); // Jetzt wird immer das korrekte Slide genutzt
            }
        },
    });

    function updateText(activeSlide) {
        if (!activeSlide) return; // Falls kein aktives Slide gefunden, abbrechen

        var newTitle = activeSlide.getAttribute("data-text-title") || "Kein Titel verfügbar";
        var newContent = activeSlide.getAttribute("data-text-content") || "Keine Beschreibung verfügbar";
        var newImage = activeSlide.getAttribute("data-text-image");

        var swiperTitle = document.getElementById("swiper-title");
        var swiperContent = document.getElementById("swiper-content");
        var swiperImageContainer = document.querySelector(".swiper-text-container");
        var existingImage = document.getElementById("swiper-image");

        // ✅ Titel & Beschreibung setzen
        swiperTitle.textContent = newTitle;
        swiperContent.textContent = newContent;

        // ✅ Bild aktualisieren oder entfernen
        if (newImage && newImage.trim() !== "") {
            if (!existingImage) {
                var newImg = document.createElement("img");
                newImg.id = "swiper-image";
                newImg.src = newImage;
                newImg.alt = newTitle;
                swiperImageContainer.appendChild(newImg);
            } else {
                existingImage.src = newImage;
                existingImage.alt = newTitle;
                existingImage.style.display = "block";
            }
        } else if (existingImage) {
            existingImage.remove();
        }
    }

    // ✅ Initial das erste Slide setzen
    updateText(swiper.slides[swiper.activeIndex]);
});
