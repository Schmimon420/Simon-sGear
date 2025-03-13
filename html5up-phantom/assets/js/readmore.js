document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("toggle-button");
    const textContainer = document.getElementById("hidden-content");

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
});
