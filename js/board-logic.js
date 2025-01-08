function showOverlayAddTask() {
  let template = document.getElementById("add-task-template");
  template.classList.remove("dNone");
  template.innerHTML += addTaskTemplate();
  setupDropdownEvents();
  loadContacts();
  onlyToDay();
}

function onlyToDay() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("addTaskDate").setAttribute("min", today);
}

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

function hideOverlayAddTask() {
  let template = document.getElementById("add-task-template");
  template.innerHTML = "";
  template.classList.add("dNone");
  checked = [];
  subtasks = [];
}

function showOverlayInfoCard() {
  const overlay = document.getElementById("overlay");
  const card = document.getElementById("taskInfoCard");
  overlay.style.display = "block";
  card.classList.add("showCard");
  overlay.addEventListener("click", closeOverlayInfoCard);
}

//
function hideOverlayInfoCard() {
  hideOverlayAndCard();
  clearSearchInput();
  resetTaskDisplay();
  finalizeTaskActions();
}

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

function clearSearchInput() {
  const searchInputElement = document.querySelector(".searchinput");
  if (searchInputElement) {
    searchInputElement.value = "";
  }
}

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

function finalizeTaskActions() {
  checked = [];
  taskInit();
}


function closeOverlayInfoCard() {
  hideOverlayInfoCard();
  taskInit();
  const card = document.getElementById("taskInfoCard");
  card.innerHTML = "";
}

function hideshowListCard() {
  document.getElementById("showListCard").classList.add("dNone");
}

let subtasksEditCard = [];

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

function deleteEditTask(index) {
  subtasks.splice(index, 1);
  rendEditSubTask({ task: { subtask: subtasks } });
}

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

function handleTaskUpdateError(error) {
  console.error("Fehler beim Aktualisieren des Kontakts:", error);
}


async function toDoForUpdateTaskOnFireBase(task) {
  await updateTaskOnFireBase(task);
  await taskInit();
  listDataCard(task);
}


function findTaskById(taskid) {
  const task = tasks.find((t) => t.id === taskid);
  if (!task) return null;
  return task;
}


function getTaskInputValues() {
  return {
    title: document.getElementById("addTaskTittle").value,
    description: document.getElementById("addTaskDescription").value,
    date: document.getElementById("addTaskDate").value,
    prio: getPriorityValue(),
    subtask: subtasks,
  };
}


function getAssignetValue(task) {
  return checked && checked.length > 0 ? checked : task.task.assignet;
}


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

function updateArrowVisibilityForAll() {
  const allTasks = [...document.querySelectorAll(".boardTaskCard")];
  allTasks.forEach((task) => {
    updateArrowVisibility(task.id);
  });
}

function updateArrowVisibility(taskId) {
  const taskCard = document.getElementById(taskId);
  const currentColumn = taskCard.closest(".drag-area").id;
  const arrowUp = taskCard.querySelector(".arrow-up");
  const arrowDown = taskCard.querySelector(".arrow-down");
  const currentIndex = columnsOrder.indexOf(currentColumn);
  if (currentIndex === 0) {
    arrowUp.style.display = "none";
  } else {
    arrowUp.style.display = "inline";}
  if (currentIndex === columnsOrder.length - 1) {
    arrowDown.style.display = "none";
  } else {
    arrowDown.style.display = "inline";}
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initializeBoard, 100); 
});

function initializeBoard() {
  const allTasks = [...document.querySelectorAll(".boardTaskCard")];

  allTasks.forEach((task) => {
    updateArrowVisibility(task.id);
  });
}
