const BASE_URL = 'https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app';


// Initialisierungsfunktion
function init() {
    fetchContactsData().then(data => renderContactList(data));
}


function openOverlay() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "flex"; // Overlay sichtbar machen
    overlay.classList.add("show");  // Animation hinzufügen
}


// Funktion zum Schließen des Overlays
function closeOverlay() {
    const overlay = document.getElementById("overlay");
    overlay.classList.remove("show"); // Klasse zum Einblenden entfernen
    overlay.classList.add("hide"); // Klasse zum Ausblenden hinzufügen

    // Warte auf die Animation und blende dann das Overlay aus
    setTimeout(() => {
        overlay.style.display = "none"; // Nach der Animation ausblenden
        overlay.classList.remove("hide"); // Klasse entfernen, um für die nächste Anzeige bereit zu sein
    }, 800); // Dauer muss mit der CSS-Transition übereinstimmen
}


// Funktion zum Abrufen und Anzeigen der Kontakte
function fetchContactsData() {
    return fetch(`${BASE_URL}/contacts.json`)
        .then(response => response.json())
        .then(data => {
            renderContactList(data);
            return data;
        })
        .catch(error => {
            console.error('Fehler beim Abrufen der Kontakte:', error);
            return null;
        });
}


function renderContactList(data) {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = ''; // Liste leeren

    if (data) {
        // Kontakte sortieren und nach Anfangsbuchstaben gruppieren
        const sortedContacts = Object.values(data).sort((a, b) =>
            a.name.localeCompare(b.name, 'de', { sensitivity: 'base' })
        );

        let currentLetter = ''; // Buchstaben-Tracker

        sortedContacts.forEach(contact => {
            const firstLetter = contact.name[0].toUpperCase(); // Erster Buchstabe des Namens

            // Wenn ein neuer Buchstabe kommt, füge eine neue Überschrift und Silverline hinzu
            if (firstLetter !== currentLetter) {
                currentLetter = firstLetter;

                // Header-Buchstaben hinzufügen
                const letterHeader = document.createElement('h4');
                letterHeader.classList.add('letter-header'); // Stilklasse
                letterHeader.textContent = currentLetter;
                contactList.appendChild(letterHeader);

                // Silverline hinzufügen
                const silverline = document.createElement('div');
                silverline.classList.add('silverline');
                contactList.appendChild(silverline);
            }

            // Erstelle und füge die Kontaktkarte hinzu
            const card = createContactCard(contact);
            contactList.appendChild(card);
        });
    } else {
        contactList.innerHTML = '<div>Keine Kontakte vorhanden</div>';
    }
}


function createContactCard(contact) {
    const card = document.createElement('div');
    card.classList.add('contact-card'); // Card-Design-Klasse

    // Initialen aus Vor- und Nachnamen berechnen
    const nameParts = contact.name.split(" ");
    const initials = (nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : '')).toUpperCase();

    // Erstelle das Badge-Element für die Initialen
    const badge = document.createElement('div');
    badge.classList.add('initials-badge');
    badge.textContent = initials;

    // Farbe basierend auf der Initiale des Vornamens setzen
    badge.style.backgroundColor = getColorForInitial(nameParts[0][0].toUpperCase());

    // Füge Inhalt und Struktur der Kontaktkarte hinzu
    card.appendChild(badge);          // Badge hinzufügen
    card.innerHTML += `
    <div class="contact-content">
        <h3>${contact.name}</h3>
        <p>Email: ${contact.email}</p>
    </div>

    `;

    return card;
}


// Funktion, um Farbe basierend auf dem ersten Buchstaben des Vornamens zuzuweisen
function getColorForInitial(initial) {
    const colors = {
        A: '#FF5733', B: '#FFBD33', C: '#DBFF33', D: '#75FF33', E: '#33FF57', 
        F: '#33FFBD', G: '#33DBFF', H: '#3375FF', I: '#5733FF', J: '#BD33FF', 
        K: '#FF33DB', L: '#FF3375', M: '#FF3333', N: '#FF6633', O: '#FF9933', 
        P: '#FFCC33', Q: '#FFFF33', R: '#CCFF33', S: '#99FF33', T: '#66FF33', 
        U: '#33FF66', V: '#33FF99', W: '#33FFCC', X: '#33FFFF', Y: '#33CCFF', 
        Z: '#3399FF'
    };
    return colors[initial] || '#333333'; // Standardfarbe, falls kein Eintrag
}


function addContactToFirebase(contact) {
    fetch(`${BASE_URL}/contacts.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Kontakt erfolgreich hinzugefügt:', data);
        alert('Kontakt erfolgreich gespeichert!');
        
        // Aktualisiere die Kontaktliste, um alphabetisch zu bleiben
        fetchContactsData();
        
        // Eingabemaske ausblenden
        closeOverlay();
    })
    .catch(error => console.error('Fehler beim Speichern des Kontakts:', error));
}


// Funktion zum Hinzufügen eines Kontakts ohne Neuladen
function addContact(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const contact = { name, email, phone };
    addContactToFirebase(contact);

    document.getElementById('contactForm').reset(); // Formular zurücksetzen
}


// Eventlistener für Seiteninitialisierung
window.onload = init;