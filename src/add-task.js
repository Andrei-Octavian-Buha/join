/**
 * Base URL for Firebase Realtime Database.
 * @constant {string}
 */
const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Initializes the application by loading contacts.
 * @async
 */
async function init() {
  await loadContacts();
  // updateEmptyColumnMessages();
}

/**
 * Triggers the subtask add process, hides the button, deletes input and adds subtask.
 */
function subtasktrigger() {
  hideSubTaskAddBtn();
  deleteInputSubTask();
  addSubTask();
}

/**
 * Sorts contacts in ascending order by name.
 * @param {Array} contacts - The list of contacts to sort.
 * @returns {Array} The sorted contacts.
 */
function sortContacts(contacts) {
  return contacts.sort((a, b) => {
    let nameA = a.cont.name.toUpperCase();
    let nameB = b.cont.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

/**
 * Creates a contact element for rendering.
 * @param {Object} element - The contact data object.
 * @returns {HTMLElement} The created contact element.
 */
function createContactElement(element) {
  let container = document.createElement("label");
  container.id = `ContainerID${element.id}`;
  container.classList.add("dropDownContactContainer");
  let initials = element.cont.name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2);
  let color = getColorForInitial(initials[0]);
  container.innerHTML = dropDownContactNameHTML(element, color, initials);
  return container;
}

/**
 * Renders the contacts in the dropdown list.
 * @param {Array} contacts - The list of sorted contacts.
 */
function renderContacts(contacts) {
  let dropdown = document.getElementById("dropDownBodyId");
  dropdown.innerHTML = "";
  contacts.forEach((element) => {
    let container = createContactElement(element);
    dropdown.appendChild(container);
    startEvent(element);
  });
}

/**
 * Loads contact data from Firebase and returns it in an array.
 * @async
 * @returns {Array} The list of contacts.
 */
async function loadContactsData() {
  let ContactResponse = await getAllContacts("contacts");
  let UserKeyArray = Object.keys(ContactResponse);
  return UserKeyArray.map((id) => ({
    id: id,
    cont: ContactResponse[id],
  }));
}

/**
 * Loads and renders contacts in sorted order.
 * @async
 */
async function loadContacts() {
  let contactsData = await loadContactsData();
  let sortedContacts = sortContacts(contactsData);
  renderContacts(sortedContacts);
  subtasktrigger();
}

/**
 * Loads and renders contacts in sorted order for editing.
 * @async
 */
async function loadContactsForEdit() {
  let contactsData = await loadContactsData();
  let sortedContacts = sortContacts(contactsData);
  renderContacts(sortedContacts);
}

/**
 * Gets a background color based on the initial character of a contact's name.
 * @param {string} initial - The initial character of a contact's name.
 * @returns {string} The color code for the initial.
 */
function getColorForInitial(initial) {
  const colors = {
    A: "#FF5733",
    B: "#FFBD33",
    C: "#DBFF33",
    D: "#75FF33",
    E: "#33FF57",
    F: "#33FFBD",
    G: "#33DBFF",
    H: "#3375FF",
    I: "#5733FF",
    J: "#BD33FF",
    K: "#FF33DB",
    L: "#FF3375",
    M: "#FF3333",
    N: "#FF6633",
    O: "#FF9933",
    P: "#FFCC33",
    Q: "#FFFF33",
    R: "#CCFF33",
    S: "#99FF33",
    T: "#66FF33",
    U: "#33FF66",
    V: "#33FF99",
    W: "#33FFCC",
    X: "#33FFFF",
    Y: "#33CCFF",
    Z: "#3399FF",
  };
  return colors[initial] || "#333333";
}

/**
 * Starts an event listener for a contact's checkbox.
 * @param {Object} contactId - The contact data object.
 */
function startEvent(contactId) {
  const ck = document.getElementById(`CheckboxID${contactId.id}`);
  if (ck) {
    ck.addEventListener("change", () => {
      whenChecked(contactId);
    });
  } else {
    console.error(`CheckboxID${contactId.id} not found`);
  }
}

/**
 * Fetches all contacts from Firebase.
 * @async
 * @param {string} path - The path to the contacts data in Firebase.
 * @returns {Object} The contacts data.
 */
async function getAllContacts(path = "") {
  let response = await fetch(`${BASE_URL}` + path + ".json");
  return await response.json();
}

let checked = [];

/**
 * Resets the task form and reloads the contacts.
 * @async
 * @param {Event} event - The form submit event.
 */
async function resetForm(event) {
  let assignet = document.getElementById("whoIsAssignet");
  document.getElementById("dropDownBodyId").classList.add("dNone");
  let text = document.getElementById("dinamicText");
  text.innerHTML = "Select contacts to assign";
  event.preventDefault();
  const form = document.getElementById("addTaskForm");
  form.setAttribute("novalidate", true);
  form.reset();
  form.removeAttribute("novalidate");
  subtasks = [];
  rendSubTask();
  checked = [];
  await loadContacts();
  assignet.innerHTML = "";
}

/**
 * Updates the assignment text and displays the selected contacts.
 * @param {Object} contactId - The contact data object.
 */
function whenChecked(contactId) {
  let ck = document.getElementById(`CheckboxID${contactId.id}`);
  let container = document.getElementById(`ContainerID${contactId.id}`);
  let text = document.getElementById("dinamicText");
  let assignet = document.getElementById("whoIsAssignet");
  if (checked.length === 0) {
    text.innerHTML = "Select contacts to assign";
    assignet.innerHTML = "";
  } else {
    text.innerHTML = "An |";
  }
  if (ck.checked) {
    if (!checked.includes(contactId.id)) {
      checked.push({ name: contactId.cont.name, key: contactId.id });
    }
    container.classList.add("checkedBgColor");
  } else {
    const index = checked.findIndex((item) => item.key === contactId.id);
    if (index > -1) {
      checked.splice(index, 1);
    }
    container.classList.remove("checkedBgColor");
  }
  assignet.innerHTML = "";
  checked.forEach((element) => {
    let initials = element.name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("")
      .slice(0, 2);
    let color = getColorForInitial(initials[0]);
    assignet.innerHTML += `<p class="firstLetterCircle" style="background-color: ${color};">${initials}</p>`;
  });
}

let subtasks = [];

/**
 * Hides the subtask add button and prepares the interface for adding a subtask.
 */
function hideSubTaskAddBtn() {
  let btn1 = document.getElementById("AddSubTaskStep1");
  let btn2 = document.getElementById("AddSubTaskStep2");
  btn1.addEventListener("click", () => {
    btn1.classList.add("dNone");
    btn2.classList.remove("dNone");
  });
}

/**
 * Hides the subtask add button when editing.
 */
function hideEditAddBtn() {
  document.getElementById("AddSubTaskStep1").classList.remove("dNone");
  document.getElementById("AddSubTaskStep2").classList.add("dNone");
  let inputText = document.getElementById("inputSubTask");
  inputText.value = "";
}

/**
 * Deletes the subtask input value.
 */
function deleteInputSubTask() {
  let btn = document.getElementById("AddSubTaskStep2Delete");
  let inputText = document.getElementById("inputSubTask");
  btn.addEventListener("click", () => {
    inputText.value = "";
    hideEditAddBtn();
  });
}

/**
 * Adds a subtask to the list of subtasks.
 */
function addSubTask() {
  let btn = document.getElementById("AddSubTaskStep2Add");
  let inputText = document.getElementById("inputSubTask");
  btn.addEventListener("click", () => {
    if (inputText.value && subtasks.length <= 1) {
      subtasks.push(inputText.value);
    }
    hideEditAddBtn();
    rendSubTask();
  });
}

/**
 * Deletes a subtask by its index.
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubTask(index) {
  subtasks.splice(index, 1);
  rendSubTask();
}

/**
 * Edits a subtask by toggling the edit input field.
 * @param {number} index - The index of the subtask to edit.
 */
function editAddedSubTask(index) {
  let inputToEdit = document.getElementById(`toEditInputSubTask-${index}`);
  inputToEdit.classList.remove("inputsubTask");
  inputToEdit.classList.add("inputsubTaskActive");
  backgroundEdit(index);
  changeEditWithCheck(index);
  inputToEdit.removeAttribute("readonly");
  inputToEdit.value = subtasks[index];
}

/**
 * Changes the edit mode with a check button for the subtask.
 * @param {number} index - The index of the subtask to edit.
 */
function changeEditWithCheck(index) {
  document.getElementById(`AddSubTaskStep2-${index}`).classList.remove("dNone");
  document.getElementById(`subTaskEditBtn-${index}`).classList.add("dNone");
  document.getElementById(`idSpanSubTaskEdit${index}`).classList.add("dNone");
}

/**
 * Adds the check button for a subtask edit.
 * @param {number} index - The index of the subtask to edit.
 */
function addEditcheck(index) {
  let btn = document.getElementById(`AddSubTaskStep2-${index}`);
  let inputText = document.getElementById(`toEditInputSubTask-${index}`);
  btn.addEventListener("click", () => {
    if (inputText.value) {
      subtasks[index] = inputText.value;
      rendSubTask();
    } else {
      deleteSubTask(index);
    }
  });
}

/**
 * Adds a background color to the subtask when editing.
 * @param {number} index - The index of the subtask being edited.
 */
function backgroundEdit(index) {
  let conteinerId = document.getElementById(`subtaskContainerId${index}`);
  conteinerId.classList.add("backgroundSubTaskEdit");
}

/**
 * Renders the list of subtasks.
 */
function rendSubTask() {
  let toRender = document.getElementById("renderSubTask");
  toRender.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    toRender.innerHTML += rendsubtaskHTML(subtask, index);
  });
}

