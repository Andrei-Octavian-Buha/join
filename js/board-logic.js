function showOverlayAddTask() {
  let template = document.getElementById("add-task-template");
  template.classList.remove("dNone");
  template.innerHTML += addTaskTemplate();
  setupDropdownEvents();
  init();
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
}

function showOverlayInfoCard() {
  const overlay = document.getElementById("overlay");
  const card = document.getElementById("taskInfoCard");
  overlay.style.display = "block";
  card.classList.add("showCard");
  overlay.addEventListener("click", closeOverlayInfoCard);
}

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
        task.style.display = ""; // Alle Aufgaben wieder sichtbar machen
      });
    }
  });
  checked = [];
}

function closeOverlayInfoCard() {
  hideOverlayInfoCard();
  taskInit();
}

function hideshowListCard() {
  document.getElementById("showListCard").classList.add("dNone");
}

function rendEditSubTask(task) {
  subtasks = task.task.subtask;
  let toRender = document.getElementById("renderSubTask2");
  toRender.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    toRender.innerHTML += rendEditSubTaskHtml(subtask, index);
  });
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
      subtasks[index] = inputText.value;
      rendEditSubTask({ task: { subtask: subtasks } });
    } else {
      deleteEditTask(index);
    }
  });
}

async function updateContactOnFireBase(task) {
  let taskData = getValue(task);
  try {
    const response = await fetch(`${BASE_URL}/task/${task}.json`, {
      method: "PUT", // PUT für Update
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
    taskInit();
    listDataCard(task);
    if (!response.ok) {
      throw new Error("Fehler beim Speichern der Kontaktdaten");
    }
    const updatedContact = await response.json();
    console.log("Kontakt erfolgreich aktualisiert:", updatedContact);
    return updatedContact;
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kontakts:", error);
    throw error;
  }
}

function getValue(taskid) {
  const task = tasks.find((t) => t.id === taskid);
  if (!task) return;
  console.log(task.task.assignet);
  const newAssignet =
    checked && checked.length > 0 ? checked : task.task.assignet;
  title = document.getElementById("addTaskTittle").value;
  description = document.getElementById("addTaskDescription").value;
  assignet = checked;
  date = document.getElementById("addTaskDate").value;
  prio = task.task.prio;
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
