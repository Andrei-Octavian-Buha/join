/**
 * Initializes the task by loading contacts.
 * @returns {Promise<void>} A promise that resolves when the contacts are loaded.
 */
async function taskInit() {
  await loadContactss();
}

/**
 * Fetches all contacts from a given path.
 * @param {string} [path=""] The path to fetch contacts from.
 * @returns {Promise<Object>} The response data as a JSON object.
 */
async function getAllContacts(path = "") {
  let response = await fetch(`${BASE_URL}` + path + ".json");
  return (responseJs = await response.json());
}

let tasks = [];

/**
 * Loads task data by fetching from the server and mapping the response.
 * @returns {Promise<Array>} A list of tasks.
 */
async function loadTaskData() {
  let ContactResponse = await getAllContacts("task");
  let UserKeyArray = Object.keys(ContactResponse);
  tasks = UserKeyArray.map((id) => ({
    id: id,
    task: ContactResponse[id],
  }));
  return tasks;
}

/**
 * Loads the task data, resets columns, distributes tasks, and updates the UI.
 * @returns {Promise<void>} A promise that resolves when the tasks are loaded and the UI is updated.
 */
async function loadContactss() {
  let tasksData = await loadTaskData();
  resetColumns();
  distributeTasks(tasksData);
  updateTasksUI(tasksData);
}

/**
 * Resets the content of all task columns.
 */
function resetColumns() {
  let todoId = document.getElementById("todoColumn");
  let awaitfeedbackId = document.getElementById("awaitfeedbackColumn");
  let inprogressId = document.getElementById("inprogressColumn");
  let doneId = document.getElementById("doneColumn");

  todoId.innerHTML = "";
  awaitfeedbackId.innerHTML = "";
  inprogressId.innerHTML = "";
  doneId.innerHTML = "";
}

/**
 * Distributes tasks into the appropriate columns based on their progress.
 * @param {Array} tasksData The list of tasks to distribute.
 */
function distributeTasks(tasksData) {
  let todoId = document.getElementById("todoColumn");
  let awaitfeedbackId = document.getElementById("awaitfeedbackColumn");
  let inprogressId = document.getElementById("inprogressColumn");
  let doneId = document.getElementById("doneColumn");

  tasksData.forEach((task) => {
    if (task.task.progress === "todo") {
      todoId.innerHTML += renderCard(task);
    } else if (task.task.progress === "awaitfeedback") {
      awaitfeedbackId.innerHTML += renderCard(task);
    } else if (task.task.progress === "inprogress") {
      inprogressId.innerHTML += renderCard(task);
    } else if (task.task.progress === "done") {
      doneId.innerHTML += renderCard(task);
    }
    nullSubtask(task);
  });
}

/**
 * Updates the UI for all tasks and their associated columns.
 * @param {Array} tasksData The list of tasks to update in the UI.
 */
function updateTasksUI(tasksData) {
  updateEmptyColumnMessages(tasksData);
  tasksData.forEach((task) => {
    showAssignet(task);
  });
}

/**
 * Updates the messages in empty columns to notify the user.
 * @param {Array} tasksData The list of tasks to check for empty columns.
 */
function updateEmptyColumnMessages(tasksData) {
  const columns = [
    { columnId: "todoColumn", messageClass: "no-tasks-message" },
    { columnId: "awaitfeedbackColumn", messageClass: "no-tasks-message" },
    { columnId: "inprogressColumn", messageClass: "no-tasks-message" },
    { columnId: "doneColumn", messageClass: "no-tasks-message" },
  ];
  columns.forEach(({ columnId, messageClass }) => {
    const column = document.getElementById(columnId);
    const messageDiv = column
      .closest(".column")
      .querySelector(`.${messageClass}`);
    if (!column.innerHTML.trim()) {
      messageDiv.style.display = "flex";
    } else {
      messageDiv.style.display = "none";
    }
  });
}

/**
 * Converts the category number of a task to its corresponding category name.
 * @param {Object} task The task object.
 * @returns {string} The category name.
 */
function fromNumberToName(task) {
  let categoryName;
  if (task.task.category == 1) {
    categoryName = "Technical Task";
  } else if (task.task.category == 2) {
    categoryName = "User Story";
  }
  return categoryName;
}

/**
 * Truncates a string to a specified maximum length and adds ellipsis if necessary.
 * @param {string} text The text to truncate.
 * @param {number} maxLength The maximum length of the text.
 * @returns {string} The truncated text.
 */