/**
 * Uploads task data to Firebase.
 * @async
 * @param {string} path - The path to store the data in Firebase.
 * @param {Object} data - The task data to upload.
 * @returns {Object} The response from the Firebase server.
 */
async function uploadToFireBase(path = "", data = {}) {
  let response = await fetch(`${BASE_URL}` + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Gets the priority value of the selected radio button.
 * @returns {string} The selected priority value.
 */
function getPriorityValue() {
  const priorityRadios = document.querySelectorAll(
    ".radio-group input[type='radio']"
  );
  let selectedPriority;
  priorityRadios.forEach((radio) => {
    if (radio.checked) {
      selectedPriority = radio.value;
    }
  });
  return selectedPriority;
}

/**
 * Collects all form data into an object.
 * @returns {Object} The form data as an object.
 */
function variableId() {
  title = document.getElementById("addTaskTittle").value;
  description = document.getElementById("addTaskDescription").value;
  assignet = checked;
  date = document.getElementById("addTaskDate").value;
  prio = getPriorityValue();
  category = document.getElementById("categorySelectId").value;
  if (!Array.isArray(subtasks)) {
    subtasks = [];
  }
  return {
    title,
    description,
    assignet,
    date,
    prio,
    category,
    subtask: subtasks,
  };
}

/**
 * Handles the form submission event.
 * @param {Event} event - The form submission event.
 */
function handleFormSubmit(event) {
  event.preventDefault();
  // addDataToFireBase();
  requiredValidation();
  // showPopupAndRedirect();
}

/**
 * Adds task data to Firebase.
 */
function addDataToFireBase() {
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
 * Adds task data to Firebase from the board.
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
 * Shows a popup and redirects the user after a short delay.
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
 * Initializes the dropdown and handles opening/closing.
 */
document.addEventListener("DOMContentLoaded", () => {
  const dropDownHeader = document.getElementById("dropDownHeaderId");
  const dropDownBody = document.getElementById("dropDownBodyId");
  if (!dropDownHeader || !dropDownBody) {
    return;
  }
  let isDropDownOpen = false;
  dropDownHeader.addEventListener("click", (event) => {
    isDropDownOpen = !isDropDownOpen;
    // dropDownBody.style.display = isDropDownOpen ? "block" : "none";
    event.stopPropagation(); // Prevents closing if clicked on header
  });

  // Close dropdown when clicked outside of it
  document.addEventListener("click", (event) => {
    if (isDropDownOpen && !dropDownBody.contains(event.target)) {
      isDropDownOpen = false;
      dropDownBody.classList.add("dNone");
    }
  });

  // Click on contacts in the list
  dropDownBody.addEventListener("click", (event) => {
    const contactContainer = event.target.closest(".dropDownContactContainer");
    if (contactContainer) {
      const checkbox = contactContainer.querySelector(".contactCheckbox");
      if (checkbox) {
        checkbox.checked = !checkbox.checked; // Toggle checkbox status
      }
    }
  });
});

/**
 * Sets the minimum value for the "addTaskDate" input field to today's date.
 * This ensures that the user cannot select a date before today.
 */
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("addTaskDate").setAttribute("min", today);
});

/**
 * Toggles the display of the dropdown menu.
 * This function is called when the dropdown header is clicked.
 */
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

/**
 * Closes the dropdown menu if the user clicks outside of it.
 * This function is called on any window click.
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
 * Initializes the dropdown functionality for the "add_task" page.
 * This function adds an event listener to toggle the dropdown content
 * and rotates the dropdown arrow when clicked.
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
 * Extracts the initials from a user's full name.
 * If the name is empty or undefined, it returns "??".
 * @param {string} name - The full name of the user.
 * @returns {string} The initials of the user.
 */
function getInitials(name) {
  if (!name) return "??";
  const nameParts = name.trim().split(" ");
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase());
  return initials.slice(0, 2).join("");
}

