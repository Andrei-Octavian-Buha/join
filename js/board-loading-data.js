async function taskInit() {
  await loadContactss();
}

async function getAllContacts(path = "") {
  let response = await fetch(`${BASE_URL}` + path + ".json");
  return (responseJs = await response.json());
}

let tasks = [];

async function loadTaskData() {
  let ContactResponse = await getAllContacts("task");
  let UserKeyArray = Object.keys(ContactResponse);
  tasks = UserKeyArray.map((id) => ({
    id: id,
    task: ContactResponse[id],
  }));
  return tasks;
}

async function loadContactss() {
  let tasksData = await loadTaskData(); // Daten abrufen
  let todoId = document.getElementById("todoColumn");
  let awaitfeedbackId = document.getElementById("awaitfeedbackColumn");
  let inprogressId = document.getElementById("inprogressColumn");
  let doneId = document.getElementById("doneColumn");
  todoId.innerHTML = "";
  awaitfeedbackId.innerHTML = "";
  inprogressId.innerHTML = "";
  doneId.innerHTML = "";
  tasksData.forEach((task) => {
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
  tasksData.forEach((task) => {
    showAssignet(task); // Funcția se oprește doar pentru task-ul problematic
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
  if (!text || typeof text !== "string") {
    return ""; // Rückgabe eines leeren Strings, wenn text nicht gültig ist
  }
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
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
        <div style="font-size: 12px;"> ProgresBar with setting 0 50 and 100 </div>
        <div style="font-size: 12px;">${showSubTasks(task)} /2 Subtasks</div>
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
  if (!asignedDiv) {
    console.warn(
      `Elementul asignedDiv cu ID-ul "asigned${task.id}" nu a fost găsit.`
    );
    return;
  }
  asignedDiv.innerHTML = ""; // Vorherigen Inhalt löschen
  let assigned = task.task.assignet;
  if (!assigned || assigned.length === 0) {
    return;
  }
  if (assigned) {
    assigned.forEach((person) => {
      // Initialen der Person extrahieren
      let initials = person.name
        .split(" ")
        .map((word) => word[0].toUpperCase())
        .join("")
        .slice(0, 2);

      // Farbe basierend auf dem ersten Buchstaben der Initialen abrufen
      let color = getColorForInitial(initials[0]);

      // Hinzufügen des farblich hinterlegten Divs
      asignedDiv.innerHTML += `
        <div id="${person.key}" class="assignetPersonKreis" style="background-color: ${color};">
          ${initials}
        </div>
      `;
    });
  } else {
    return "don't Assignet Person";
  }
}

function getColorForInitial(initial) {
  const colors = {
    A: "#FF5733",
    B: "#FFBD33",
    C: "#DBFF33",
    D: "#75FF33",
    E: "#33FF57",
    F: "#33FFBD",
    G: "#3399FF",
    H: "#3375FF",
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
    S: '#66CC33',
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
  return `<img src="${iconPath}" alt="${prio} priority icon" style="width:20px; height:20px;">`;
}

async function deleteContact(contactId) {
  console.log(contactId);

  try {
    const response = await fetch(`${BASE_URL}/task/${contactId}.json`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Fehler beim Löschen des Kontakts");
    }
  
    taskInit();
    hideOverlayInfoCard();
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
    alert("Es ist ein Fehler beim Löschen des Kontakts aufgetreten.");
  }
}

function editListDataCard(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;
  let cardRender = document.getElementById("taskInfoCard");
  let template = document.getElementById("add-task-template");
  template.innerHTML = "";
  cardRender.innerHTML = "";
  cardRender.innerHTML += test(task);
  showAssignet(task);
}

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

function capitalizeFirstLetter(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

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

function showInfoAssignet(task) {
  let asignedDiv = document.getElementById(`asignedd${task.id}`);
  if (!asignedDiv) {
    console.warn(
      `Elementul asignedDiv cu ID-ul "asigned${task.id}" nu a fost găsit.`
    );
    return;
  }
  asignedDiv.innerHTML = ""; // Vorherigen Inhalt löschen
  let assigned = task.task.assignet;
  if (!assigned || assigned.length === 0) {
    return;
  }
  if (assigned) {
    assigned.forEach((person) => {
      // Initialen der Person extrahieren
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
  } else {
    return "don't Assignet Person";
  }
}
