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
