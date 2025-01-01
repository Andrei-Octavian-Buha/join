/**
 * Event listener for clicks outside the dropdown. Closes the dropdown if clicked outside the profile picture.
 * @param {Event} event - The click event.
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
 * Extracts the initials from a user's name.
 * If no name is provided, returns "??".
 *
 * @param {string} name - The full name of the user.
 * @returns {string} The initials of the user, or "??" if no name is provided.
 */
function getInitials(name) {
  if (!name) return "??"; // Fallback if the name does not exist
  const nameParts = name.trim().split(" "); // Split name into parts (e.g., first name, last name)
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase()); // Create initials from first letters
  return initials.slice(0, 2).join(""); // Return up to 2 initials
}

/**
 * Retrieves the current user's data from sessionStorage and sets their initials in the profile text element.
 * The initials are derived from the user's name.
 */
function setUserInitials() {
  const userData = sessionStorage.getItem("currentUser"); // Retrieve user data from sessionStorage
  if (userData) {
    try {
      const user = JSON.parse(userData); // Parse the user data (JSON to object)
      const initials = getInitials(user.name); // Generate initials from the user's name
      const profileTextElement = document.getElementById("profileText"); // Find the profile text element
      if (profileTextElement) {
        profileTextElement.innerHTML = initials; // Insert the initials into the element
      }
    } catch (error) {
      console.error("Error processing user data:", error);
    }
  }
}

/**
 * Event listener for the 'DOMContentLoaded' event that waits for the profile text element to be available
 * and then sets the user's initials.
 */
document.addEventListener("DOMContentLoaded", () => {
  const checkHeaderInterval = setInterval(() => {
    const profileTextElement = document.getElementById("profileText");
    if (profileTextElement) {
      clearInterval(checkHeaderInterval); // Stop the interval once the element is found
      setUserInitials(); // Set the user's initials
    }
  }, 100); // Check every 100ms until the profile text element is available
});

/**
 * Closes the dropdown menu when clicking outside of the profile picture.
 * It checks if the click event target is neither the profile picture nor a descendant of it.
 *
 * @param {Event} event - The click event object.
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
 * Event listener that ensures the profile initials are set once the DOM is fully loaded.
 * It periodically checks for the presence of the "profileText" element and calls setUserInitials() when found.
 */
document.addEventListener("DOMContentLoaded", () => {
  const checkHeaderInterval = setInterval(() => {
    const profileTextElement = document.getElementById("profileText");
    if (profileTextElement) {
      clearInterval(checkHeaderInterval); // Stop checking once the element is available
      setUserInitials(); // Set the user's initials in the profile
    }
  }, 100); // Check every 100ms until the element is found
});

/**
 * Toggles the visibility of the dropdown menu with the id "dropdown".
 * The dropdown is either shown or hidden based on its current visibility state.
 */
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

/**
 * Closes the dropdown menu when clicking outside of the profile picture.
 * It checks if the click event target is neither the profile picture nor a descendant of it.
 *
 * @param {Event} event - The click event object.
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
 * Event listener that ensures the profile initials are set once the DOM is fully loaded.
 * It periodically checks for the presence of the "profileText" element and calls setUserInitials() when found.
 */
document.addEventListener("DOMContentLoaded", () => {
  const checkHeaderInterval = setInterval(() => {
    const profileTextElement = document.getElementById("profileText");
    if (profileTextElement) {
      clearInterval(checkHeaderInterval); // Stop checking once the element is available
      setUserInitials(); // Set the user's initials in the profile
    }
  }, 100); // Check every 100ms until the element is found
});
