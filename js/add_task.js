/**
 * Base URL for the Firebase database.
 * @constant {string}
 */
const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Initializes the application by loading contacts.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function init() {
  await loadContacts();
}

/**
 * Triggers actions related to subtasks, including hiding buttons and adding new subtasks.
 * @function
 */
function subtasktrigger() {
  hideSubTaskAddBtn();
  deleteInputSubTask();
  addSubTask();
}

/**
 * Creates a contact element for displaying in the dropdown.
 * @function
 * @param {Object} element - The contact object containing contact details.
 * @returns {HTMLElement} The DOM element representing the contact.
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
 * Renders the list of contacts in a dropdown element.
 * @function
 * @param {Array<Object>} contacts - The array of contact objects to be rendered.
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
 * Loads contact data from the database.
 * @async
 * @function
 * @returns {Promise<Array<Object>>} An array of contact objects.
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
 * Loads and renders sorted contact data.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function loadContacts() {
  let contactsData = await loadContactsData();
  let sortedContacts = sortContacts(contactsData);
  renderContacts(sortedContacts);
  subtasktrigger();
}

/**
 * Loads and renders sorted contact data for a specific task being edited.
 * @async
 * @function
 * @param {string} taskId - The ID of the task being edited.
 * @returns {Promise<void>}
 */
async function loadContactsForEdit(taskId) {
  let contactsData = await loadContactsData();
  let sortedContacts = sortContacts(contactsData);
  renderContactsforEdit(sortedContacts, taskId);
}

/**
 * Renders the list of contacts for a specific task being edited.
 * @function
 * @param {Array<Object>} contacts - The array of contact objects to be rendered.
 * @param {string} taskId - The ID of the task being edited.
 */
function renderContactsforEdit(contacts, taskId) {
  let dropdown = document.getElementById("dropDownBodyId");
  dropdown.innerHTML = "";
  const task = tasks.find((t) => t.id === taskId);
  const assignedContactKeys = Array.isArray(task.task.assignet)
    ? task.task.assignet.map((contact) => contact.key)
    : [];
  contacts.forEach((element) => {
    let container = createContactElementforEdit(element, taskId);
    dropdown.appendChild(container);
    const checkbox = container.querySelector(`input[type="checkbox"]`);
    if (assignedContactKeys.includes(element.id)) {
      checkbox.checked = true;
      whenChecked(element);}
    startEvent(element);});
}

/**
 * Handles updates when a contact is checked.
 * @function
 * @param {Object} contactId - The contact object of the checked contact.
 */
function whenChecked(contactId) {
  let ck = document.getElementById(`CheckboxID${contactId.id}`);
  let container = document.getElementById(`ContainerID${contactId.id}`);
  let text = document.getElementById("dinamicText");
  let assigneeElement = document.getElementById("whoIsAssignet");

  updateTextAndClearAssignees(text, assigneeElement, checked.length);

  handleCheckboxState(ck, container, contactId);

  renderAssignees(checked, assigneeElement, maxDisplay);
}

/**
 * Creates a contact element for editing a task.
 * @param {Object} element - The contact element data.
 * @param {string} taskId - The ID of the task associated with the contact.
 * @returns {HTMLElement} The generated contact container element.
 */
function createContactElementforEdit(element, taskId) {
  const container = initializeContainer(element.id);
  const initials = getContactInitials(element.cont.name);
  const color = getColorForInitial(initials[0]);
  container.innerHTML = dropDownContactNameHTML(element, color, initials, taskId);
  return container;
}

/**
 * Initializes the container element with required attributes and styles.
 * @param {string} id - The ID for the container.
 * @returns {HTMLElement} The initialized container element.
 */
function initializeContainer(id) {
  const container = document.createElement("label");
  container.id = `ContainerID${id}`;
  container.classList.add("dropDownContactContainer");
  return container;
}

/**
 * Extracts the initials from a contact name.
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials of the contact.
 */
function getContactInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2);
}


/**
 * Adds an event listener to a checkbox associated with a specific contact.
 * @param {Object} contactId - An object representing the contact.
 * @param {string} contactId.id - The ID of the contact.
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
 * Fetches all contacts from the specified API endpoint.
 * @param {string} [path=""] - The path to append to the base URL.
 * @returns {Promise<Object>} A promise that resolves to the JSON response.
 */
async function getAllContacts(path = "") {
  let response = await fetch(`${BASE_URL}` + path + ".json");
  return (responseJs = await response.json());
}

let checked = [];

