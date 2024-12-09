async function showOverlayAddTask() {
  let template = document.getElementById("add-task-template");
  template.classList.remove("dNone");
  template.innerHTML += addTaskTemplate();
  setupDropdownEvents();
  await init();
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
}

function hideshowListCard() {
  document.getElementById("showListCard").classList.add("dNone");
}

function rendEditSubTask(task) {
  subtasks = task.task.subtask;
  let toRender = document.getElementById("renderSubTask2");
  toRender.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    toRender.innerHTML += `<div class="subtaskContainer" id="subtaskContainerId${index}">
      <div class="subtaskInputWithDot">
        <span id="idSpanSubTaskEdit${index}" class="dot"></span>
        <input
          id="toEditInputSubTask-${index}"
          type="text"
          class="inputsubTask"
          readonly
          placeholder="${subtask}"
        />
      </div>
      <div class="subtaskEdiBtns">
        <img
          id="subTaskEditBtn-${index}"
          class="cursor"
          src="./assets/priority/edit.svg"
          alt="Edit"
          onclick="editAddedSubTask(${index})"
        />
        <img
        id="AddSubTaskStep2-${index}"
        class="cursor dNone"
        src="./assets/subtask/check.svg"
        alt=""
        onclick="addEditSubTaskcheck(${index})"
        />
        <img src="./assets/priority/bar.svg" alt="Separator" />
        <img
          id="subTaskDeleteBtn-${index}"
          class="cursor"
          src="./assets/priority/delete.svg"
          alt="Delete"
          onclick="deleteEditTask(${index})"
        />
      </div>
    </div>`;
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

function addEditSubTask() {
  let inputText = document.getElementById("inputSubTask");
  if (inputText.value && subtasks.length <= 1) {
    subtasks.push(inputText.value);
  }
  hideEditAddBtn();
  rendEditSubTask({ task: { subtask: subtasks } });
}

async function updateContactOnFireBase(task) {
  let toEditTaskId = task;
  let taskData = getValue(task);

  try {
    const response = await fetch(`${BASE_URL}/task/${toEditTaskId}.json`, {
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
    rendEditSubTask(task);
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
