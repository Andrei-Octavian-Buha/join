/**
 * Retrieves values from the input fields for title, date, and category.
 * @returns {Object} An object containing the title, date, and category values.
 */
function getValueFromInputs() {
  title = document.getElementById("addTaskTittle").value;
  date = document.getElementById("addTaskDate").value;
  category = document.getElementById("categorySelectId").value;
  return {
    title,
    date,
    category,
  };
}

/**
 * Resets error states by hiding error messages and removing error styles from the input fields.
 */
function resetErrorStates() {
  document.getElementById("reqTitle").classList.add("dNone");
  document.getElementById("reqDate").classList.add("dNone");
  document.getElementById("reqCategory").classList.add("dNone");

  document.getElementById("addTaskTittle").classList.remove("input-error");
  document.getElementById("addTaskDate").classList.remove("input-error");
  document.getElementById("categorySelectId").classList.remove("input-error");
}

/**
 * Validates the input values for a task, ensuring that the title, date, and category are provided and valid.
 * If any required field is missing or invalid, an error message is shown and the function returns false.
 * 
 * @param {Object} inputValue - The object containing the task input values to be validated.
 * @param {string} inputValue.title - The title of the task.
 * @param {string} inputValue.date - The due date of the task.
 * @param {number} inputValue.category - The category of the task (an integer representing the category).
 * @returns {boolean} Returns `true` if all input values are valid, otherwise `false` if any validation fails.
 */
function validateInput(inputValue) {
  if (!inputValue.title) {
    showError("reqTitle", "addTaskTittle");
    return false;
  }
  if (!inputValue.date) {
    showError("reqDate", "addTaskDate");
    return false;
  }
  if (inputValue.category == 0) {
    showError("reqCategory", "categorySelectId");
    return false;
  }
  return true;
}

/**
 * Displays an error message for a specific input field by showing the associated error element 
 * and applying an error style to the input element.
 * 
 * @param {string} errorId - The ID of the error message element to display.
 * @param {string} inputId - The ID of the input field that caused the error, which will receive an error style.
 */
function showError(errorId, inputId) {
  document.getElementById(errorId).classList.remove("dNone");
  document.getElementById(inputId).classList.add("input-error");
}

/**
 * Validates required fields for task creation, and handles the process of adding data to Firebase
 * and showing a popup with redirection to another page if all fields are valid.
 */
function requiredValidation() {
  let inputValue = getValueFromInputs();
  resetErrorStates();
  if (validateInput(inputValue)) {
    addDataToFireBase();
    showPopupAndRedirect();
  }
}

/**
 * Validates required fields for task creation, and handles the process of adding data to Firebase
 * and showing a popup with redirection to another page if all fields are valid.
 */
function requiredValidationAddTaskToBoard() {
  let inputValue = getValueFromInputs();
  if (validateInput(inputValue)) {
    addDataToFireBaseFromBoard();
    taskInit();
    document.getElementById("add-task-template").innerHTML = "";
    document.getElementById("add-task-template").classList.add("dNone");
    subtasks = [];
  }
}

/**
 * Uploads task data from the board to Firebase.
 * @param {Object} taskData The task data to be uploaded to Firebase.
 */
function addDataToFireBaseFromBoard() {
  const taskData = variableId();
  uploadToFireBase("task", {
    title: taskData.title,
    description: taskData.description,
    assignet: taskData.assignet,
    date: taskData.date,
    prio: taskData.prio,
    category: taskData.category,
    subtask: taskData.subtask,
    progress: "todo",
  });
}

/**
 * Displays a popup and redirects the user to another page after a delay.
 */
function showPopupAndRedirect() {
  const popup = document.getElementById("popup");
  popup.classList.remove("hidden");
  popup.classList.add("visible");
  setTimeout(() => {
    window.location.href = "board.html";
  }, 2500);
}

/**
 * Initializes dropdown behavior for the task board.
 * Handles the opening, closing, and event delegation for the dropdown menu.
 */
document.addEventListener("DOMContentLoaded", initializeDropdown);

/**
 * Sets up the dropdown functionality, including toggling visibility and handling clicks.
 */
function initializeDropdown() {
  const dropDownHeader = document.getElementById("dropDownHeaderId");
  const dropDownBody = document.getElementById("dropDownBodyId");
  let isDropDownOpen = false;

  if (!dropDownHeader || !dropDownBody) return;

  dropDownHeader.addEventListener("click", (event) => toggleDropdown(event, dropDownBody, () => (isDropDownOpen = !isDropDownOpen)));
  document.addEventListener("click", (event) => closeDropdownIfClickedOutside(event, dropDownBody, () => (isDropDownOpen = false)));
  initializeDropdownBodyEventListener(dropDownBody);
}

/**
 * Toggles the dropdown's visibility when the header is clicked.
 * @param {Event} event - The click event.
 * @param {HTMLElement} dropDownBody - The dropdown body element.
 * @param {Function} toggleState - A function to toggle the dropdown's state.
 */
function toggleDropdown(event, dropDownBody, toggleState) {
  event.stopPropagation();
  toggleState();
}

/**
 * Closes the dropdown if the user clicks outside of it.
 * @param {Event} event - The click event.
 * @param {HTMLElement} dropDownBody - The dropdown body element.
 * @param {Function} closeState - A function to update the dropdown's open state.
 */
function closeDropdownIfClickedOutside(event, dropDownBody, closeState) {
  if (!dropDownBody.contains(event.target)) {
    closeState();
    dropDownBody.classList.add("dNone");
  }
}

/**
 * Adds event listeners for the dropdown body.
 * @param {HTMLElement} dropDownBody - The dropdown body element.
 */
function initializeDropdownBodyEventListener(dropDownBody) {
  // Add specific dropdown body-related event listeners here, if needed
}

/**
 * Adds a click event listener to the dropdown body to handle checkbox toggling.
 * 
 * @param {HTMLElement} dropDownBody - The dropdown body element where the event listener will be attached.
 * 
 * @description
 * Attaches a `click` event listener to the given dropdown body element. When a click occurs:
 * - It identifies the nearest `.dropDownContactContainer` element (if any) from the click target.
 * - Finds the `.contactCheckbox` inside the identified container.
 * - Toggles the `checked` state of the checkbox (checked → unchecked, unchecked → checked).
 * 
 * This functionality allows users to select or deselect a contact by clicking anywhere in the contact's container.
 *
 * @paramNotes
 * - `dropDownBody` must be a valid DOM element containing child elements with the class `.dropDownContactContainer`.
 * - Each `.dropDownContactContainer` must contain a `.contactCheckbox` input for the function to work properly.
 */
function dropDownBodyEventListner(dropDownBody) {
  dropDownBody.addEventListener("click", (event) => {
    const contactContainer = event.target.closest(".dropDownContactContainer");
    if (contactContainer) {
      const checkbox = contactContainer.querySelector(".contactCheckbox");
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
      }
    }
  });
}
