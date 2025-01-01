/**
 * Loads tasks from Firebase and updates the HTML UI.
 * @async
 * @function
 */
async function loadTasksFromFirebase() {
  try {
    const response = await fetch(
      "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/task.json"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (data && Object.keys(data).length > 0) {
      updateHTML(data);
    } else {
      console.warn("No tasks found.");
    }
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

/**
 * Gets the value of the search input field and converts it to lowercase.
 * @param {string} selector - The CSS selector of the search input element.
 * @returns {string} The lowercase value of the search input.
 */
function getSearchInput(selector) {
  const input = document.querySelector(selector);
  return input ? input.value.toLowerCase() : "";
}

/**
 * Filters tasks in a specific category based on the search input.
 * @param {string} containerId - The ID of the container element.
 * @param {string} searchInput - The search input string to filter tasks by.
 */
function filterTasksInCategory(containerId, searchInput) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container with ID '${containerId}' not found.`);
    return;
  }

  const tasks = container.querySelectorAll(".boardTaskCard");

  tasks.forEach((task) => {
    const taskTitle = task
      .querySelector(".boardCardTitle")
      ?.textContent.toLowerCase();
    const taskDescription = task
      .querySelector(".boardCardDescription")
      ?.textContent.toLowerCase();

    if (
      taskTitle?.includes(searchInput) ||
      taskDescription?.includes(searchInput)
    ) {
      task.style.display = "";
    } else {
      task.style.display = "none";
    }
  });
}

/**
 * Filters tasks in all categories based on the search input.
 * @param {Array<string>} categories - Array of category IDs to filter tasks in.
 * @param {string} searchInput - The search input string to filter tasks by.
 */
function filterTasksInAllCategories(categories, searchInput) {
  categories.forEach((category) => {
    filterTasksInCategory(category, searchInput);
  });
}

/**
 * Filters tasks based on the search input across all columns.
 */
function filterTasks() {
  const searchInput = getSearchInput(".searchinput");
  const categories = [
    "todoColumn",
    "inprogressColumn",
    "awaitfeedbackColumn",
    "doneColumn",
  ];
  filterTasksInAllCategories(categories, searchInput);
}

let currentDraggedElement;

/**
 * Starts dragging a task element.
 * @param {Event} event - The drag event.
 * @param {string} id - The ID of the task element being dragged.
 */
function dragStart(event, id) {
  currentDraggedElement = document.querySelector(`#${id}`);
  event.dataTransfer.setData("text", id);
  event.target.style.opacity = "0.5";
}

/**
 * Ends dragging a task element.
 * @param {Event} event - The drag event.
 */
function dragEnd(event) {
  event.target.style.opacity = "1";
}

/**
 * Allows dropping of elements during drag-and-drop.
 * @param {Event} event - The drop event.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Retrieves the target column element for a task.
 * @param {string} category - The ID of the target column.
 * @returns {Element|null} The target column element or null if not found.
 */
function getTargetColumn(category) {
  const targetColumn = document.getElementById(category);
  if (!targetColumn) {
    console.error("Invalid target column:", category);
  }
  return targetColumn;
}

/**
 * Maps a column ID to its corresponding progress status.
 * @param {string} category - The ID of the category (column).
 * @returns {string|null} The corresponding progress status or null if invalid.
 */
function getNewProgress(category) {
  const progressMapping = {
    todoColumn: "todo",
    inprogressColumn: "inprogress",
    awaitfeedbackColumn: "awaitfeedback",
    doneColumn: "done",
  };

  const newProgress = progressMapping[category];
  if (!newProgress) {
    console.error("Invalid category:", category);
  }
  return newProgress;
}

/**
 * Moves an element (task) to the specified column.
 * @param {Element} targetColumn - The target column element.
 * @param {Element} element - The task element to move.
 */
function moveElementToColumn(targetColumn, element) {
  targetColumn.appendChild(element);
}

/**
 * Updates the progress of a task in Firebase.
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newProgress - The new progress status of the task.
 * @async
 */
async function updateTaskProgress(taskId, newProgress) {
  const existingTaskData = await getTaskData(taskId);
  if (existingTaskData) {
    await updateTaskProgressInFirebase(taskId, newProgress, existingTaskData);
    console.log(
      `Task ${taskId} successfully moved to category ${newProgress}.`
    );
  } else {
    console.error(`No data found for task ${taskId}.`);
  }
}

/**
 * Moves a task to a new column and updates its progress.
 * @param {string} category - The ID of the target category (column).
 * @param {Event} event - The drop event.
 * @async
 */
async function moveTo(category, event) {
  event.preventDefault();
  if (!currentDraggedElement) return;

  const targetColumn = getTargetColumn(category);
  if (!targetColumn) return;

  moveElementToColumn(targetColumn, currentDraggedElement);

  const taskId = currentDraggedElement.id;
  const newProgress = getNewProgress(category);
  if (!newProgress) return;

  await updateTaskProgress(taskId, newProgress);
}

/**
 * Fetches task data from Firebase using the task ID.
 * @param {string} taskId - The ID of the task.
 * @returns {Object|null} The task data or null if not found.
 * @async
 */
async function getTaskData(taskId) {
  try {
    const response = await fetch(
      `https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/task/${taskId}.json`
    );
    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

/**
 * Prepares the updated task data with the new progress.
 * @param {Object} existingTaskData - The existing task data.
 * @param {string} newProgress - The new progress status of the task.
 * @returns {Object} The updated task data.
 */
function prepareUpdatedTaskData(existingTaskData, newProgress) {
  return {
    ...existingTaskData,
    progress: newProgress,
  };
}

/**
 * Sends a request to Firebase to update the task data.
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} updatedTaskData - The updated task data.
 * @returns {Promise<Response>} The response from the Firebase request.
 * @async
 */
async function sendUpdateRequestToFirebase(taskId, updatedTaskData) {
  const url = `https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/task/${taskId}.json`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTaskData),
    });

    return response;
  } catch (error) {
    console.error("Error sending request to Firebase:", error);
    throw error;
  }
}

