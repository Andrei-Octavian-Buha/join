/**
 * Displays the overlay for adding a new task.
 */
function showOverlayAddTask() {
  let template = document.getElementById("add-task-template");
  template.classList.remove("dNone");
  template.innerHTML += addTaskTemplate();
  setupDropdownEvents();
  loadContacts();
  onlyToDay();
}

/**
 * Sets the minimum date value for the task date input to today.
 */
function onlyToDay() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("addTaskDate").setAttribute("min", today);
}

/**
 * Sets up the event listeners for the dropdown menu.
 */
function setupDropdownEvents() {
  const dropDownHeader = document.getElementById("dropDownHeaderId");
  const dropDownBody = document.getElementById("dropDownBodyId");
  const dropDownArrow = dropDownHeader?.querySelector("img");

  dropDownHeader.addEventListener("click", () => {
    dropDownBody.classList.toggle("dNone");

    if (!dropDownBody.classList.contains("dNone")) {
      dropDownArrow.style.transform = "rotate(180deg)";
    } else {
      dropDownArrow.style.transform = "rotate(0deg)";
    }
  });
}

/**
 * Hides the overlay for adding a new task and clears the template content.
 */
function hideOverlayAddTask() {
  let template = document.getElementById("add-task-template");
  template.innerHTML = "";
  template.classList.add("dNone");
  checked = [];
  subtasks = [];
}

/**
 * Displays the overlay with the task info card.
 */
function showOverlayInfoCard() {
  const overlay = document.getElementById("overlay");
  const card = document.getElementById("taskInfoCard");
  overlay.style.display = "block";
  card.classList.add("showCard");
  overlay.addEventListener("click", closeOverlayInfoCard);
}

/**
 * Hides the task info card overlay and resets the task display.
 */
function hideOverlayInfoCard() {
  hideOverlayAndCard();
  clearSearchInput();
  resetTaskDisplay();
  finalizeTaskActions();
}

/**
 * Hides the overlay and task info card.
 */
function hideOverlayAndCard() {
  const overlay = document.getElementById("overlay");
  const card = document.getElementById("taskInfoCard");
  overlay.style.display = "none";
  card.classList.remove("showCard");
  card.classList.add("hideCard");
  setTimeout(() => {
    card.classList.remove("hideCard");
  }, 500);
}

/**
 * Clears the value of the search input field.
 */
function clearSearchInput() {
  const searchInputElement = document.querySelector(".searchinput");
  if (searchInputElement) {
    searchInputElement.value = "";
  }
}

/**
 * Resets the task display by showing all tasks in all columns.
 */
function resetTaskDisplay() {
  const categories = [
    "todoColumn",
    "inprogressColumn",
    "awaitfeedbackColumn",
    "doneColumn",
  ];
  categories.forEach((category) => {
    const container = document.getElementById(category);
    if (container) {
      const tasks = container.querySelectorAll(".boardTaskCard");
      tasks.forEach((task) => {
        task.style.display = "";});}
      });
}

/**
 * Finalizes task actions, resetting task-related variables.
 */
function finalizeTaskActions() {
  checked = [];
  taskInit();
}

/**
 * Closes the task info card overlay and clears its content.
 */
function closeOverlayInfoCard() {
  hideOverlayInfoCard();
  taskInit();
  const card = document.getElementById("taskInfoCard");
  card.innerHTML = "";
}

/**
 * Hides the list card element.
 */
function hideshowListCard() {
  document.getElementById("showListCard").classList.add("dNone");
}

let subtasksEditCard = [];

/**
 * Adds a subtask to the current task if not already present.
 */
function addEditSubTask() {
  if (!currentTask.task.subtask) {
    currentTask.task.subtask = [];
  }
  subtasksEditCard = currentTask.task.subtask;
  let inputText = document.getElementById("inputSubTask");
  if (inputText.value) {
    subtasksEditCard.push({ name: inputText.value, checked: false });
    rendEditSubTask(currentTask);
    hideEditAddBtn();
  }
}

/**
 * Renders the subtasks for editing.
 * @param {Object} task - The task containing the subtasks.
 */
function rendEditSubTask(task) {
  subtasks = task.task.subtask;
  let toRender = document.getElementById("renderSubTask2");
  toRender.innerHTML = "";
  if (subtasks) {
    subtasks.forEach((subtask, index) => {
      toRender.innerHTML += rendEditSubTaskHtml(subtask, index);
    });
  }
}

/**
 * Deletes a subtask from the list based on the index.
 * @param {number} index - The index of the subtask to be deleted.
 */
function deleteEditTask(index) {
  subtasks.splice(index, 1);
  rendEditSubTask({ task: { subtask: subtasks } });
}

/**
 * Adds a click event listener to a subtask input to update or delete it.
 * @param {number} index - The index of the subtask to be edited.
 */
function addEditSubTaskcheck(index) {
  let btn = document.getElementById(`AddSubTaskStep2-${index}`);
  let inputText = document.getElementById(`toEditInputSubTask-${index}`);
  btn.addEventListener("click", () => {
    if (inputText.value) {
      subtasks[index].name = inputText.value;
      rendEditSubTask({ task: { subtask: subtasks } });
    } else {
      deleteEditTask(index);
    }
  });
}

/**
 * Updates a task on Firebase.
 * @param {Object} task - The task to be updated.
 * @returns {Promise<Object>} - The updated task.
 * @throws {Error} - Throws an error if the update fails.
 */
async function updateTaskOnFireBase(task) {
  const taskData = prepareTaskData(task);
  try {
    const updatedTask = await sendTaskUpdateRequest(task, taskData);
    return updatedTask;
  } catch (error) {
    handleTaskUpdateError(error);
    throw error;
  }
}

