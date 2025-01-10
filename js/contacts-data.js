/**
 * Sets the user's initials in the profile section.
 * @function
 */
function setUserInitials() {
  const user = loadUserDataFromSession();
  if (!user || !user.name) return;

  const initials = generateInitials(user.name);
  insertInitialsIntoElement(initials, "profileText");
}

/**
 * Prepares the container for displaying the badge.
 * @function
 * @returns {Element|null} The badge container element or null if not found.
 */
function prepareBadgeContainer() {
  const badgeContainer = document.getElementById("edit-badge-container");
  const imgContainer = document.getElementById("edit-img-container");
  if (!badgeContainer) {
    return null;
  }
  if (imgContainer) {
    imgContainer.style.display = "none";
  }
  badgeContainer.style.backgroundColor = "transparent";
  badgeContainer.innerHTML = "";
  return badgeContainer;
}

/**
 * Adjusts the display of the right content based on the window size.
 * @function
 */
function adjustRightContentDisplay() {
  const rightContent = document.querySelector(".right-content");
  if (window.innerWidth <= 920) {
    rightContent.classList.add("show");
    rightContent.style.display = "flex";
  } else {
    rightContent.classList.remove("show");
    rightContent.style.display = "";
  }
}

/**
 * Toggles the visibility of the menu.
 * @function
 */
function toggleMenu() {
  const menu = document.querySelector(".menu");
  menu.classList.toggle("visible");

  document.addEventListener("click", function handleOutsideClick(event) {
    if (
      !menu.contains(event.target) &&
      !event.target.closest(".three-points")
    ) {
      menu.classList.remove("visible");
      document.removeEventListener("click", handleOutsideClick);
    }
  });
}

/**
 * Toggles the visibility of the dropdown menu.
 * @function
 */
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
