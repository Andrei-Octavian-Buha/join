function showOverlayAddTask() {
  let template = document.getElementById("add-task-template");
  template.classList.remove("dNone");
  template.innerHTML += addTaskTemplate();
  init();
  setupDropdownEvents();
}

function setupDropdownEvents() {
  const dropDownHeader = document.getElementById("dropDownHeaderId");
  const dropDownBody = document.getElementById("dropDownBodyId");
  const dropDownArrow = dropDownHeader?.querySelector("img");

  if (!dropDownHeader || !dropDownBody || !dropDownArrow) {
    console.error("Elementele dropdown nu au fost găsite în DOM.");
    return;
  }

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