function truncateText(text, maxLength) {
  if (!text || typeof text !== "string") {
    return "";
  }
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

/**
 * Handles the null or empty subtask scenario by updating the progress bar display.
 * @param {Object} task The task object.
 */
function nullSubtask(task) {
  let progsBar = document.getElementById(`progBar-${task.id}`);
  if (!task.task.subtask || task.task.subtask.length === 0) {
    progsBar.classList.remove("progresBar");
    progsBar.classList.add("dNone");
  }
}

/**
 * Calculates the percentage of completed subtasks.
 * @param {Object} task The task object.
 * @returns {number} The completion percentage.
 */
function calculatePercentage(task) {
  let x = howManyAreChecked(task);
  let y = showSubTasks(task);
  let z = (x / y) * 100;
  return z;
}

/**
 * Counts how many subtasks are marked as checked.
 * @param {Object} task The task object.
 * @returns {number} The number of checked subtasks.
 */
function howManyAreChecked(task) {
  if (task && task.task.subtask && Array.isArray(task.task.subtask)) {
    const checkedCount = task.task.subtask.filter(
      (sub) => sub.checked === true
    ).length;
    return checkedCount;
  } else {
    return 0;
  }
}

/**
 * Retrieves the number of subtasks associated with a task.
 * @param {Object} task The task object.
 * @returns {number|string} The number of subtasks or "0" if none.
 */
function showSubTasks(task) {
  if (task.task.subtask && task.task.subtask.length > 0) {
    return task.task.subtask.length;
  } else {
    return "0";
  }
}

/**
 * Creates initials from a given name by taking the first two letters.
 * @param {string} name The name to create initials from.
 * @returns {string} The initials of the name.
 */
function createInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2);
}

/**
 * Renders the assigned person circle with their initials and background color.
 * @param {Object} person The person object containing their name and key.
 * @param {HTMLElement} asignedDiv The div to append the rendered circle to.
 */
function renderAssignedPerson(person, asignedDiv) {
  const initials = createInitials(person.name);
  const color = getColorForInitial(initials[0]);

  asignedDiv.innerHTML += `
    <div id="${person.key}" class="assignetPersonKreis" style="background-color: ${color};">
      ${initials}
    </div>
  `;
}

/**
 * Renders a remaining count of assigned people.
 * @param {number} remainingCount The number of remaining assigned people.
 * @param {HTMLElement} asignedDiv The div to append the rendered remaining count to.
 */
function renderRemainingCount(remainingCount, asignedDiv) {
  asignedDiv.innerHTML += `
    <div class="assignetPersonKreis" style="background: linear-gradient(135deg,rgba(123, 97, 119, 0.81) 0%,rgb(36, 178, 29) 100%);">
      +${remainingCount}
    </div>
  `;
}

/**
 * Displays the assigned persons for a given task.
 * @param {Object} task The task object.
 */
function showAssignet(task) {
  let asignedDiv = document.getElementById(`asigned${task.id}`);
  if (!asignedDiv) {
    return;
  }
  asignedDiv.innerHTML = "";
  let assigned = task.task.assignet;
  if (!assigned || assigned.length === 0) {
    return;
  }
  const maxVisible = 3;
  assigned.forEach((person, index) => {
    if (index < maxVisible) {
      renderAssignedPerson(person, asignedDiv);
    }
  });
  if (assigned.length > maxVisible) {
    const remainingCount = assigned.length - maxVisible;
    renderRemainingCount(remainingCount, asignedDiv);
  }
}

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
    R: "#CCFF33",
    S: "#66CC33",
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
 * Displays the appropriate priority icon based on the task's priority.
 * @param {Object} task The task object.
 * @returns {string} The HTML string for the priority icon.
 */
function showPrioIcon(task) {
  let prio = task.task.prio;
  let iconPath;
  if (prio == "low") {
    iconPath = "./assets/priority/prioCard/lowCard.svg";
  } else if (prio == "medium") {
    iconPath = "./assets/priority/prioCard/mediumCard.svg";
  } else if (prio == "urgent") {
    iconPath = "./assets/priority/prioCard/urgentCard.svg";
  }
  return `<img src="${iconPath}" alt="${prio} priority icon" style="width:20px; height:20px;">`;
}

/**
 * Deletes a task from the database.
 * @param {string} contactId The ID of the task to delete.
 * @returns {Promise<void>} A promise that resolves when the task is deleted.
 */
async function deleteTask(contactId) {
  try {
    const response = await fetch(`${BASE_URL}/task/${contactId}.json`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Fehler beim Löschen des Kontakts");
    }
    taskInit();
    hideOverlayInfoCard();
  } catch (error) {}
}

