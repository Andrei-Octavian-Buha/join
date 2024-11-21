const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/";

let contacts = [];

async function init() {
  await loadContacts();
}
function subtasktrigger() {
  hideSubTaskAddBtn();
  deleteInputSubTask();
  addSubTask();
  startEventListner();
}

async function loadContactsData() {
  let ContactResponse = await getAllContacts("contacts");
  let UserKeyArray = Object.keys(ContactResponse);
  return UserKeyArray.map((id) => ({
    id: id,
    cont: ContactResponse[id],
  }));
}

function sortContacts(contacts) {
  return contacts.sort((a, b) => {
    let nameA = a.cont.name.toUpperCase(); // Großbuchstaben für den Vergleich
    let nameB = b.cont.name.toUpperCase();
    if (nameA < nameB) {
      return -1; // a kommt vor b
    }
    if (nameA > nameB) {
      return 1; // b kommt vor a
    }
    return 0; // Wenn die Namen gleich sind
  });
}

function createContactElement(element) {
  let container = document.createElement("div");
  container.id = `ContainerID${element.id}`;
  container.classList.add("dropDownContactContainer");

  // Extrahiere die Initialen des Kontakts
  let initials = element.cont.name.split(" ").map(word => word[0].toUpperCase()).join("").slice(0, 2);

  // Hol die Farbe für die Initialen
  let color = getColorForInitial(initials[0]); // Verwende nur den ersten Buchstaben für die Farbe

  container.innerHTML = `
    <div class="dropDownContactName">
      <p class="firstLetterCircle" style="background-color: ${color};">${initials}</p>
      <p class="dropDownFullName">${element.cont.name}</p>
    </div>
    <input
      type="checkbox"
      class="contactCheckbox"
      id="CheckboxID${element.id}"
    />
  `;
  return container;
}

function renderContacts(contacts) {
  let dropdown = document.getElementById("dropDownBodyId");
  dropdown.innerHTML = ""; // Existierende Kontakte entfernen

  contacts.forEach((element) => {
    let container = createContactElement(element);
    dropdown.appendChild(container);
    startEvent(element); // Starte das Event für diesen Kontakt
  });
}

async function loadContacts() {
  let contactsData = await loadContactsData(); // Daten abrufen
  let sortedContacts = sortContacts(contactsData); // Kontakte sortieren
  renderContacts(sortedContacts); // Kontakte rendern
}

function getColorForInitial(initial) {
  const colors = {
      A: '#FF5733', B: '#FFBD33', C: '#DBFF33', D: '#75FF33', E: '#33FF57', 
      F: '#33FFBD', G: '#33DBFF', H: '#3375FF', I: '#5733FF', J: '#BD33FF', 
      K: '#FF33DB', L: '#FF3375', M: '#FF3333', N: '#FF6633', O: '#FF9933', 
      P: '#FFCC33', Q: '#FFFF33', R: '#CCFF33', S: '#99FF33', T: '#66FF33', 
      U: '#33FF66', V: '#33FF99', W: '#33FFCC', X: '#33FFFF', Y: '#33CCFF', 
      Z: '#3399FF'
  };
  return colors[initial] || '#333333'; 
}

function startEvent(contactId) {
  const ck = document.getElementById(`CheckboxID${contactId.id}`);
  if (ck) {
    ck.addEventListener("change", () => {
      whenChecked(contactId);
    });
    console.log(`Adding event listener to CheckboxID${contactId.id}`);
  } else {
    console.error(`CheckboxID${contactId.id} not found`);
  }
}

async function getAllContacts(path = "") {
  let response = await fetch(`${BASE_URL}` + path + ".json");
  return (responseJs = await response.json());
}

function startEventListner() {
  let clickHeader = document.getElementById("dropDownHeaderId");
  let body = document.getElementById("dropDownBodyId");
  if (clickHeader) {
    clickHeader.addEventListener("click", () => {
      body.classList.toggle("dNone");
    });
  }
}

let checked = [];

async function resetForm(event) {
  let assignet = document.getElementById("whoIsAssignet");
  document.getElementById("dropDownBodyId").classList.add("dNone");
  let text = document.getElementById("dinamicText");
  text.innerHTML = "Select contacts to assign";
  event.preventDefault();
  const form = document.getElementById("addTaskForm");
  form.setAttribute("novalidate", true);
  form.reset();
  form.removeAttribute("novalidate");
  subtasks = [];
  rendSubTask();
  checked = [];
  await loadContacts();
  assignet.innerHTML = "";
  console.log(checked);
}

