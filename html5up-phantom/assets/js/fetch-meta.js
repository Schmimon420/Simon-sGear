document.addEventListener("DOMContentLoaded", () => {
  // Alle Tiles und Swiper-Slides abrufen
  const articles = document.querySelectorAll(".tiles article, .swiper-slide article");

  articles.forEach((article) => {
      const url = article.getAttribute("data-url");

      if (!url) return; // Falls keine URL, überspringen

      fetch(url)
          .then((response) => {
              if (!response.ok) throw new Error(`HTTP-Fehler! Status: ${response.status}`);
              return response.text();
          })
          .then((html) => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, "text/html");

              // Titel holen
              const pageTitle = doc.querySelector("title")
                  ? doc.querySelector("title").innerText
                  : "Kein Titel gefunden";

              // Meta-Beschreibung holen
              const metaDescription = doc.querySelector('meta[name="description"]')
                  ? doc.querySelector('meta[name="description"]').getAttribute("content")
                  : "Keine Beschreibung verfügbar.";

              // Titel & Beschreibung für alle Artikel mit der gleichen URL setzen
              document.querySelectorAll(`[data-url="${url}"]`).forEach((el) => {
                  const titleElement = el.querySelector(".article-title");
                  const descriptionElement = el.querySelector(".article-description");

                  if (titleElement) titleElement.innerText = pageTitle;
                  if (descriptionElement) descriptionElement.innerText = metaDescription;
              });
          })
          .catch((error) => {
              console.error(`Fehler beim Laden der Seite ${url}:`, error);
          });
  });
});
