async function taskInit() {
  await loadContactss();
}

async function getAllContacts(path = "") {
  let response = await fetch(`${BASE_URL}` + path + ".json");
  return (responseJs = await response.json());
}
let tasks = [];

async function loadContactsData() {
  let ContactResponse = await getAllContacts("task");
  let UserKeyArray = Object.keys(ContactResponse);
  tasks = UserKeyArray.map((id) => ({
    id: id,
    task: ContactResponse[id],
  }));
  return tasks;
}

async function loadContactss() {
  let tasksData = await loadContactsData(); // Daten abrufen
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
    G: "#33DBFF",
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
    S: "#99FF33",
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

// Info card data

async function deleteContact(contactId) {
  console.log(contactId);
  const confirmDelete = confirm("Möchten Sie diesen Kontakt wirklich löschen?");
  if (!confirmDelete) {
    console.log("Löschen abgebrochen");
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/task/${contactId}.json`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Fehler beim Löschen des Kontakts");
    }
    alert("Der Kontakt wurde erfolgreich gelöscht.");
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
  cardRender.innerHTML = "";
  cardRender.innerHTML += showEditCard(task);
  showInfoAssignet(task);
}

function listDataCard(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;
  showOverlayInfoCard();
  let cardRender = document.getElementById("taskInfoCard");
  cardRender.innerHTML = "";
  cardRender.innerHTML += `       
      <div class="boardOverlay">
          <div id="showListCard" class="taskContainer">
              <div class="taskHeder">
                  <div class="boardCategoryCard cat${task.task.category}">
                      ${fromNumberToName(task)}
                  </div>
                  <span onclick="hideOverlayInfoCard()" class="cursor">X</span>
              </div>
              <div class="taskTitle">
                  <h1 class="margin0">${task.task.title}</h1>
                  <p class="margin0">${task.task.description}</p>
                  <span>Due date: ${task.task.date}</span>
                  <div class="prioContainer">
                      <div class="gap8">
                          <p class="margin0">Priority:</p>
                          ${capitalizeFirstLetter(
                            task.task.prio
                          )}${showPrioIcon(task)}
                      </div>
                  </div>
                  <div class="direction-column ">
                    <p class="margin0">Assigned To:</p>
                    <div id="asignedd${task.id}" 
                    class="assignetPersonCard direction-column pLeft16"></div>
                  </div>
                  <div class="boardCardSubtaskContainer">
                      <p class="margin0">Subtasks</p>
                      <div id="subtaskList" class="pLeft16"></div>
                  </div>
                  <div class="dflex gap8">
                      <div class="gap8 cursor btnDeleteEdit" 
                            onclick="deleteContact('${task.id}')">
                          <div>
                                                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="custom-svg">
                                <mask id="mask0_251030_8603" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                                <rect x="0.000976562" width="24" height="24" fill="#D9D9D9"/>
                                </mask>
                                <g mask="url(#mask0_251030_8603)">
                                <path d="M7.00098 21C6.45098 21 5.98014 20.8042 5.58848 20.4125C5.19681 20.0208 5.00098 19.55 5.00098 19V6C4.71764 6 4.48014 5.90417 4.28848 5.7125C4.09681 5.52083 4.00098 5.28333 4.00098 5C4.00098 4.71667 4.09681 4.47917 4.28848 4.2875C4.48014 4.09583 4.71764 4 5.00098 4H9.00098C9.00098 3.71667 9.09681 3.47917 9.28848 3.2875C9.48014 3.09583 9.71764 3 10.001 3H14.001C14.2843 3 14.5218 3.09583 14.7135 3.2875C14.9051 3.47917 15.001 3.71667 15.001 4H19.001C19.2843 4 19.5218 4.09583 19.7135 4.2875C19.9051 4.47917 20.001 4.71667 20.001 5C20.001 5.28333 19.9051 5.52083 19.7135 5.7125C19.5218 5.90417 19.2843 6 19.001 6V19C19.001 19.55 18.8051 20.0208 18.4135 20.4125C18.0218 20.8042 17.551 21 17.001 21H7.00098ZM7.00098 6V19H17.001V6H7.00098ZM9.00098 16C9.00098 16.2833 9.09681 16.5208 9.28848 16.7125C9.48014 16.9042 9.71764 17 10.001 17C10.2843 17 10.5218 16.9042 10.7135 16.7125C10.9051 16.5208 11.001 16.2833 11.001 16V9C11.001 8.71667 10.9051 8.47917 10.7135 8.2875C10.5218 8.09583 10.2843 8 10.001 8C9.71764 8 9.48014 8.09583 9.28848 8.2875C9.09681 8.47917 9.00098 8.71667 9.00098 9V16ZM13.001 16C13.001 16.2833 13.0968 16.5208 13.2885 16.7125C13.4801 16.9042 13.7176 17 14.001 17C14.2843 17 14.5218 16.9042 14.7135 16.7125C14.9051 16.5208 15.001 16.2833 15.001 16V9C15.001 8.71667 14.9051 8.47917 14.7135 8.2875C14.5218 8.09583 14.2843 8 14.001 8C13.7176 8 13.4801 8.09583 13.2885 8.2875C13.0968 8.47917 13.001 8.71667 13.001 9V16Z"/>
                                </g>
                                </svg>
                          </div>
                            Delete
                      </div>
                      <img src="./assets/subtask/bar1.svg" alt="" />
                      <div class="gap8 cursor btnDeleteEdit" 
                            onclick="editListDataCard('${task.id}')">
                        <div style="fill:#2A3647">
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="#2A3647" xmlns="http://www.w3.org/2000/svg" class="custom-svg">
                        <path d="M2.00098 17H3.40098L12.026 8.375L10.626 6.975L2.00098 15.6V17ZM16.301 6.925L12.051 2.725L13.451 1.325C13.8343 0.941667 14.3051 0.75 14.8635 0.75C15.4218 0.75 15.8926 0.941667 16.276 1.325L17.676 2.725C18.0593 3.10833 18.2593 3.57083 18.276 4.1125C18.2926 4.65417 18.1093 5.11667 17.726 5.5L16.301 6.925ZM14.851 8.4L4.25098 19H0.000976562V14.75L10.601 4.15L14.851 8.4Z"/>
                        </svg>
                        </div>
                        Edit
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
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
function storeTasksInSessionStorage() {
  // Sort tasks by their progress (status)
  let sortedTasks = {
    todo: [],
    inprogress: [],
    awaitfeedback: [],
    done: [],
    urgent: [],
    all: [],
  };

  tasks.forEach((task) => {
    // Sort tasks by progress status
    if (task.task.progress === "todo") {
      sortedTasks.todo.push(task);
    } else if (task.task.progress === "inprogress") {
      sortedTasks.inprogress.push(task);
    } else if (task.task.progress === "awaitfeedback") {
      sortedTasks.awaitfeedback.push(task);
    } else if (task.task.progress === "done") {
      sortedTasks.done.push(task);
    }

    // Also categorize tasks by urgency
    if (task.task.prio === "urgent") {
      sortedTasks.urgent.push(task);
    }

    // Include all tasks in the "all" category
    sortedTasks.all.push(task);
  });

  // Store the sorted tasks in localStorage
  sessionStorage.setItem("sortedTasks", JSON.stringify(sortedTasks));

  console.log("Tasks sorted and stored in sessionStorage");
}
