document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
  
    let isDown = false;
    let startX;
    let scrollLeft;
  
    carousel.addEventListener("mousedown", (e) => {
      isDown = true;
      carousel.classList.add("active");
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });
  
    carousel.addEventListener("mouseleave", () => {
      isDown = false;
      carousel.classList.remove("active");
    });
  
    carousel.addEventListener("mouseup", () => {
      isDown = false;
      carousel.classList.remove("active");
    });
  
    carousel.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2; // Geschwindigkeit des Scrollens
      carousel.scrollLeft = scrollLeft - walk;
    });
  
    // Für Mobile Touch-Support
    carousel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      scrollLeft = carousel.scrollLeft;
    });
  
    carousel.addEventListener("touchmove", (e) => {
      const x = e.touches[0].clientX - startX;
      carousel.scrollLeft = scrollLeft - x * 2;
    });
  });
  