function whenChecked(contactId) {
  let ck = document.getElementById(`CheckboxID${contactId.id}`);
  let container = document.getElementById(`ContainerID${contactId.id}`);
  let text = document.getElementById("dinamicText");
  let assignet = document.getElementById("whoIsAssignet");

  // Entferne alle Inhalte der "dinamicText"- und "whoIsAssignet"-Container nur, wenn keine Checkbox markiert ist
  if (checked.length === 0) {
    text.innerHTML = "Select contacts to assign";
    assignet.innerHTML = "";
  } else {
    text.innerHTML = "An |";
  }

  if (ck.checked) {
    if (!checked.includes(contactId.id)) {
      checked.push({ name: contactId.cont.name, key: contactId.id });
      console.log("we have add", checked);
    }
    container.classList.add("checkedBgColor");
    console.log(`Added checkedBgColor to ContainerID${contactId.id}`);
  } else {
    const index = checked.findIndex((item) => item.key === contactId.id);
    if (index > -1) {
      checked.splice(index, 1);
      console.log("Object removed:", checked);
    }
    container.classList.remove("checkedBgColor");
  }

  // Badges (Initialen) für alle markierten Kontakte anzeigen
  assignet.innerHTML = ""; // Nur bei Änderungen den Inhalt löschen, nicht bei jedem Durchlauf
  checked.forEach((element) => {
    // Extrahiere die Initialen des Kontakts
    let initials = element.name.split(" ").map(word => word[0].toUpperCase()).join("").slice(0, 2);
    
    // Hole die Farbe für die Initialen
    let color = getColorForInitial(initials[0]); // Wir verwenden nur den ersten Buchstaben für die Farbe

    // Erstelle das Badge mit den Initialen und der entsprechenden Farbe
    assignet.innerHTML += `<p class="firstLetterCircle" style="background-color: ${color};">${initials}</p>`;
  });
}


// SUBTASK
let subtasks = [];

function hideSubTaskAddBtn() {
  let btn1 = document.getElementById("AddSubTaskStep1");
  let btn2 = document.getElementById("AddSubTaskStep2");
  btn1.addEventListener("click", () => {
    btn1.classList.add("dNone");
    btn2.classList.remove("dNone");
  });
}

function hideEditAddBtn() {
  document.getElementById("AddSubTaskStep1").classList.remove("dNone");
  document.getElementById("AddSubTaskStep2").classList.add("dNone");
  let inputText = document.getElementById("inputSubTask");
  inputText.value = "";
}

function deleteInputSubTask() {
  let btn = document.getElementById("AddSubTaskStep2Delete");
  let inputText = document.getElementById("inputSubTask");
  btn.addEventListener("click", () => {
    inputText.value = "";
    hideEditAddBtn();
  });
}

function addSubTask() {
  let btn = document.getElementById("AddSubTaskStep2Add");
  let inputText = document.getElementById("inputSubTask");
  btn.addEventListener("click", () => {
    if (inputText.value) {
      subtasks.push(inputText.value);
    } else {
      console.log("i will please you to add some text");
    }
    hideEditAddBtn();
    rendSubTask();
    console.log(subtasks);
  });
}

function deleteSubTask(index) {
  subtasks.splice(index, 1);
  rendSubTask();
}

function editAddedSubTask(index) {
  let inputToEdit = document.getElementById(`toEditInputSubTask-${index}`);
  inputToEdit.classList.remove("inputsubTask");
  inputToEdit.classList.add("inputsubTaskActive");
  backgroundEdit(index);
  changeEditWithCheck(index);
  inputToEdit.removeAttribute("readonly");
  inputToEdit.value = subtasks[index];
}

function changeEditWithCheck(index) {
  document.getElementById(`AddSubTaskStep2-${index}`).classList.remove("dNone");
  document.getElementById(`subTaskEditBtn-${index}`).classList.add("dNone");
  document.getElementById(`idSpanSubTaskEdit${index}`).classList.add("dNone");
}

function addEditcheck(index) {
  let btn = document.getElementById(`AddSubTaskStep2-${index}`);
  let inputText = document.getElementById(`toEditInputSubTask-${index}`);
  btn.addEventListener("click", () => {
    if (inputText.value) {
      subtasks[index] = inputText.value;
      rendSubTask();
    } else {
      deleteSubTask(index);
    }
    console.log(subtasks);
  });
}

function backgroundEdit(index) {
  let conteinerId = document.getElementById(`subtaskContainerId${index}`);
  conteinerId.classList.add("backgroundSubTaskEdit");
}

function rendSubTask() {
  let toRender = document.getElementById("renderSubTask");
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
      onclick="addEditcheck(${index})"
      />
      <img src="./assets/priority/bar.svg" alt="Separator" />
      <img
        id="subTaskDeleteBtn-${index}"
        class="cursor"
        src="./assets/priority/delete.svg"
        alt="Delete"
        onclick="deleteSubTask(${index})"
      />
    </div>
  </div>`;
  });
}

//  Data to fireBase
async function uploadToFireBase(path = "", data = {}) {
  let response = await fetch(`${BASE_URL}` + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseJs = await response.json());
}

function getPriorityValue() {
  const priorityRadios = document.querySelectorAll(
    ".radio-group input[type='radio']"
  );
  let selectedPriority;
  priorityRadios.forEach((radio) => {
    if (radio.checked) {
      selectedPriority = radio.value;
    }
  });
  return selectedPriority;
}

function variableId() {
  title = document.getElementById("addTaskTittle").value;
  description = document.getElementById("addTaskDescription").value;
  assignet = checked;
  date = document.getElementById("addTaskDate").value;
  prio = getPriorityValue();
  category = document.getElementById("categorySelectId").value;
  subtask = subtasks;

  return { title, description, assignet, date, prio, category, subtask };
}

function addDataToFireBase() {
  const taskData = variableId();
  uploadToFireBase("task", {
    title: taskData.title,
    description: taskData.description,
    assignet: taskData.assignet,
    date: taskData.date,
    prio: taskData.prio,
    category: taskData.category,
    subtask: taskData.subtask,
  });
}

function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

window.onclick = function (event) {
  if (
    !event.target.matches(".profilPic") &&
    !event.target.closest(".profilPic")
  ) {
    const dropdown = document.getElementById("dropdown");
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    }
  }
};