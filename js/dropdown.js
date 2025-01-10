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