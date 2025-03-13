// Auswahl der Elemente
const nutzungFeld = document.getElementById('nutzung');
const einnahmenFeld = document.getElementById('einnahmen-feld');
const tageInput = document.getElementById('tage');
const einnahmenInput = document.getElementById('einnahmen-tag');
const berechnenBtn = document.getElementById('berechnen-btn');
const ergebnisDiv = document.getElementById('ergebnis');

// Mietpreise aus HTML holen
const mietpreisElement = document.querySelector('.hinweis');

const ersterTagPreis = parseFloat(mietpreisElement.dataset.ersterTag) || 20;
const extraTagPreis = parseFloat(mietpreisElement.dataset.extraTag) || 18;
const wochenPreis = parseFloat(mietpreisElement.dataset.wochenPreis) || 90;
const kaufPreisGebraucht = parseFloat(mietpreisElement.dataset.kaufPreis) || 700;

// Einnahmenfeld anzeigen
nutzungFeld.addEventListener('change', function() {
    einnahmenFeld.style.display = this.value === 'gewerblich' ? 'block' : 'none';
});

// Mietkosten-Berechnung
function mietkostenBerechnen(tage) {
    let mietkosten = 0;
    const wochen = Math.floor(tage / 7);
    const restTage = tage % 7;

    mietkosten += wochen * wochenPreis;

    if (restTage === 1) {
        mietkosten += ersterTagPreis;
    } else if (restTage > 1) {
        mietkosten += ersterTagPreis + (restTage - 1) * extraTagPreis;
    }

    return mietkosten;
}

// Hauptfunktion zur Berechnung
berechnenBtn.addEventListener('click', function() {
    const tage = parseInt(tageInput.value);
    const nutzung = nutzungFeld.value;
    const einnahmenProTag = nutzung === 'gewerblich' ? parseFloat(einnahmenInput.value) : 0;

    const mietkosten = mietkostenBerechnen(tage);
    const amortisation = einnahmenProTag ? Math.ceil(kaufPreisGebraucht / einnahmenProTag) : null;
    const breakevenTage = Math.ceil(kaufPreisGebraucht / extraTagPreis);

    let ergebnisHtml = `
        <strong>Mietkosten insgesamt:</strong> ${mietkosten.toFixed(2)} €<br>
        <strong>Kaufpreis (gebraucht):</strong> ${kaufPreisGebraucht} €<br>
        <strong>Ab ${breakevenTage} Miet-Tagen wäre Kaufen günstiger.</strong><br>
    `;

    if (nutzung === 'gewerblich') {
        ergebnisHtml += `<strong>Amortisation (durch Einnahmen):</strong> nach ca. ${amortisation} Nutzungstagen<br>`;
    }

    if (mietkosten < kaufPreisGebraucht) {
        ergebnisHtml += `
            <strong style="color:green;">Mieten ist aktuell günstiger!</strong><br>
            <a href="https://www.gearbooker.com/de/profile/ee8ba9e7-411e-4537-8c44-8e70e89cafdd">
               Miete jetzt dein Equipment!
            </a>
        `;
    } else {
        ergebnisHtml += `
            <strong style="color:blue;">Kaufen könnte langfristig sinnvoll sein. Beachte aber Nebenkosten und Flexibilität der Miete.</strong>
        `;
    }

    ergebnisDiv.innerHTML = ergebnisHtml;
});
