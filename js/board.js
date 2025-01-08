/**
 * Loads tasks from Firebase and updates the HTML with the task data.
 * @async
 * @function
 */
async function loadTasksFromFirebase() {
  try {
    const data = await fetchDataFromFirebase(
      "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/task.json"
    );
    data && Object.keys(data).length > 0
      ? updateHTML(data)
      : console.warn("Keine Aufgaben gefunden.");
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
  }
}

async function fetchDataFromFirebase(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Netzwerkantwort war nicht ok");
  return response.json();
}

/**
 * Gets the value of a search input field.
 * @param {string} selector - The CSS selector of the input field.
 * @returns {string} The value of the input field, converted to lowercase.
 * @function
 */
function getSearchInput(selector) {
  const input = document.querySelector(selector);
  return input ? input.value.toLowerCase() : "";
}

/**
 * Filters tasks in a specific category based on the search input.
 * @param {string} containerId - The ID of the task container.
 * @param {string} searchInput - The search input to filter tasks.
 * @function
 */
function filterTasksInCategory(containerId, searchInput) {
  const container = document.getElementById(containerId);
  if (!container)
    return console.warn(
      `Container mit der ID '${containerId}' wurde nicht gefunden.`
    );

  container.querySelectorAll(".boardTaskCard").forEach((task) => {
    toggleTaskVisibility(task, searchInput.toLowerCase());
  });
}

function toggleTaskVisibility(task, searchInput) {
  const taskTitle = task
    .querySelector(".boardCardTitle")
    ?.textContent.toLowerCase();
  const taskDescription = task
    .querySelector(".boardCardDescription")
    ?.textContent.toLowerCase();
  task.style.display =
    taskTitle?.includes(searchInput) || taskDescription?.includes(searchInput)
      ? ""
      : "none";
}

/**
 * Filters tasks in all categories based on the search input.
 * @param {Array<string>} categories - An array of category IDs.
 * @param {string} searchInput - The search input to filter tasks.
 * @function
 */
function filterTasksInAllCategories(categories, searchInput) {
  categories.forEach((category) => {
    filterTasksInCategory(category, searchInput);
  });
}

/**
 * Filters tasks in all categories using the search input.
 * @function
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
 * Handles the drag start event and sets the opacity of the dragged element.
 * @param {Event} event - The drag start event.
 * @param {string} id - The ID of the element being dragged.
 * @function
 */
function dragStart(event, id) {
  currentDraggedElement = document.querySelector(`#${id}`);
  event.dataTransfer.setData("text", id);
  event.target.style.opacity = "0.5";
}

/**
 * Handles the drag end event and resets the opacity of the dragged element.
 * @param {Event} event - The drag end event.
 * @function
 */
function dragEnd(event) {
  event.target.style.opacity = "1";
}

/**
 * Prevents the default action for the drop event to allow for dropping.
 * @param {Event} event - The drop event.
 * @function
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Retrieves the target column element based on the category.
 * @param {string} category - The category ID.
 * @returns {HTMLElement|null} The target column element or null if not found.
 * @function
 */
function getTargetColumn(category) {
  const targetColumn = document.getElementById(category);
  if (!targetColumn) {
    console.error("Ungültige Zielspalte:", category);
  }
  return targetColumn;
}

/**
 * Retrieves the new progress state based on the category.
 * @param {string} category - The category ID.
 * @returns {string|null} The new progress state or null if the category is invalid.
 * @function
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
    console.error("Ungültige Kategorie:", category);
  }
  return newProgress;
}

/**
 * Moves an element to a target column.
 * @param {HTMLElement} targetColumn - The column element to move the element to.
 * @param {HTMLElement} element - The element to move.
 * @function
 */
function moveElementToColumn(targetColumn, element) {
  targetColumn.appendChild(element);
}

/**
 * Updates the progress of a task in Firebase.
 * @async
 * @param {string} taskId - The ID of the task.
 * @param {string} newProgress - The new progress state of the task.
 * @function
 */
async function updateTaskProgress(taskId, newProgress) {
  const existingTaskData = await getTaskData(taskId);
  if (existingTaskData) {
    await updateTaskProgressInFirebase(taskId, newProgress, existingTaskData);
  } else {
    console.error(`Keine Daten für Task ${taskId} gefunden.`);
  }
}

/**
 * Moves an element to a specified category and updates its progress.
 * @async
 * @param {string} category - The category to move the element to.
 * @param {Event} event - The drop event.
 * @function
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
 * Retrieves task data from Firebase based on the task ID.
 * @async
 * @param {string} taskId - The ID of the task.
 * @returns {Object|null} The task data or null if not found.
 * @function
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
 * Prepares the updated task data with the new progress state.
 * @param {Object} existingTaskData - The existing task data.
 * @param {string} newProgress - The new progress state of the task.
 * @returns {Object} The updated task data.
 * @function
 */
function prepareUpdatedTaskData(existingTaskData, newProgress) {
  return {
    ...existingTaskData,
    progress: newProgress,
  };
}

/**
 * Sends the updated task data to Firebase.
 * @async
 * @param {string} taskId - The ID of the task.
 * @param {Object} updatedTaskData - The updated task data.
 * @returns {Response} The response from Firebase.
 * @function
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
    console.error("Fehler beim Senden der Anfrage an Firebase:", error);
    throw error;
  }
}

/**
 * Handles the Firebase response after updating the task data.
 * @param {Response} response - The response from Firebase.
 * @param {string} taskId - The ID of the task.
 * @param {string} newProgress - The new progress state of the task.
 * @function
 */
function handleFirebaseResponse(response, taskId, newProgress) {
  if (response.ok) {
  } else {
    console.error("Fehler beim Aktualisieren des Progress in Firebase.");
  }
}

/**
 * Updates the progress of a task in Firebase and manages the empty column message.
 * @async
 * @param {string} taskId - The ID of the task.
 * @param {string} newProgress - The new progress state.
 * @param {Object} existingTaskData - The existing task data.
 * @function
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
    console.error("Fehler beim Firebase-Update:", error);
  }
  updateEmptyColumnMessages();
}

/**
 * Highlights a column based on its status when a task is dragged over it.
 * @param {string} status - The status of the column (e.g., "todo", "inprogress").
 * @param {Event} event - The drag event.
 * @function
 */
function highlightColumn(status, event) {
  const column = document.getElementById(`${status}Column`);
  if (column) {
    column.classList.add("drag-area-highlight");
  }
}

/**
 * Removes the highlight from a column when the task is no longer being dragged over it.
 * @param {string} status - The status of the column (e.g., "todo", "inprogress").
 * @function
 */
function removeHighlight(status) {
  const column = document.getElementById(`${status}Column`);
  if (column) {
    column.classList.remove("drag-area-highlight");
  }
}

/**
 * Loads HTML includes and tasks on window load.
 * @function
 */
window.onload = () => {
  includeHTML();
  loadTasksFromFirebase();
};
