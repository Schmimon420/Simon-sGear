document.addEventListener("DOMContentLoaded", function () {
    var swiper = new Swiper(".swiper", {
        loop: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        on: {
            slideChangeTransitionStart: function () {
                animateTextAndImageOut();
            },
            slideChangeTransitionEnd: function () {
                updateText();
                animateTextAndImageIn();
            },
        },
    });

    function updateText() {
        var activeSlide = document.querySelector(".swiper-slide-active");
        var newTitle = activeSlide.getAttribute("data-text-title") || "Kein Titel";
        var newContent = activeSlide.getAttribute("data-text-content") || "Keine Beschreibung verfügbar";
        var newImage = activeSlide.getAttribute("data-text-image");

        var swiperTitle = document.getElementById("swiper-title");
        var swiperContent = document.getElementById("swiper-content");
        var swiperImageContainer = document.querySelector(".swiper-text-container");
        var existingImage = document.getElementById("swiper-image");

        // Titel & Beschreibung setzen
        swiperTitle.textContent = newTitle;
        swiperContent.textContent = newContent;

        // Falls ein Bild vorhanden ist, es anzeigen oder entfernen
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
                existingImage.style.display = "block"; // Bild wieder sichtbar machen
            }
        } else {
            if (existingImage) {
                existingImage.remove(); // Bild wirklich aus dem DOM entfernen
            }
        }
    }

    function animateTextAndImageOut() {
        var textContainer = document.querySelector(".swiper-text-container");
        textContainer.style.opacity = "0";
        textContainer.style.transform = "translateY(10px)";
    }

    function animateTextAndImageIn() {
        var textContainer = document.querySelector(".swiper-text-container");
        setTimeout(function () {
            textContainer.style.opacity = "1";
            textContainer.style.transform = "translateY(0)";
        }, 300);
    }

    // Initial das erste Slide setzen
    updateText();
});