/**
 * Handles the response from Firebase after updating a task's progress.
 * @param {Response} response - The response object from the Firebase request.
 * @param {string} taskId - The ID of the task.
 * @param {string} newProgress - The new progress status of the task.
 */
function handleFirebaseResponse(response, taskId, newProgress) {
  if (response.ok) {
    console.log(
      `Task ${taskId} progress successfully updated to ${newProgress}.`
    );
  } else {
    console.error("Error updating progress in Firebase.");
  }
}

/**
 * Updates the task progress in Firebase after preparing the updated data.
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newProgress - The new progress status of the task.
 * @param {Object} existingTaskData - The existing task data.
 * @async
 */
async function updateTaskProgressInFirebase(
  taskId,
  newProgress,
  existingTaskData
) {
  try {
    const updatedTaskData = prepareUpdatedTaskData(
      existingTaskData,
      newProgress
    );
    const response = await sendUpdateRequestToFirebase(taskId, updatedTaskData);
    handleFirebaseResponse(response, taskId, newProgress);
  } catch (error) {
    console.error("Error updating task in Firebase:", error);
  }
  updateEmptyColumnMessages();
}

/**
 * Highlights the target column when a task is being dragged over it.
 * @param {string} status - The status of the target column.
 * @param {Event} event - The drag event.
 */
function highlightColumn(status, event) {
  const column = document.getElementById(`${status}Column`);
  if (column) {
    column.classList.add("drag-area-highlight");
  }
}

/**
 * Removes the highlight from the target column after dragging ends.
 * @param {string} status - The status of the target column.
 */
function removeHighlight(status) {
  const column = document.getElementById(`${status}Column`);
  if (column) {
    column.classList.remove("drag-area-highlight");
  }
}

