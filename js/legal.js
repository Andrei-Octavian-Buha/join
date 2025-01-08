/**
 * Toggles the visibility of the dropdown menu.
 * If the dropdown is visible, it will be hidden. If it's hidden, it will be shown.
 */
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

/**
 * Event listener to close the dropdown if the user clicks outside of the profile picture.
 * It hides the dropdown if it's open when the click happens outside of the element with class 'profilPic'.
 *
 * @param {Event} event - The click event triggered by the user.
 */
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

/**
 * Extracts and returns the initials from a given full name.
 * The initials are formed from the first letter of each part of the name.
 * Only the first two initials are returned.
 *
 * @param {string} name - The full name from which the initials will be extracted.
 * @returns {string} The initials formed from the name. If no name is provided, returns "??".
 */
function getInitials(name) {
  if (!name) return "??"; // Fallback, falls der Name nicht existiert
  const nameParts = name.trim().split(" "); // Name in Teile (z. B. Vorname, Nachname) aufteilen
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase()); // Initialen aus den ersten Buchstaben erstellen
  return initials.slice(0, 2).join(""); // Maximal 2 Initialen zurückgeben
}

/**
 * Sets the user's initials in the profile text element.
 * It retrieves user data from sessionStorage, parses it, and extracts the initials.
 * If the profile text element is found, it updates its content with the user's initials.
 *
 * @throws {Error} Will log an error if the user data cannot be parsed.
 */
function setUserInitials() {
  const userData = sessionStorage.getItem("currentUser"); // Daten aus dem Local Storage abrufen
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
  }
}

/**
 * Initializes the process of setting user initials when the DOM is fully loaded.
 * It continuously checks for the presence of the profile text element and sets the user's initials once it is found.
 */
document.addEventListener("DOMContentLoaded", () => {
  const checkHeaderInterval = setInterval(() => {
    const profileTextElement = document.getElementById("profileText");
    if (profileTextElement) {
      clearInterval(checkHeaderInterval);
      setUserInitials();
    }
  }, 100);
});