/**
 * Sets the user's initials in the profile section.
 * It retrieves the user data from the session storage,
 * extracts the initials, and updates the profile text element.
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
      console.error("Error processing user data:", error);
    }
  }
}

/**
 * Checks periodically for the existence of the profile text element
 * and then sets the user's initials once it is found.
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

/**
 * Retrieves the values from the input fields for task title, date, and category.
 * @returns {Object} An object containing the values of the title, date, and category.
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
 * Validates if the required fields for task creation (title, date, category) are filled out.
 * If any field is missing, an error message is displayed.
 * If all fields are valid, the data is added to Firebase and a popup is shown.
 */
function requiredValidation() {
  let inputValue = getValueFromInputs();

  // Reset error states before validating
  resetErrorStates();

  if (!inputValue.title) {
    document.getElementById("reqTitle").classList.remove("dNone");
    document.getElementById("addTaskTittle").classList.add("input-error"); // Add red border
  } else if (!inputValue.date) {
    document.getElementById("reqDate").classList.remove("dNone");
    document.getElementById("addTaskDate").classList.add("input-error"); // Add red border
  } else if (inputValue.category == 0) {
    document.getElementById("reqCategory").classList.remove("dNone");
    document.getElementById("categorySelectId").classList.add("input-error"); // Add red border
  } else {
    addDataToFireBase();
    showPopupAndRedirect();
  }
}

