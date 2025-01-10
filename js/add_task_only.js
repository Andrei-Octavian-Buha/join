/**
 * Sets the minimum date for the date input field with id "addTaskDate" to today's date.
 */
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("addTaskDate").setAttribute("min", today);
});

/**
 * Toggles the display of the dropdown menu element with id "dropdown".
 */
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

/**
 * Hides the dropdown menu when clicking outside of the element with class "profilPic".
 * @param {MouseEvent} event - The mouse click event.
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
 * Adds functionality to toggle visibility of a dropdown body and rotate its arrow.
 * Only executes on pages containing "add_task" in the pathname.
 */
document.addEventListener("DOMContentLoaded", () => {
  const dropDownHeader = document.getElementById("dropDownHeaderId");
  const dropDownBody = document.getElementById("dropDownBodyId");
  if (!window.location.pathname.includes("add_task")) {
    return;
  }
  const dropDownArrow = dropDownHeader.querySelector("img");
  dropDownHeader.addEventListener("click", () => {
    dropDownBody.classList.toggle("dNone");
    if (!dropDownBody.classList.contains("dNone")) {
      dropDownArrow.style.transform = "rotate(180deg)";
    } else {
      dropDownArrow.style.transform = "rotate(0deg)";
    }
  });
});

/**
 * Initializes the user's profile text by repeatedly checking for the header element.
 * Stops the interval once the element is found and updates the user's initials.
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
