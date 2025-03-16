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
        if (!activeSlide) return;
    
        var newTitle = activeSlide.getAttribute("data-text-title") || "Kein Titel verfügbar";
        var newContent = activeSlide.getAttribute("data-text-content") || "Keine Beschreibung verfügbar";
        var newImage = activeSlide.getAttribute("data-text-image");
    
        var swiperTitle = document.getElementById("swiper-title");
        var swiperContent = document.getElementById("swiper-content");
        var existingImage = activeSlide.querySelector(".slide-image");
    
        // ✅ Titel & Beschreibung setzen
        swiperTitle.textContent = newTitle;
        swiperContent.textContent = newContent;
    
        // ✅ Bild aktualisieren oder entfernen
        if (newImage && newImage.trim() !== "") {
            if (!existingImage) {
                var newImg = document.createElement("img");
                newImg.classList.add("slide-image");
                newImg.src = newImage;
                newImg.alt = newTitle;
                newImg.style.position = "absolute";
                newImg.style.top = "5%";
                newImg.style.right = "5%";
                newImg.style.width = "240px"; // Standardgröße für Desktop
                newImg.style.height = "auto";
                newImg.style.borderRadius = "8px";
                newImg.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.2)";
                newImg.style.zIndex = "10";
                newImg.style.transition = "width 0.3s ease, top 0.3s ease, right 0.3s ease"; // Sanfte Anpassung
                
                // Responsive Anpassung
                if (window.innerWidth < 767) {
                    newImg.style.width = "120px"; // Größere mobile Ansicht
                    newImg.style.top = "2%";
                    newImg.style.right = "2%";
                }
                
                activeSlide.appendChild(newImg);
            } else {
                existingImage.src = newImage;
                existingImage.alt = newTitle;
                existingImage.style.display = "block";
                existingImage.style.width = window.innerWidth < 767 ? "120px" : "240px"; // Dynamische Größenanpassung
                existingImage.style.top = window.innerWidth < 767 ? "2%" : "5%";
                existingImage.style.right = window.innerWidth < 767 ? "2%" : "5%";
            }
        } else if (existingImage) {
            existingImage.style.display = "none";
        }
    }
    
    // ✅ Initial das erste Slide setzen
    updateText(swiper.slides[swiper.activeIndex]);
});