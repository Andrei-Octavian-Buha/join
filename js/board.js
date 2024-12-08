async function loadTasksFromFirebase() {
  try {
    const response = await fetch(
      "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/task.json"
    );
    if (!response.ok) {
      throw new Error("Netzwerkantwort war nicht ok");
    }
    const data = await response.json();
    if (data && Object.keys(data).length > 0) {
      updateHTML(data);
    } else {
      console.warn("Keine Aufgaben gefunden.");
    }
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
  }
}

function getSearchInput(selector) {
  const input = document.querySelector(selector);
  return input ? input.value.toLowerCase() : "";
}

function filterTasksInCategory(containerId, searchInput) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container mit der ID '${containerId}' wurde nicht gefunden.`);
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

function filterTasksInAllCategories(categories, searchInput) {
  categories.forEach((category) => {
    filterTasksInCategory(category, searchInput);
  });
}

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

function dragStart(event, id) {
  currentDraggedElement = document.querySelector(`#${id}`);
  event.dataTransfer.setData("text", id);
  event.target.style.opacity = "0.5";
}

function dragEnd(event) {
  event.target.style.opacity = "1";
}

function allowDrop(event) {
  event.preventDefault();
}

function getTargetColumn(category) {
  const targetColumn = document.getElementById(category);
  if (!targetColumn) {
    console.error("Ungültige Zielspalte:", category);
  }
  return targetColumn;
}

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

function moveElementToColumn(targetColumn, element) {
  targetColumn.appendChild(element);
}

async function updateTaskProgress(taskId, newProgress) {
  const existingTaskData = await getTaskData(taskId);
  if (existingTaskData) {
    await updateTaskProgressInFirebase(taskId, newProgress, existingTaskData);
    console.log(
      `Task ${taskId} erfolgreich in Kategorie ${newProgress} verschoben.`
    );
  } else {
    console.error(`Keine Daten für Task ${taskId} gefunden.`);
  }
}

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

function prepareUpdatedTaskData(existingTaskData, newProgress) {
  return {
    ...existingTaskData,
    progress: newProgress,
  };
}

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

function handleFirebaseResponse(response, taskId, newProgress) {
  if (response.ok) {
    console.log(
      `Progress der Aufgabe ${taskId} erfolgreich auf ${newProgress} aktualisiert.`
    );
  } else {
    console.error("Fehler beim Aktualisieren des Progress in Firebase.");
  }
}

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
}

function highlightColumn(status, event) {
  const column = document.getElementById(`${status}Column`);
  if (column) {
    column.classList.add("drag-area-highlight");
  }
}

function removeHighlight(status) {
  const column = document.getElementById(`${status}Column`);
  if (column) {
    column.classList.remove("drag-area-highlight");
  }
}

window.onload = () => {
  includeHTML();
  loadTasksFromFirebase();
};
