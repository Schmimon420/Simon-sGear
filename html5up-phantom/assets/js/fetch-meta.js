document.addEventListener("DOMContentLoaded", () => {
    const articles = document.querySelectorAll(".tiles article");
  
    articles.forEach((article) => {
      const url = article.getAttribute("data-url");
      const titleElement = article.querySelector(".article-title");
      const descriptionElement = article.querySelector(".article-description");
  
      if (!url) return;
  
      fetch(url)
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
  
          // Titel holen
          const pageTitle = doc.querySelector("title") ? doc.querySelector("title").innerText : "Kein Titel gefunden";
          titleElement.innerText = pageTitle;
  
          // Meta-Beschreibung holen
          const metaDescription = doc.querySelector('meta[name="description"]')
            ? doc.querySelector('meta[name="description"]').getAttribute("content")
            : "Keine Beschreibung verfügbar.";
          descriptionElement.innerText = metaDescription;
        })
        .catch((error) => {
          console.error("Fehler beim Laden der Seite:", url, error);
        });
    });
  });
  