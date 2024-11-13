const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app";
let contacts = [];

// Initialisierungsfunktion
function init() {
  fetchContactsData();
  deleteContact("-OBVSNIVg4rkyJsSCk2a");
}

function openOverlay(overlayId) {
  const overlay = document.getElementById(overlayId);
  overlay.style.display = "flex"; // Overlay sichtbar machen
  overlay.classList.add("show"); // Animation hinzufügen
}

// Funktion zum Schließen eines Overlays
function closeOverlay(overlayId) {
  const overlay = document.getElementById(overlayId);
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
    console.error("Fehler beim Abrufen der Kontakte:", error);
    return null;
  }
}

function renderContactList(data) {
  const contactList = document.getElementById("contactList");
  contactList.innerHTML = ""; // Liste leeren

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
    a.name.localeCompare(b.name, "de", { sensitivity: "base" })
  );
}

// Funktion zum Rendern der sortierten Kontakte und Gruppierung nach Anfangsbuchstaben
function renderSortedContacts(contactList, sortedContacts) {
  let currentLetter = "";

  sortedContacts.forEach((contact) => {
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
  const letterHeader = document.createElement("h4");
  letterHeader.classList.add("letter-header");
  letterHeader.textContent = letter;
  contactList.appendChild(letterHeader);
}

// Funktion zum Hinzufügen einer Silverline
function addSilverline(contactList) {
  const silverline = document.createElement("div");
  silverline.classList.add("silverline");
  contactList.appendChild(silverline);
}

// Funktion zum Anzeigen der Nachricht, wenn keine Kontakte vorhanden sind
function displayNoContactsMessage(contactList) {
  contactList.innerHTML = "<div>Keine Kontakte vorhanden</div>";
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
  const card = document.createElement("div");
  card.classList.add("contact-card"); // Card-Design-Klasse
  card.onclick = function () {
    setActiveContact(card); // Übergebe die gesamte Karte
    openContactOverlay(contact.id, contact.name, contact.email, contact.phone);
  };

  // Initialen aus Vor- und Nachnamen berechnen
  const initials = getInitials(contact.name);

  // Erstelle das Badge-Element für die Initialen
  const badge = document.createElement("div");
  badge.classList.add("initials-badge");
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
  const contactCards = document.querySelectorAll("div"); // Hier können wir alle div-Elemente abfragen
  contactCards.forEach((card) => {
    card.classList.remove("active");
  });

  // Füge die 'active'-Klasse zum aktuell geklickten Element hinzu
  element.classList.add("active");
}

function createInitialsBadge(contactName) {
  // Berechnen Sie die Initialen und die Badge-Farbe
  const initials = getInitials(contactName); // Funktion, um die Initialen zu berechnen
  const badgeColor = getColorForInitial(initials[0]); // Farbe basierend auf der Initiale

  // Badge-Element erstellen
  const badge = document.createElement("div");
  badge.classList.add("initials-badge");
  badge.textContent = initials;
  badge.style.backgroundColor = badgeColor; // Badge-Farbe setzen

  return badge; // Rückgabe des Badge-Elements
}

// Funktion zur Erstellung des Badge-Elements mit einer anpassbaren Klasse
function createInitialsBadge(name, className = "default-badge") {
  const initials = getInitials(name);
  const badge = document.createElement("div");
  badge.classList.add(className); // Verwende den übergebenen Klassennamen
  badge.textContent = initials;
  badge.style.backgroundColor = getColorForInitial(initials[0]);
  return badge;
}

// Funktion zum Generieren des HTML-Codes für das Overlay
function generateContactOverlayHTML(
  contactId,
  contactName,
  contactEmail,
  contactPhone
) {
  return `
        <div class="second-overlay-content">
                <div class="badge-and-name">
                    <div class="badge">
                        ${
                          createInitialsBadge(contactName, "custom-badge")
                            .outerHTML
                        }
                        <h1 class="contact-name">${contactName}</h1>
                    </div>

                    <div class="detail">
                        <div class="detail-content">
                            <div class="edit-container">
                                <div class="edit-button-container">
                                    <img src="assets/img/edit-pencil.png" alt="Edit" class="edit-image" />
                                    <p class="edit-label" onclick="editContact('${contactId}')">Edit</p>
                                </div>
                                <div class="delete-button-container">
                                    <img src="assets/img/trash-can-icon..png" alt="Delete" class="delete-image" />
                                    <p class="delete-label" onclick="deleteContact('${contactId}')">Delete</p>
                                </div>
                            </div>
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
                    <div class="three-points" onclick="toggleMenu()">
                        <img src="assets/img/threePoints.png" alt="Menu" class="small-img">
                    </div>
                    <div class="menu hidden-menu">
                        <div class="edit-button-container hidden">
                            <img src="assets/img/edit-pencil.png" alt="Edit" class="edit-image hidden" />
                            <p class="edit-label" onclick="editContact('${contactId}')">Edit</p>
                        </div>
                        <div class="delete-button-container hidden">
                            <img src="assets/img/trash-can-icon..png" alt="Delete" class="delete-image" />
                            <p class="delete-label" onclick="deleteContact('${contactId}')">Delete</p>
                        </div>
                    </div>   
            </div>
        </div>
    `;
}

// Hauptfunktion, um das Overlay zu öffnen
function openContactOverlay(
  contactId,
  contactName,
  contactEmail,
  contactPhone
) {
  const overlayContent = document.createElement("div");
  overlayContent.innerHTML = generateContactOverlayHTML(
    contactId,
    contactName,
    contactEmail,
    contactPhone
  );
  const contactOverlay = document.getElementById("contact-overlay");
  contactOverlay.innerHTML = "";
  contactOverlay.appendChild(overlayContent);
  contactOverlay.style.display = "block"; // Zeigt das Overlay an
  const rightContent = document.querySelector(".right-content");

  if (window.innerWidth <= 920) {
    rightContent.classList.add("show");
    rightContent.style.display = "flex"; // Zeigt den Container an
  } else {
    rightContent.classList.remove("show");
    rightContent.style.display = ""; // Setzt den Container zurück auf den Standardwert
  }
}

function closeContactOverlay() {
  const rightContent = document.querySelector(".right-content");
  rightContent.classList.remove("show");
  rightContent.style.display = ""; // Setzt auf den Standardwert zurück
}

function editContact(contactId) {
  const editContactOverlay = document.getElementById("edit-contact-overlay");

  if (editContactOverlay) {
    editContactOverlay.style.display = "block"; // Zeigt den Container an
  } else {
    console.error(
      'Element mit der ID "edit-contact-overlay" wurde nicht gefunden.'
    );
  }
}

function getInitials(name) {
  const nameParts = name.split(" ");
  return (
    nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : "")
  ).toUpperCase();
}

function getColorForInitial(initial) {
  const colors = {
    A: "#FF5733",
    B: "#FFBD33",
    C: "#DBFF33",
    D: "#75FF33",
    E: "#33FF57",
    F: "#33FFBD",
    G: "#33DBFF",
    H: "#3375FF",
    I: "#5733FF",
    J: "#BD33FF",
    K: "#FF33DB",
    L: "#FF3375",
    M: "#FF3333",
    N: "#FF6633",
    O: "#FF9933",
    P: "#FFCC33",
    Q: "#FFFF33",
    R: "#CCFF33",
    S: "#99FF33",
    T: "#66FF33",
    U: "#33FF66",
    V: "#33FF99",
    W: "#33FFCC",
    X: "#33FFFF",
    Y: "#33CCFF",
    Z: "#3399FF",
  };
  return colors[initial] || "#333333"; // Standardfarbe, falls kein Eintrag
}

function addContactToFirebase(contact) {
  fetch(`${BASE_URL}/contacts.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Kontakt erfolgreich hinzugefügt:", data);

      // Die generierte ID von Firebase
      const generatedId = data.name;
      console.log("Generierte Kontakt-ID:", generatedId);

      alert("Kontakt erfolgreich gespeichert!");

      // Optional: Speichere diese ID, um sie später zu verwenden
      contact.id = generatedId; // Speichere die ID im Kontakt-Objekt

      fetchContactsData();
      closeOverlay("overlay");
    })
    .catch((error) =>
      console.error("Fehler beim Speichern des Kontakts:", error)
    );
}

function deleteContact(contactId) {
  console.log("Kontakt-ID zum Löschen:", contactId); // ID in der Konsole prüfen

  const confirmDelete = confirm("Möchten Sie den Kontakt wirklich löschen?");

  if (confirmDelete) {
    fetch(`${BASE_URL}/contacts/${contactId}.json`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Kontakt erfolgreich gelöscht");
          alert("Kontakt wurde erfolgreich gelöscht!");

          fetchContactsData(); // Kontaktliste nach dem Löschen aktualisieren
        } else {
          throw new Error("Fehler beim Löschen des Kontakts");
        }
      })
      .catch((error) => {
        console.error("Fehler beim Löschen des Kontakts:", error);
        alert("Fehler beim Löschen des Kontakts.");
      });
  }
}

contacts.forEach((contact) => {
  const deleteButton = document.createElement("p");
  deleteButton.className = "delete-label";
  deleteButton.textContent = "Delete";

  // Den OnClick-Handler setzen, um die ID korrekt zu übergeben
  deleteButton.onclick = () => deleteContact(contact.id); // Übergabe der ID an die deleteContact Funktion

  document.body.appendChild(deleteButton);
});

// Funktion zum Hinzufügen eines Kontakts ohne Neuladen
function addContact(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  const contact = { name, email, phone };
  addContactToFirebase(contact);

  document.getElementById("contactForm").reset(); // Formular zurücksetzen
}

function toggleMenu() {
  const menu = document.querySelector(".menu");
  menu.classList.toggle("visible");

  document.addEventListener("click", function handleOutsideClick(event) {
    if (
      !menu.contains(event.target) &&
      !event.target.closest(".three-points")
    ) {
      menu.classList.remove("visible");
      // Event-Listener entfernen, nachdem das Menü geschlossen wurde
      document.removeEventListener("click", handleOutsideClick);
    }
  });
}
