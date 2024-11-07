const BASE_URL = 'https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app';
const AUDIO_CLICK = new Audio('assets/sound/click.mp3');


// Initialisierungsfunktion
function init() {
    fetchContactsData();
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
async function fetchContactsData() {
    try {
        const response = await fetch(`${BASE_URL}/contacts.json`);
        const data = await response.json();
        renderContactList(data);
        return data;
    } catch (error) {
        console.error('Fehler beim Abrufen der Kontakte:', error);
        return null;
    }
}


function renderContactList(data) {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = ''; // Liste leeren

    if (data) {
        const sortedContacts = sortContacts(data);
        renderSortedContacts(contactList, sortedContacts);
    } else {
        displayNoContactsMessage(contactList);
    }
}


// Funktion zum Sortieren der Kontakte nach Namen
function sortContacts(data) {
    return Object.values(data).sort((a, b) =>
        a.name.localeCompare(b.name, 'de', { sensitivity: 'base' })
    );
}


// Funktion zum Rendern der sortierten Kontakte und Gruppierung nach Anfangsbuchstaben
function renderSortedContacts(contactList, sortedContacts) {
    let currentLetter = '';

    sortedContacts.forEach(contact => {
        const firstLetter = contact.name[0].toUpperCase();
        
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            addLetterHeader(contactList, currentLetter);
            addSilverline(contactList);
        }

        const card = createContactCard(contact);
        contactList.appendChild(card);
    });
}


// Funktion zum Hinzufügen eines Buchstaben-Headers
function addLetterHeader(contactList, letter) {
    const letterHeader = document.createElement('h4');
    letterHeader.classList.add('letter-header');
    letterHeader.textContent = letter;
    contactList.appendChild(letterHeader);
}


// Funktion zum Hinzufügen einer Silverline
function addSilverline(contactList) {
    const silverline = document.createElement('div');
    silverline.classList.add('silverline');
    contactList.appendChild(silverline);
}


// Funktion zum Anzeigen der Nachricht, wenn keine Kontakte vorhanden sind
function displayNoContactsMessage(contactList) {
    contactList.innerHTML = '<div>Keine Kontakte vorhanden</div>';
}


function createContactCardHTML(contact) {
    return `
    <div class="contact-details">
        <h3>${contact.name}</h3>
        <p>Email: ${contact.email}</p>
    </div>
    `;
}

function createContactCard(contact) {
    const card = document.createElement('div');
    card.classList.add('contact-card'); // Card-Design-Klasse
    card.onclick = function() {
        AUDIO_CLICK.play();
        setActiveContact(card); // Übergebe die gesamte Karte
        openContactOverlay(contact.id, contact.name, contact.email, contact.phone);
    };

    // Initialen aus Vor- und Nachnamen berechnen
    const initials = getInitials(contact.name);

    // Erstelle das Badge-Element für die Initialen
    const badge = document.createElement('div');
    badge.classList.add('initials-badge');
    badge.textContent = initials;

    // Farbe basierend auf der Initiale des Vornamens setzen
    badge.style.backgroundColor = getColorForInitial(initials[0]);

    // Füge das Badge-Element zur Karte hinzu
    card.appendChild(badge);
    
    // Struktur der Karte aus HTML-Template erhalten und hinzufügen
    card.innerHTML += createContactCardHTML(contact);

    return card;
}




function setActiveContact(element) {
    // Entferne die 'active'-Klasse von allen Kontaktkarten
    const contactCards = document.querySelectorAll('div'); // Hier können wir alle div-Elemente abfragen
    contactCards.forEach(card => {
        card.classList.remove('active');
    });

    // Füge die 'active'-Klasse zum aktuell geklickten Element hinzu
    element.classList.add('active');
}


function createInitialsBadge(contactName) {
    // Berechnen Sie die Initialen und die Badge-Farbe
    const initials = getInitials(contactName); // Funktion, um die Initialen zu berechnen
    const badgeColor = getColorForInitial(initials[0]); // Farbe basierend auf der Initiale

    // Badge-Element erstellen
    const badge = document.createElement('div');
    badge.classList.add('initials-badge');
    badge.textContent = initials;
    badge.style.backgroundColor = badgeColor; // Badge-Farbe setzen

    return badge; // Rückgabe des Badge-Elements
}


// Funktion zur Erstellung des Badge-Elements mit einer anpassbaren Klasse
function createInitialsBadge(name, className = 'default-badge') {
    const initials = getInitials(name);
    const badge = document.createElement('div');
    badge.classList.add(className); // Verwende den übergebenen Klassennamen
    badge.textContent = initials;
    badge.style.backgroundColor = getColorForInitial(initials[0]);
    return badge;
}

function openContactOverlay(contactId, contactName, contactEmail, contactPhone) {
    // Wähle hier die gewünschte Badge-Klasse
    const badge = createInitialsBadge(contactName, 'custom-badge'); // Andere Klasse für spezifischen Stil

    const overlayContent = document.createElement('div');
    overlayContent.classList.add('second-overlay-content');
    overlayContent.appendChild(badge);

    overlayContent.innerHTML += `
        <div class="detail-content">
            <h1 class="contact-name">${contactName}</h1>
                <div class="edit-container">

                        <div class="edit-button-container">
                            <img src="assets/img/edit-pencil.png" alt="Edit" class="edit-image" onclick="editContact(${contactId})" />
                            <p class="edit-label">Edit</p>
                        </div>


                        <div class="delete-button-container">
                            <img src="assets/img/trash-can-icon..png" alt="Delete" class="delete-image" onclick="deleteContact(${contactId})" />
                            <p class="delete-label">Delete</p>
                        </div>
                </div>
        </div>

        <div class="sub-content">
            <h3 class="sub-info">Contact Information</h3>
            <div class="email">
                <p class="contact-email-label">Email:</p>
                <p class="contact-email">${contactEmail}</p>
            </div>
            <div class="phone">    
                <p class="contact-phone-label">Telefon: </p>
                <p class="contact-phone">+49 ${contactPhone}</p>
            </div>    
        </div>    
    `;

    const contactOverlay = document.getElementById('contact-overlay');
    contactOverlay.innerHTML = '';
    contactOverlay.appendChild(overlayContent);
    contactOverlay.style.display = 'block';
}


// Funktion zum Berechnen der Initialen
function getInitials(name) {
    const nameParts = name.split(" ");
    return (nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : '')).toUpperCase();
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