/**
 * Resets the error states by hiding error messages and removing error classes from input fields.
 */
function resetErrorStates() {
  // Reset error messages visibility
  document.getElementById("reqTitle").classList.add("dNone");
  document.getElementById("reqDate").classList.add("dNone");
  document.getElementById("reqCategory").classList.add("dNone");

  // Remove error classes from input fields
  document.getElementById("addTaskTittle").classList.remove("input-error");
  document.getElementById("addTaskDate").classList.remove("input-error");
  document.getElementById("categorySelectId").classList.remove("input-error");
}

/**
 * Similar to `requiredValidation`, but for adding a task to the board.
 * It validates if the required fields are filled. If valid, it adds data to Firebase and updates the task board.
 */
function requiredValidationAddTaskToBoard() {
  let inputValue = getValueFromInputs();

  if (!inputValue.title) {
    document.getElementById("reqTitle").classList.remove("dNone");
    document.getElementById("addTaskTittle").classList.add("input-error");
  } else if (!inputValue.date) {
    document.getElementById("reqDate").classList.remove("dNone");
    document.getElementById("addTaskDate").classList.add("input-error");
  } else if (inputValue.category == 0) {
    document.getElementById("reqCategory").classList.remove("dNone");
    document.getElementById("categorySelectId").classList.add("input-error");
  } else {
    addDataToFireBaseFromBoard();
    taskInit();
    let template = document.getElementById("add-task-template");
    template.classList.add("dNone");
  }
}
