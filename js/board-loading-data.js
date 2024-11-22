async function taskInit() {
  await loadContacts();
}

async function getAllContacts(path = "") {
  let response = await fetch(`${BASE_URL}` + path + ".json");
  return (responseJs = await response.json());
}
let tasks = [];
console.log(tasks);

async function loadContactsData() {
  let ContactResponse = await getAllContacts("task");
  let UserKeyArray = Object.keys(ContactResponse);
  tasks = UserKeyArray.map((id) => ({
    id: id,
    task: ContactResponse[id],
  }));
  return tasks;
}

async function loadContacts() {
  let tasksData = await loadContactsData(); // Daten abrufen
  let todoId = document.getElementById("todoColumn");
  let awaitfeedbackId = document.getElementById("awaitfeedbackColumn");
  let inprogressId = document.getElementById("inprogressColumn");
  let doneId = document.getElementById("doneColumn");

  todoId.innerHTML = "";
  awaitfeedbackId.innerHTML = "";
  inprogressId.innerHTML = "";
  doneId.innerHTML = "";
  tasks.forEach((task) => {
    if (task.task.progress === "todo") {
      todoId.innerHTML += renderCard(task);
    } else if (task.task.progress === "awaitfeedback") {
      awaitfeedbackId.innerHTML += renderCard(task);
    } else if (task.task.progress === "inprogress") {
      inprogressId.innerHTML += renderCard(task);
    } else if (task.task.progress === "done") {
      doneId.innerHTML += renderCard(task);
    }
    showAssignet(task);
  });
}

function fromNumberToName(task) {
  let categoryName;
  if (task.task.category == 1) {
    categoryName = "Technical Task";
  } else if (task.task.category == 2) {
    categoryName = "User Story";
  }
  return categoryName;
}

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "..."; // Taie și adaugă "..."
  }
  return text;
}

function renderCard(task) {
  const maxTitleLength = 30;
  const maxDescriptionLength = 35;
  const truncatedTitle = truncateText(task.task.title, maxTitleLength);
  const truncatedDescription = truncateText(
    task.task.description,
    maxDescriptionLength
  );
  return `<div class="boardTaskCard">
          <div    id="Category${task.task.category}" 
                  class="boardCategoryCard cat${task.task.category}">
                  ${fromNumberToName(task)}</div>
          <div>
              <h3 class="boardCardTitle">${truncatedTitle}</h3>
              <p class="boardCardDescription">${truncatedDescription}</p>
          </div>
          <div class="progresBar">
                <div style="font-size: 12px;"> ProgresBar with setting 0 50 and 100 </div>
                <div style="font-size: 12px;">${showSubTasks(
                  task
                )} /2 Subtasks</div>
          </div>
          <div class="assignetPersonContainer">
              <div id="asigned${task.id}" class="assignetPersonCard"></div>
              <div>${showPrioIcon(task)}</div>
          </div>
      </div>`;
}

function showSubTasks(task) {
  if (task.task.subtask && task.task.subtask.length > 0) {
    return task.task.subtask.length;
  } else {
    return "0";
  }
}

function showAssignet(task) {
  let asignedDiv = document.getElementById(`asigned${task.id}`);
  asignedDiv.innerHTML = "";
  let assigned = task.task.assignet;
  if (assigned) {
    assigned.forEach((person) => {
      asignedDiv.innerHTML += `<div id="${person.key}" class="assignetPersonKreis">PTR</div>`;
    });
  } else {
    return "don't Assignet Person";
  }
}

function showPrioIcon(task) {
  let prio = task.task.prio;
  let iconPath;
  if (prio == "low") {
    iconPath = "/assets/priority/prioCard/lowCard.svg";
  } else if (prio == "medium") {
    iconPath = "/assets/priority/prioCard/mediumCard.svg";
  } else if (prio == "urgent") {
    iconPath = "/assets/priority/prioCard/urgentCard.svg";
  }
  console.log(iconPath);

  return `<img src="${iconPath}" alt="${prio} priority icon" style="width:20px; height:20px;">`;
}
