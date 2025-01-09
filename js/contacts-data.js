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
 * Gets the color associated with a contact's initial.
 * @function
 * @param {string} initial - The initial character of the contact's name.
 * @returns {string} The hex color code for the initial.
 */
function getColorForInitial(initial) {
  const colors = {
    A: "#FF5733",
    B: "#FFBD33",
    C: "#DBFF33",
    D: "#75FF33",
    E: "#33FF57",
    F: "#33FFBD",
    G: "#3399FF",
    H: "#8A2BE2",
    I: "#5733FF",
    J: "#BD33FF",
    K: "#FF33DB",
    L: "#FF3375",
    M: "#FF3333",
    N: "#FF6633",
    O: "#FF9933",
    P: "#FFCC33",
    Q: "#FFFF33",
    R: "#99CC29",
    S: "#66CC99",
    T: "#66A3A3",
    U: "#3399CC",
    V: "#33FF99",
    W: "#33FFCC",
    X: "#33FFFF",
    Y: "#33CCFF",
    Z: "#3399FF",
  };
  return colors[initial] || "#333333";
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
