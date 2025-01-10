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