/**
 * Resets the form and updates related UI components.
 * @param {Event} event - The event triggered by form submission.
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

const maxDisplay = 3;

/**
 * Updates the text and clears the assignee list if no contacts are selected.
 * @param {HTMLElement} textElement - The element to update the text content.
 * @param {HTMLElement} assigneeElement - The element to clear the assignee list.
 * @param {number} checkedLength - The number of selected contacts.
 */
function updateTextAndClearAssignees(
  textElement,
  assigneeElement,
  checkedLength
) {
  if (checkedLength === 0) {
    textElement.innerHTML = "Select contacts to assign";
    assigneeElement.innerHTML = "";
  } else {
    textElement.innerHTML = "An |";
  }
}

/**
 * Handles the checkbox state and updates the UI and checked contacts list.
 * @param {HTMLInputElement} ck - The checkbox element.
 * @param {HTMLElement} container - The container element associated with the contact.
 * @param {Object} contactId - An object representing the contact.
 */
function handleCheckboxState(ck, container, contactId) {
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
}

/**
 * Generates initials from checked contacts and appends them to the assignee element.
 * @param {Array} checked - The list of checked contacts.
 * @param {HTMLElement} assigneeElement - The element to append the initials.
 * @param {number} maxCount - The maximum number of initials to display.
 */
function generateInitialsHTML(checked, assigneeElement, maxCount) {
  checked.slice(0, maxCount).forEach((element) => {
    let initials = element.name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("")
      .slice(0, 2);
    let color = getColorForInitial(initials[0]);
    assigneeElement.innerHTML += `<p class="firstLetterCircle" style="background-color: ${color};">${initials}</p>`;
  });
}

/**
 * Generates a visual element for the remaining count of contacts not displayed.
 * @param {Array} checked - The list of checked contacts.
 * @param {HTMLElement} assigneeElement - The element to append the remaining count.
 * @param {number} maxCount - The maximum number of initials to display.
 */
function generateRemainingCountHTML(checked, assigneeElement, maxCount) {
  const remainingCount = checked.length - maxCount;
  if (remainingCount > 0) {
    assigneeElement.innerHTML += `
      <div class="firstLetterCircle" style="background: linear-gradient(135deg,rgba(123, 97, 119, 0.81) 0%,rgb(36, 178, 29) 100%);">
        +${remainingCount}
      </div>
    `;
  }
}

/**
 * Renders assignee initials and additional count if applicable.
 * @param {Array} checked - The list of checked contacts.
 * @param {HTMLElement} assigneeElement - The element to render assignees.
 * @param {number} maxCount - The maximum number of initials to display.
 */
function renderAssignees(checked, assigneeElement, maxCount) {
  assigneeElement.innerHTML = ""; // Clear existing content
  if (checked.length > maxCount) {
    generateInitialsHTML(checked, assigneeElement, maxCount);
    generateRemainingCountHTML(checked, assigneeElement, maxCount);
  } else {
    generateInitialsHTML(checked, assigneeElement, checked.length);
  }
}

let subtasks = [];

/**
 * Hides the "Add SubTask" button and displays the next step button.
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
 * Resets the subtask input and toggles the visibility of buttons.
 */
function hideEditAddBtn() {
  document.getElementById("AddSubTaskStep1").classList.remove("dNone");
  document.getElementById("AddSubTaskStep2").classList.add("dNone");
  let inputText = document.getElementById("inputSubTask");
  inputText.value = "";
}

/**
 * Clears the subtask input value and resets the edit button state.
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
 * Adds a new subtask to the list and re-renders the subtasks.
 */
function addSubTask() {
  let btn = document.getElementById("AddSubTaskStep2Add");
  let inputText = document.getElementById("inputSubTask");
  btn.addEventListener("click", () => {
    if (inputText.value) {
      subtasks.push({ name: inputText.value, checked: false });
    }
    hideEditAddBtn();
    rendSubTask();
  });
}

/**
 * Applies a background style to a specific subtask during editing.
 * @param {number} index - The index of the subtask to style.
 */
function backgroundEdit(index) {
  let conteinerId = document.getElementById(`subtaskContainerId${index}`);
  conteinerId.classList.add("backgroundSubTaskEdit");
}

/**
 * Renders the list of subtasks in the UI.
 */
function rendSubTask() {
  let toRender = document.getElementById("renderSubTask");
  toRender.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    toRender.innerHTML += rendsubtaskHTML(subtask, index);
  });
}

/**
 * Handles the form submission event.
 * @param {Event} event - The form submission event.
 */
function handleFormSubmit(event) {
  event.preventDefault();
  requiredValidation();
}
