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
  try {
    const response = await fetch(`${BASE_URL}/task/${taskId}.json`, {
      method: "PUT",
      body: JSON.stringify(task.task),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Fehler beim Speichern der Kontaktdaten");
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kontakts:", error);
    throw error;
  }
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
