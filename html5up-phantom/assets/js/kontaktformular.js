document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Verhindert das Neuladen der Seite

        // Formulardaten erfassen
        let formData = new FormData(form);

        fetch("assets/php/send.php", {  // Stelle sicher, dass der Pfad stimmt!
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Deine Nachricht wurde erfolgreich gesendet!");
                form.reset(); // Formular leeren
            } else {
                alert("Fehler beim Senden der Nachricht: " + data.message);
            }
        })
        .catch(error => {
            alert("Fehler beim Senden der Nachricht. Bitte versuche es später erneut.");
            console.error("Fehler:", error);
        });
    });
});
