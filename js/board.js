// function newPost() {
//     const template = document.getElementById("cardTemplate");
//     const newCard = template.content.cloneNode(true);
//     const container = document.getElementById("open");

//     container.insertBefore(newCard, container.firstChild);

//     const addedCard = container.firstChild;
//     addDragFunctionality(addedCard);
// }

function newProgress() {
  const template = document.getElementById("cardTemplate");
  const newCard = template.content.cloneNode(true);
  const container = document.getElementById("closed");

  container.insertBefore(newCard, container.firstChild);

  const addedCard = container.firstChild;
  addDragFunctionality(addedCard);
}

function newFeedback() {
  const template = document.getElementById("cardTemplate");
  const newCard = template.content.cloneNode(true);
  const container = document.getElementById("wait");

  container.insertBefore(newCard, container.firstChild);

  const addedCard = container.firstChild;
  addDragFunctionality(addedCard);
}

function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

window.onclick = function (event) {
  if (
    !event.target.matches(".profilPic") &&
    !event.target.closest(".profilPic")
  ) {
    const dropdown = document.getElementById("dropdown");
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    }
  }
};

function getInitials(name) {
  if (!name) return "??"; // Fallback, falls der Name nicht existiert
  const nameParts = name.trim().split(" "); // Name in Teile (z. B. Vorname, Nachname) aufteilen
  const initials = nameParts.map(part => part.charAt(0).toUpperCase()); // Initialen aus den ersten Buchstaben erstellen
  return initials.slice(0, 2).join(""); // Maximal 2 Initialen zurückgeben
}

// Funktion, um den Namen aus dem Local Storage zu laden und Initialen einzusetzen
function setUserInitials() {
  const userData = localStorage.getItem("currentUser"); // Daten aus dem Local Storage abrufen
  if (userData) {
      try {
          const user = JSON.parse(userData); // JSON-String in ein Objekt umwandeln
          const initials = getInitials(user.name); // Initialen generieren
          const profileTextElement = document.getElementById("profileText"); // Element mit der ID 'profileText' finden
          if (profileTextElement) {
              profileTextElement.innerHTML = initials; // Initialen in das Element einfügen
          }
      } catch (error) {
          console.error("Fehler beim Verarbeiten der Benutzerdaten:", error);
      }
  } else {
      console.warn("Keine Benutzerdaten im Local Storage unter 'currentUser' gefunden.");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const checkHeaderInterval = setInterval(() => {
      const profileTextElement = document.getElementById("profileText");
      if (profileTextElement) {
          clearInterval(checkHeaderInterval); 
          setUserInitials(); 
      }
  }, 100); 
});
