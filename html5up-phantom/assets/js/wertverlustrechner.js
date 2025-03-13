"use strict";

// Auswahl der Elemente
const jahreInput = document.getElementById('nutzungsdauer-jahre');
const anschaffungspreisInput = document.getElementById('anschaffungspreis');
const produktkategorieInput = document.getElementById('produktkategorie');
const wertverlustInput = document.getElementById('wertverlust-jahr');
const berechnenBtn = document.getElementById('berechnen-btn');
const ergebnisDiv = document.getElementById('ergebnis');

// Event-Listener für dynamische Anpassung des vorgeschlagenen Wertverlustes
produktkategorieInput.addEventListener('change', updateWertverlust);
anschaffungspreisInput.addEventListener('input', updateWertverlust);

/**
 * Aktualisiert das Feld "Wertverlust pro Jahr" (in %) 
 * anhand von Produktkategorie und Kaufpreis
 */
function updateWertverlust() {
  const anschaffungspreis = parseFloat(anschaffungspreisInput.value) || 0;
  let vorgeschlagenerWertverlust = 10; // Standard-Wert

  switch (produktkategorieInput.value) {
    case 'audiotechnik':
      if (anschaffungspreis < 500) {
        vorgeschlagenerWertverlust = 15;
      } else if (anschaffungspreis <= 1500) {
        vorgeschlagenerWertverlust = 10;
      } else {
        vorgeschlagenerWertverlust = 5;
      }
      break;

    case 'kamera':
      if (anschaffungspreis < 800) {
        vorgeschlagenerWertverlust = 20;
      } else if (anschaffungspreis <= 3000) {
        vorgeschlagenerWertverlust = 15;
      } else if (anschaffungspreis <= 10000) {
        vorgeschlagenerWertverlust = 10;
      } else {
        vorgeschlagenerWertverlust = 7.5;
      }
      break;

    case 'beleuchtung':
      if (anschaffungspreis < 300) {
        vorgeschlagenerWertverlust = 20;
      } else if (anschaffungspreis <= 1000) {
        vorgeschlagenerWertverlust = 15;
      } else if (anschaffungspreis <= 2000) {
        vorgeschlagenerWertverlust = 10;
      } else {
        vorgeschlagenerWertverlust = 7;
      }
      break;

    case 'stativ':
      if (anschaffungspreis < 200) {
        vorgeschlagenerWertverlust = 10;
      } else if (anschaffungspreis <= 1000) {
        vorgeschlagenerWertverlust = 7;
      } else if (anschaffungspreis <= 5000) {
        vorgeschlagenerWertverlust = 5;
      } else {
        vorgeschlagenerWertverlust = 1;
      }
      break;

    case 'sonstiges':
      if (anschaffungspreis <= 5000) {
        vorgeschlagenerWertverlust = 10;
      } else {
        vorgeschlagenerWertverlust = 7.5;
      }
      break;
  }

  wertverlustInput.value = vorgeschlagenerWertverlust;
}

/**
 * Hauptberechnung des Restwertes und des Wertverlustes.
 */
berechnenBtn.addEventListener('click', function () {
  const jahre = parseInt(jahreInput.value, 10);
  const anschaffungspreis = parseFloat(anschaffungspreisInput.value);
  const wertverlustProzentsatz = parseFloat(wertverlustInput.value);
  const wertverlustProJahr = wertverlustProzentsatz / 100;

  // Validierung der Eingaben
  if (isNaN(jahre) || jahre < 1 || isNaN(anschaffungspreis) || isNaN(wertverlustProJahr)) {
    ergebnisDiv.innerHTML = '<strong style="color:red;">Bitte füllen Sie alle Felder korrekt aus.</strong>';
    return;
  }

  // Sofortiger 10% Gebraucht-Abschlag beim ersten Jahr
  let restwert = anschaffungspreis * 0.90;
  let gesamtwertverlust = anschaffungspreis - restwert;

  // Merken des anfänglichen Wertverlust-Prozentsatzes 
  // (wichtig für eventuelle Wertsteigerung)
  const startWertverlustProJahr = wertverlustProJahr;

  // Jährliche Berechnung
  for (let i = 0; i < jahre; i++) {
    // Normale Abschreibung in den ersten 20 Jahren, 
    // oder bei Stativ in den ersten 40 Jahren
    if (i < 20 || (produktkategorieInput.value === 'stativ' && i < 40)) {
      let wertverlustInDiesemJahr = restwert * wertverlustProJahr;
      restwert -= wertverlustInDiesemJahr;
      gesamtwertverlust += wertverlustInDiesemJahr;

      // Restwert auf 10% begrenzen, wenn 90% Verlust erreicht sind
      if (gesamtwertverlust >= anschaffungspreis * 0.90) {
        restwert = anschaffungspreis * 0.10;
        gesamtwertverlust = anschaffungspreis * 0.90;
        break;
      }

    } else {
      // Wertsteigerung für hochpreisige Kameras & Audiotechnik ab Jahr 20
      if (
        (produktkategorieInput.value === 'audiotechnik' && anschaffungspreis > 3000) ||
        (produktkategorieInput.value === 'kamera' && anschaffungspreis > 10000)
      ) {
        let wertsteigerungInDiesemJahr = restwert * startWertverlustProJahr;
        restwert += wertsteigerungInDiesemJahr;
        gesamtwertverlust -= wertsteigerungInDiesemJahr;

        // Kamera & Audiotechnik können maximal 120% des ursprünglichen Kaufpreises erreichen
        if (restwert > anschaffungspreis * 1.2) {
          restwert = anschaffungspreis * 1.2;
          // Gesamtwertverlust kann hier negativ werden, 
          // da der Wert über den ursprünglichen Kaufpreis hinausgeht
          gesamtwertverlust = anschaffungspreis - restwert;
          break;
        }
      }

      // Wertsteigerung für teure Stative ab Jahr 40
      if (produktkategorieInput.value === 'stativ' && i >= 40 && anschaffungspreis > 5000) {
        let wertsteigerungInDiesemJahr = restwert * startWertverlustProJahr;
        restwert += wertsteigerungInDiesemJahr;
        gesamtwertverlust -= wertsteigerungInDiesemJahr;

        // Stative können maximal wieder auf den Kaufpreis steigen, nicht darüber
        if (restwert > anschaffungspreis) {
          restwert = anschaffungspreis;
          gesamtwertverlust = anschaffungspreis - restwert;
          break;
        }
      }
    }
  }

  // Prozentualer Verlust gemessen am ursprünglichen Kaufpreis
  const prozentualerVerlust = (gesamtwertverlust / anschaffungspreis) * 100;

  // Ausgabe zusammenstellen (auf zwei Nachkommastellen gerundet)
  const ergebnisHtml = `
    <strong>Restwert nach ${jahre} Jahren:</strong> ${restwert.toFixed(2)} €<br>
    <strong>Gesamtwertverlust:</strong> ${gesamtwertverlust.toFixed(2)} €<br>
    <strong>Wertverlust in Prozent zum Kaufpreis:</strong> ${prozentualerVerlust.toFixed(2)}%
  `;

  ergebnisDiv.innerHTML = ergebnisHtml;
});