/**
 * Initializes the application by including necessary HTML and loading tasks from Firebase.
 */
window.onload = () => {
  includeHTML();
  loadTasksFromFirebase();
};

/**
 * Shows the overlay to add a new task.
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
 * Sets the "min" attribute of the task date input field to today.
 */
function onlyToDay() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("addTaskDate").setAttribute("min", today);
}

/**
 * Sets up event listeners for dropdown menu interactions.
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
 * Hides the overlay to add a new task.
 */
function hideOverlayAddTask() {
  let template = document.getElementById("add-task-template");
  template.innerHTML = "";
  template.classList.add("dNone");
  checked = [];
  subtasks = [];
}

/**
 * Shows the overlay with the task info card.
 */
function showOverlayInfoCard() {
  const overlay = document.getElementById("overlay");
  const card = document.getElementById("taskInfoCard");
  overlay.style.display = "block";
  card.classList.add("showCard");
  overlay.addEventListener("click", closeOverlayInfoCard);
}

/**
 * Hides the task info card overlay.
 */
function hideOverlayInfoCard() {
  const overlay = document.getElementById("overlay");
  const card = document.getElementById("taskInfoCard");
  overlay.style.display = "none";
  card.classList.remove("showCard");
  card.classList.add("hideCard");
  setTimeout(() => {
    card.classList.remove("hideCard");
  }, 500);

  const searchInputElement = document.querySelector(".searchinput");
  if (searchInputElement) {
    searchInputElement.value = "";
  }
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
        task.style.display = ""; // Make all tasks visible again
      });
    }
  });
  checked = [];
}

/**
 * Closes the task info card overlay and resets task data.
 */
function closeOverlayInfoCard() {
  hideOverlayInfoCard();
  taskInit();
  const card = document.getElementById("taskInfoCard");
  card.innerHTML = "";
}

/**
 * Hides the list card that displays a list of tasks.
 */
function hideshowListCard() {
  document.getElementById("showListCard").classList.add("dNone");
}

let subtasksEditCard = [];

/**
 * Adds a new subtask to the current task being edited.
 */
function addEditSubTask() {
  if (!currentTask.task.subtask) {
    currentTask.task.subtask = [];
  }
  subtasksEditCard = currentTask.task.subtask;
  let inputText = document.getElementById("inputSubTask");
  if (inputText.value && subtasksEditCard.length <= 1) {
    subtasksEditCard.push(inputText.value);
  }
  rendEditSubTask(currentTask);
  hideEditAddBtn();
}

/**
 * Renders the subtasks of the current task being edited.
 * @param {Object} task The task object containing subtasks.
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
 * Deletes a subtask from the current task being edited.
 * @param {number} index The index of the subtask to delete.
 */
function deleteEditTask(index) {
  subtasks.splice(index, 1);
  rendEditSubTask({ task: { subtask: subtasks } });
}

/**
 * Adds an event listener to update or delete a subtask when clicking the button.
 * @param {number} index The index of the subtask to edit.
 */
function addEditSubTaskcheck(index) {
  let btn = document.getElementById(`AddSubTaskStep2-${index}`);
  let inputText = document.getElementById(`toEditInputSubTask-${index}`);
  btn.addEventListener("click", () => {
    if (inputText.value) {
      subtasks[index] = inputText.value;
      rendEditSubTask({ task: { subtask: subtasks } });
    } else {
      deleteEditTask(index);
    }
  });
}

/**
 * Updates the task data in Firebase.
 * @param {string} task The task ID to update.
 * @returns {Promise<Object>} The updated task data from Firebase.
 */
