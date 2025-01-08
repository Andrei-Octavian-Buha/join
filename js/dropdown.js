/**
 * Toggles the display of the dropdown element.
 * If the dropdown is currently visible, it will be hidden. If it is hidden, it will be shown.
 */
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

/**
 * Closes the dropdown if the user clicks outside of the element with the class 'profilPic'.
 * This function is triggered on any window click event.
 * @param {Event} event - The event object representing the click event.
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
 * Retrieves the current user from sessionStorage.
 * The user is expected to be stored in sessionStorage as a JSON string.
 * @returns {Object|null} The parsed user object if it exists, otherwise null.
 */
function getCurrentUser() {
  const user = sessionStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

/**
 * Extracts the initials from a user's name.
 * If no name is provided, "??" will be returned.
 * @param {string} name - The full name of the user.
 * @returns {string} The initials of the user (first two letters of the first and last name).
 */
function getInitials(name) {
  if (!name) return "??";
  const nameParts = name.trim().split(" ");
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase());
  return initials.slice(0, 2).join("");
}

/**
 * Sets the user's initials in the element with the id 'profileText'.
 * It retrieves the current user from sessionStorage, extracts the initials,
 * and updates the profileText element with the initials.
 */
function setUserInitials() {
  const userData = sessionStorage.getItem("currentUser");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      const initials = getInitials(user.name);
      const profileTextElement = document.getElementById("profileText");
      if (profileTextElement) {
        profileTextElement.innerHTML = initials;
      }
    } catch (error) {
      console.error("Fehler beim Verarbeiten der Benutzerdaten:", error);
    }
  }
}

/**
 * Event listener that runs once the DOM is fully loaded.
 * It periodically checks for the existence of the element with id 'profileText',
 * and once it's found, it sets the user's initials by calling setUserInitials.
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