let currentTask = null;

/**
 * Edits the data card of a task by displaying its information and allowing modifications.
 * @param {string} taskId The ID of the task to edit.
 */
function editListDataCard(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  currentTask = task;
  if (!task) return;
  let cardRender = document.getElementById("taskInfoCard");
  cardRender.innerHTML = "";
  cardRender.innerHTML += showEditCard(task);
  showAssignet(task);
  setupDropdownEvents();
  rendEditSubTask(task);
  loadContactsForEdit(taskId);
  onlyToDay();
}

/**
 * Displays the information card of a task when clicked.
 * @param {string} taskId The ID of the task to view.
 */
function listDataCard(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;
  showOverlayInfoCard();
  let cardRender = document.getElementById("taskInfoCard");
  cardRender.innerHTML = "";
  cardRender.innerHTML += showInfoCard(task);
  showInfoAssignet(task);
  showSubTasksString(task);
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} text The text to capitalize.
 * @returns {string} The capitalized text.
 */
function capitalizeFirstLetter(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Displays the subtasks of a task in a list.
 * @param {Object} task The task object.
 */
function showSubTasksString(task) {
  let subtasks = task.task.subtask;
  let subtasklist = document.getElementById("subtaskList");
  subtasklist.innerHTML = "";
  if (subtasks && subtasks.length > 0) {
    subtasks.forEach((subtask, subtaskIndex) => {
      const checkboxSrc = subtask.checked
        ? "checkbox-checked.svg"
        : "checkbox.svg";
      subtasklist.innerHTML += `
        <div class="subtaskItem">
            <img src="./assets/subtask/${checkboxSrc}" alt="" class="cursor" onclick="toggleImage(this, '${task.id}' ,'${subtaskIndex}')" data-index="${subtaskIndex}"  id="checkbox" />${subtask.name}
        </div>`;
    });
  } else {
    subtasklist.innerHTML = "<p>No subtasks available.</p>";
  }
}

/**
 * Toggles the checkbox image for a subtask and updates its status.
 * @param {HTMLElement} imageElement The image element representing the checkbox.
 * @param {string} taskId The ID of the task.
 * @param {number} subtaskIndex The index of the subtask.
 */
function toggleImage(imageElement, taskId, subtaskIndex) {
  const checkedSrc = "checkbox-checked.svg";
  const uncheckedSrc = "checkbox.svg";
  const currentSrc = imageElement.src.split("/").pop();
  let isChecked;
  if (currentSrc === uncheckedSrc) {
    imageElement.src = "./assets/subtask/" + checkedSrc;
    isChecked = true;
  } else {
    imageElement.src = "./assets/subtask/" + uncheckedSrc;
    isChecked = false;
  }
  updateCheckedSubTask(taskId, subtaskIndex, isChecked);
}

/**
 * Updates the status of a subtask and saves it to the database.
 * @param {string} taskId The ID of the task.
 * @param {number} subtaskIndex The index of the subtask.
 * @param {boolean} isChecked The checked status of the subtask.
 * @returns {Promise<Object>} The updated task data.
 */
async function updateCheckedSubTask(taskId, subtaskIndex, isChecked) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;
  task.task.subtask[subtaskIndex].checked = isChecked;
  let sendDataToFirebase = task.task;
  try {
    const response = await fetch(`${BASE_URL}/task/${taskId}.json`, {
      method: "PUT",
      body: JSON.stringify(sendDataToFirebase),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Fehler beim Speichern der Kontaktdaten");
    }
    const updatedContact = await response.json();
    return updatedContact;
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kontakts:", error);
    throw error;
  }
}

/**
 * Displays the assigned people for a task in the info card.
 * @param {Object} task The task object.
 */
function showInfoAssignet(task) {
  let asignedDiv = document.getElementById(`asignedd${task.id}`);
  if (!asignedDiv) {
    return;
  }
  asignedDiv.innerHTML = "";
  let assigned = task.task.assignet;
  if (!assigned || assigned.length === 0) {
    return;
  }
  if (assigned) {
    assigned.forEach((person) => {
      let initials = person.name
        .split(" ")
        .map((word) => word[0].toUpperCase())
        .join("")
        .slice(0, 2);
      let color = getColorForInitial(initials[0]);
      asignedDiv.innerHTML += `
      <div class="dflex" style="gap:16px;">
                <div id="${person.key}" class="assignetPersonKreis" style="background-color: ${color};">
          ${initials}
        </div>
        <span>${person.name}</span>
      </div>
      `;
    });
  } else {
    return "don't Assignet Person";
  }
}