async function updateTaskOnFireBase(task) {
  let taskData = getValue(task);
  try {
    const response = await fetch(`${BASE_URL}/task/${task}.json`, {
      method: "PUT", // PUT for updating
      body: JSON.stringify({
        title: taskData.title,
        description: taskData.description,
        assignet: taskData.assignet,
        date: taskData.date,
        prio: taskData.prio,
        category: taskData.category,
        subtask: taskData.subtask,
        progress: taskData.progress,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Error saving contact data");
    }
    const updatedContact = await response.json();
    return updatedContact;
  } catch (error) {
    console.error("Error updating the contact:", error);
    throw error;
  }
}

/**
 * Initializes the task update process in Firebase and lists the updated task.
 * @param {string} task The task ID to update.
 */
async function toDoForUpdateTaskOnFireBase(task) {
  await updateTaskOnFireBase(task);
  await taskInit();
  listDataCard(task);
}

/**
 * Retrieves the current values of the task being edited.
 * @param {string} taskid The task ID to get values for.
 * @returns {Object} The task data.
 */
function getValue(taskid) {
  const task = tasks.find((t) => t.id === taskid);
  if (!task) return;
  const newAssignet =
    checked && checked.length > 0 ? checked : task.task.assignet;
  title = document.getElementById("addTaskTittle").value;
  description = document.getElementById("addTaskDescription").value;
  assignet = checked;
  date = document.getElementById("addTaskDate").value;
  prio = getPriorityValue();
  subtask = subtasks;
  progress = task.task.progress;
  category = task.task.category;

  return {
    title,
    description,
    assignet: newAssignet,
    date,
    prio,
    subtask,
    progress,
    category,
  };
}

/**
 * Initializes the task loading process.
 * @async
 */
async function taskInit() {
  await loadContactss();
}

/**
 * Fetches all contacts from the given path.
 * @async
 * @param {string} path - The path to append to the base URL.
 * @returns {Promise<Object>} The JSON response containing contacts.
 */
async function getAllContacts(path = "") {
  let response = await fetch(`${BASE_URL}` + path + ".json");
  return (responseJs = await response.json());
}

let tasks = [];

/**
 * Loads task data from the server and stores it in the tasks array.
 * @async
 * @returns {Promise<Array>} The list of tasks.
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
 * Loads contacts and categorizes tasks into columns.
 * @async
 */
async function loadContactss() {
  let tasksData = await loadTaskData(); // Retrieve task data
  let todoId = document.getElementById("todoColumn");
  let awaitfeedbackId = document.getElementById("awaitfeedbackColumn");
  let inprogressId = document.getElementById("inprogressColumn");
  let doneId = document.getElementById("doneColumn");

  // Clear columns
  todoId.innerHTML = "";
  awaitfeedbackId.innerHTML = "";
  inprogressId.innerHTML = "";
  doneId.innerHTML = "";

  tasksData.forEach((task) => {
    // Assign tasks to respective columns
    if (task.task.progress === "todo") {
      todoId.innerHTML += renderCard(task);
    } else if (task.task.progress === "awaitfeedback") {
      awaitfeedbackId.innerHTML += renderCard(task);
    } else if (task.task.progress === "inprogress") {
      inprogressId.innerHTML += renderCard(task);
    } else if (task.task.progress === "done") {
      doneId.innerHTML += renderCard(task);
    }
  });

  // Update messages for empty columns
  updateEmptyColumnMessages(tasksData);

  // Show assigned persons
  tasksData.forEach((task) => {
    showAssignet(task);
  });
}

/**
 * Updates the empty column messages if any column is empty.
 * @param {Array} tasksData - The array of tasks to check for content.
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
 * Converts the task category number into a human-readable string.
 * @param {Object} task - The task object.
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
 * Truncates text to a specific length and adds ellipsis if needed.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - The maximum length of the text.
 * @returns {string} The truncated text with ellipsis.
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
 * Renders a task card for the board.
 * @param {Object} task - The task object to render.
 * @returns {string} The HTML string for the task card.
 */
function renderCard(task) {
  const maxTitleLength = 30;
  const maxDescriptionLength = 35;
  const truncatedTitle = truncateText(task.task.title, maxTitleLength);
  const truncatedDescription = truncateText(
    task.task.description,
    maxDescriptionLength
  );

  return `
      <div 
        class="boardTaskCard" 
        id="${task.id}" 
        draggable="true" 
        ondragstart="dragStart(event, '${task.id}')"
        ondragend="dragEnd(event)"
        onclick="listDataCard('${task.id}')"
      >
        <div 
          id="Category${task.task.category}" 
          class="boardCategoryCard cat${task.task.category}">
          ${fromNumberToName(task)}
        </div>
        <div>
          <h3 class="boardCardTitle">${truncatedTitle}</h3>
          <p class="boardCardDescription">${truncatedDescription}</p>
        </div>
        <div class="progresBar">
              <div class="progress-container">
                  <div class="progress-bar${showSubTasks(task)}">
                  </div>
              </div>
          <div style="font-size: 12px;">${showSubTasks(task)} /2 Subtasks</div>
        </div>
        <div class="assignetPersonContainer">
          <div id="asigned${task.id}" class="assignetPersonCard"></div>
          <div>${showPrioIcon(task)}</div>
        </div>
      </div>`;
}

/**
 * Shows the number of subtasks for a task.
 * @param {Object} task - The task object to check for subtasks.
 * @returns {string|number} The number of subtasks or "0" if none exist.
 */
function showSubTasks(task) {
  if (task.task.subtask && task.task.subtask.length > 0) {
    return task.task.subtask.length;
  } else {
    return "0";
  }
}

/**
 * Shows assigned persons for a task.
 * @param {Object} task - The task object with assigned persons.
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
  assigned.forEach((person) => {
    let initials = person.name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("")
      .slice(0, 2);
    let color = getColorForInitial(initials[0]);
    asignedDiv.innerHTML += `
        <div id="${person.key}" class="assignetPersonKreis" style="background-color: ${color};">
          ${initials}
        </div>
      `;
  });
}

/**
 * Returns a color code based on the initial of a name.
 * @param {string} initial - The initial of a person's name.
 * @returns {string} The corresponding color code.
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
 * Displays a priority icon for a task.
 * @param {Object} task - The task object containing priority info.
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
 * Deletes a task by its ID.
 * @async
 * @param {string} contactId - The ID of the task to delete.
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

/**
 * Edits the task data card and displays it in the edit mode.
 * @param {string} taskId - The ID of the task to edit.
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
  loadContactsForEdit();
  onlyToDay();
}

/**
 * Displays the task info card in the view mode.
 * @param {string} taskId - The ID of the task to display.
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
 * @param {string} text - The text to capitalize.
 * @returns {string} The capitalized string.
 */
function capitalizeFirstLetter(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Displays the list of subtasks for a task.
 * @param {Object} task - The task object containing subtasks.
 */
function showSubTasksString(task) {
  let subtasks = task.task.subtask;
  let subtasklist = document.getElementById("subtaskList");
  subtasklist.innerHTML = "";
  if (subtasks && subtasks.length > 0) {
    subtasks.forEach((subtask) => {
      subtasklist.innerHTML += `
          <div class="subtaskItem">
              <img src="./assets/subtask/checkbox.svg" alt="" class="cursor" onclick="toggleImage(this)"  id="checkbox" />${subtask}
          </div>`;
    });
  } else {
    subtasklist.innerHTML = "<p>No subtasks available.</p>";
  }
}

/**
 * Toggles the checkbox image between checked and unchecked states.
 * @param {HTMLElement} imageElement - The image element to toggle.
 */
function toggleImage(imageElement) {
  const checkedSrc = "checkbox-checked.svg";
  const uncheckedSrc = "checkbox.svg";
  const currentSrc = imageElement.src.split("/").pop();
  if (currentSrc === uncheckedSrc) {
    imageElement.src = "./assets/subtask/" + checkedSrc;
  } else {
    imageElement.src = "./assets/subtask/" + uncheckedSrc;
  }
}

/**
 * Displays assigned persons for the task in the info card.
 * @param {Object} task - The task object containing assigned persons.
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
}
