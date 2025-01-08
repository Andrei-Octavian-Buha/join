/**
 * Toggles the visibility of the dropdown menu.
 * If the dropdown is visible, it will be hidden, and vice versa.
 */
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

/**
 * Closes the dropdown menu if the user clicks outside of it.
 * It checks if the click target is not within the profile picture element.
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
 * Generates initials from the provided name.
 * It takes the first letter of each part of the name (e.g. first name, last name).
 * If no name is provided, it returns "??".
 *
 * @param {string} name - The name from which to generate initials.
 * @returns {string} The initials, or "??" if the name is empty.
 */
function getInitials(name) {
  if (!name) return "??"; // Fallback, falls der Name nicht existiert
  const nameParts = name.trim().split(" "); // Name in Teile (z. B. Vorname, Nachname) aufteilen
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase()); // Initialen aus den ersten Buchstaben erstellen
  return initials.slice(0, 2).join(""); // Maximal 2 Initialen zurückgeben
}

/**
 * Retrieves user data from session storage, extracts initials, and displays them in the profile text element.
 * If the user data is invalid or not available, it logs an error to the console.
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
 * Initializes the user profile after the DOM content is loaded.
 * It checks for the profile text element and sets the user initials once available.
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
