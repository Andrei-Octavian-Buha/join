/**
 * Toggles the display of the dropdown element.
 * If the dropdown is currently visible, it will be hidden; otherwise, it will be shown.
 */
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

/**
 * Closes the dropdown when the user clicks outside of it,
 * unless the click target is the profile picture or an element within it.
 *
 * @param {Event} event - The click event that triggered the function.
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
 * Generates initials from a full name.
 *
 * @param {string} name - The full name from which to generate initials.
 * @returns {string} - The initials of the person, limited to a maximum of two.
 */
function getInitials(name) {
  if (!name) return "??"; // Fallback, falls der Name nicht existiert
  const nameParts = name.trim().split(" "); // Name in Teile (z. B. Vorname, Nachname) aufteilen
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase()); // Initialen aus den ersten Buchstaben erstellen
  return initials.slice(0, 2).join(""); // Maximal 2 Initialen zurückgeben
}

/**
 * Sets the user's initials in the element with the ID 'profileText'.
 * Retrieves user data from localStorage and calls getInitials() to extract and display the initials.
 */
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
  }
}

/**
 * Waits for the DOM to be fully loaded, then calls setUserInitials() to set the user's initials.
 * This function repeatedly checks for the 'profileText' element and executes once it's available.
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