/**
 * Prepares the task data for updating.
 * @param {Object} task - The task to prepare data for.
 * @returns {Object} - The prepared task data.
 */
function prepareTaskData(task) {
  const taskData = getValue(task);
  return {
    title: taskData.title,
    description: taskData.description,
    assignet: taskData.assignet,
    date: taskData.date,
    prio: taskData.prio,
    category: taskData.category,
    subtask: taskData.subtask,
    progress: taskData.progress,
  };
}

/**
 * Sends the task update request to Firebase.
 * @param {Object} task - The task to be updated.
 * @param {Object} taskData - The prepared task data.
 * @returns {Promise<Object>} - The updated task from Firebase.
 * @throws {Error} - Throws an error if the request fails.
 */
async function sendTaskUpdateRequest(task, taskData) {
  const response = await fetch(`${BASE_URL}/task/${task}.json`, {
    method: "PUT",
    body: JSON.stringify(taskData),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Fehler beim Speichern der Kontaktdaten");
  }
  return await response.json();
}

/**
 * Handles errors during task update.
 * @param {Error} error - The error to be handled.
 */
function handleTaskUpdateError(error) {
  console.error("Fehler beim Aktualisieren des Kontakts:", error);
}

/**
 * Performs task update and reinitializes the task list.
 * @param {Object} task - The task to be updated.
 */
async function toDoForUpdateTaskOnFireBase(task) {
  await updateTaskOnFireBase(task);
  await taskInit();
  listDataCard(task);
}

/**
 * Finds a task by its ID.
 * @param {string} taskid - The ID of the task to find.
 * @returns {Object|null} - The found task or null if not found.
 */
function findTaskById(taskid) {
  const task = tasks.find((t) => t.id === taskid);
  if (!task) return null;
  return task;
}

/**
 * Retrieves the values from the task input fields.
 * @returns {Object} - The values from the task input fields.
 */
function getTaskInputValues() {
  return {
    title: document.getElementById("addTaskTittle").value,
    description: document.getElementById("addTaskDescription").value,
    date: document.getElementById("addTaskDate").value,
    prio: getPriorityValue(),
    subtask: subtasks,
  };
}

/**
 * Retrieves the assignee value for a task.
 * @param {Object} task - The task to retrieve the assignee for.
 * @returns {Array} - The assignee list for the task.
 */
function getAssignetValue(task) {
  return checked && checked.length > 0 ? checked : task.task.assignet;
}

/**
 * Retrieves the value of a task by its ID.
 * @param {string} taskid - The ID of the task.
 * @returns {Object} - The task data or undefined if the task is not found.
 */
function getValue(taskid) {
  const task = findTaskById(taskid);
  if (!task) return;
  const inputValues = getTaskInputValues();
  const assignet = getAssignetValue(task);
  return {
    title: inputValues.title,
    description: inputValues.description,
    assignet: assignet,
    date: inputValues.date,
    prio: inputValues.prio,
    subtask: inputValues.subtask,
    progress: task.task.progress,
    category: task.task.category,};
}

const columnsOrder = [
  "todoColumn",
  "inprogressColumn",
  "awaitfeedbackColumn",
  "doneColumn",
];

/**
 * Moves a task card up in the task columns.
 * @param {string} taskId - The ID of the task to move.
 */
function moveCardUp(taskId) {
  const taskCard = document.getElementById(taskId);
  const currentColumn = taskCard.closest(".drag-area").id;
  const currentIndex = columnsOrder.indexOf(currentColumn);
  if (currentIndex > 0) {
    const targetColumn = document.getElementById(
      columnsOrder[currentIndex - 1]
    );
    targetColumn.appendChild(taskCard);
    updateArrowVisibility(taskId);
    updateArrowVisibilityForAll();
    updateEmptyColumnMessages();
  }
}

/**
 * Moves a task card down in the task columns.
 * @param {string} taskId - The ID of the task to move.
 */
function moveCardDown(taskId) {
  const taskCard = document.getElementById(taskId);
  const currentColumn = taskCard.closest(".drag-area").id;
  const currentIndex = columnsOrder.indexOf(currentColumn);
  if (currentIndex < columnsOrder.length - 1) {
    const targetColumn = document.getElementById(
      columnsOrder[currentIndex + 1]
    );
    targetColumn.appendChild(taskCard);
    updateArrowVisibility(taskId);
    updateArrowVisibilityForAll();
    updateEmptyColumnMessages();
  }
}

/**
 * Updates the visibility of the arrows for all tasks.
 */
function updateArrowVisibilityForAll() {
  const allTasks = [...document.querySelectorAll(".boardTaskCard")];
  allTasks.forEach((task) => {
    updateArrowVisibility(task.id);
  });
}

/**
 * Updates the visibility of the arrows for a specific task.
 * @param {string} taskId - The ID of the task to update.
 */
function updateArrowVisibility(taskId) {
  const taskCard = document.getElementById(taskId);
  const currentColumn = taskCard.closest(".drag-area").id;
  const arrowUp = taskCard.querySelector(".arrow-up");
  const arrowDown = taskCard.querySelector(".arrow-down");
  const currentIndex = columnsOrder.indexOf(currentColumn);
  if (currentIndex === 0) {
    arrowUp.style.display = "none";
  } else {
    arrowUp.style.display = "inline";
  }
  if (currentIndex === columnsOrder.length - 1) {
    arrowDown.style.display = "none";
  } else {
    arrowDown.style.display = "inline";
  }
}

/**
 * Initializes the board after the page is loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initializeBoard, 100);
});

/**
 * Initializes the task board by updating arrow visibility.
 */
function initializeBoard() {
  const allTasks = [...document.querySelectorAll(".boardTaskCard")];

  allTasks.forEach((task) => {
    updateArrowVisibility(task.id);
  });
}
