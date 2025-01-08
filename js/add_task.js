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
 * Sorts an array of contact objects alphabetically by name.
 * @function
 * @param {Array<Object>} contacts - The array of contact objects to be sorted.
 * @returns {Array<Object>} Sorted array of contact objects.
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
    ? task.task.assignet.map((contact) => contact.key): [];
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
 * Creates a contact element for editing in the dropdown.
 * @function
 * @param {Object} element - The contact object containing contact details.
 * @param {string} taskId - The ID of the task being edited.
 * @returns {HTMLElement} The DOM element representing the contact for editing.
 */
function createContactElementforEdit(element, taskId) {
  let container = document.createElement("label");
  container.id = `ContainerID${element.id}`;
  container.classList.add("dropDownContactContainer");

  let initials = element.cont.name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2);

  let color = getColorForInitial(initials[0]);
  container.innerHTML = dropDownContactNameHTML(element,color,initials,taskId);
  return container;
}

/**
 * Returns a color code for the given initial.
 * @function
 * @param {string} initial - The initial character for which to get the color.
 * @returns {string} The color code corresponding to the initial.
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
 * Deletes a subtask by index and re-renders the subtasks.
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubTask(index) {
  subtasks.splice(index, 1);
  rendSubTask();
}

/**
 * Edits an existing subtask by index and enables editing mode.
 * @param {number} index - The index of the subtask to edit.
 */
function editAddedSubTask(index) {
  let inputToEdit = document.getElementById(`toEditInputSubTask-${index}`);
  inputToEdit.classList.remove("inputsubTask");
  inputToEdit.classList.add("inputsubTaskActive");
  backgroundEdit(index);
  changeEditWithCheck(index);
  inputToEdit.removeAttribute("readonly");
  inputToEdit.value = subtasks[index].name;
  subtasks[index].name = inputToEdit.value;
}

/**
 * Changes the edit button to a save button for a specific subtask.
 * @param {number} index - The index of the subtask to update.
 */
function changeEditWithCheck(index) {
  document.getElementById(`AddSubTaskStep2-${index}`).classList.remove("dNone");
  document.getElementById(`subTaskEditBtn-${index}`).classList.add("dNone");
  document.getElementById(`idSpanSubTaskEdit${index}`).classList.add("dNone");
}

/**
 * Saves edits to a subtask or deletes it if the input is empty.
 * @param {number} index - The index of the subtask to update.
 */
function addEditcheck(index) {
  let btn = document.getElementById(`AddSubTaskStep2-${index}`);
  let inputText = document.getElementById(`toEditInputSubTask-${index}`);
  btn.addEventListener("click", () => {
    if (inputText.value) {
      subtasks[index].name = inputText.value;
      rendSubTask();
    } else {
      deleteSubTask(index);
    }
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
 * Uploads data to Firebase.
 * @param {string} [path=""] - The path to append to the base URL.
 * @param {Object} [data={}] - The data to upload.
 * @returns {Promise<Object>} A promise that resolves to the JSON response.
 */
async function uploadToFireBase(path = "", data = {}) {
  let response = await fetch(`${BASE_URL}` + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseJs = await response.json());
}

/**
 * Retrieves the value of the selected priority radio button.
 * @returns {string} The value of the selected priority.
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
 * Retrieves the task details from the form inputs.
 * @returns {Object} The task details.
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
  return {title,description,assignet,date,prio,category,subtask: subtasks, };
}

/**
 * Handles the form submission event.
 * @param {Event} event - The form submission event.
 */
function handleFormSubmit(event) {
  event.preventDefault();
  requiredValidation();
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
