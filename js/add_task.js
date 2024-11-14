const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/";

let contacts = [];

function init() {
  loadContacts();
  subtasktrigger();
}

async function loadContacts() {
  let ContactResponse = await getAllContacts("contacts");
  let UserKeyArray = Object.keys(ContactResponse);
  let dropdown = document.getElementById("dropDownBodyId");
  dropdown.innerHTML = ""; // Golim dropdown-ul
  contacts = UserKeyArray.map((id) => ({
    id: id,
    cont: ContactResponse[id],
  }));
  contacts.forEach((element) => {
    let container = document.createElement("div");
    container.id = `ContainerID${element.id}`;
    container.classList.add("dropDownContactContainer");
    container.innerHTML = `
      <div class="dropDownContactName">
        <p class="firstLetterCircle">SM</p>
        <p class="dropDownFullName">${element.cont.name}</p>
      </div>
      <input
        type="checkbox"
        class="contactCheckbox"
        id="CheckboxID${element.id}"
      />
    `;
    dropdown.appendChild(container); // Adăugăm containerul în dropdown
    startEvent(element); // Atașăm event listener după ce elementul este în DOM
  });
}

async function getAllContacts(path = "") {
  let response = await fetch(`${BASE_URL}` + path + ".json");
  return (responseJs = await response.json());
}

function startEventListner() {
  let clickHeader = document.getElementById("dropDownHeaderId");
  let body = document.getElementById("dropDownBodyId");
  clickHeader.addEventListener("click", () => {
    body.classList.toggle("dNone");
  });
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

let checked = [];

function whenChecked(contactId) {
  let ck = document.getElementById(`CheckboxID${contactId.id}`);
  let container = document.getElementById(`ContainerID${contactId.id}`);
  let text = document.getElementById("dinamicText");
  let assignet = document.getElementById("whoIsAssignet");
  text.innerHTML = "";
  assignet.innerHTML = "";
  if (ck.checked) {
    if (!checked.includes(contactId.id)) {
      checked.push({ name: contactId.cont.name, key: contactId.id });
    }
    container.classList.add("checkedBgColor");
    console.log(`Added checkedBgColor to ContainerID${contactId.id}`);
  } else {
    const index = checked.indexOf(contactId.cont.name);
    if (index > -1) {
      checked.splice(index, 1);
    }
    container.classList.remove("checkedBgColor");
  }
  checked.forEach((element) => {
    assignet.innerHTML += `<p class="firstLetterCircle">${element}</p>`;
  });
  text.innerHTML = "An |";
  if (checked <= 0) {
    text.innerHTML = "Select contacts to assign";
    assignet.innerHTML = "";
    console.log(checked);
  }
}

// SUBTASK
let subtasks = [];

function subtasktrigger() {
  hideSubTaskAddBtn();
  deleteInputSubTask();
  addSubTask();
}
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
  changeEditWithCheck(index);
  inputToEdit.classList.remove("inputsubTask");
  inputToEdit.removeAttribute("readonly");
  inputToEdit.value = subtasks[index];
}

function changeEditWithCheck(index) {
  document.getElementById(`AddSubTaskStep2-${index}`).classList.remove("dNone");
  document.getElementById(`subTaskEditBtn-${index}`).classList.add("dNone");
  document.getElementById(`idSpanSubTaskEdit${index}`).classList.add("dNone");
}
function finishEditWithCheck(index) {
  document.getElementById(`AddSubTaskStep2-${index}`).classList.add("dNone");
  document.getElementById(`subTaskEditBtn-${index}`).classList.remove("dNone");
  document
    .getElementById(`idSpanSubTaskEdit${index}`)
    .classList.remove("dNone");
}

function addeditcheck(index) {
  let btn = document.getElementById(`AddSubTaskStep2-${index}`);
  let inputText = document.getElementById(`toEditInputSubTask-${index}`);
  btn.addEventListener("click", () => {
    if (inputText.value) {
      subtasks[index] = inputText.value;
    } else {
      deleteSubTask(index);
    }
    console.log(subtasks);
  });
}

function rendSubTask() {
  let toRender = document.getElementById("renderSubTask");
  toRender.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    toRender.innerHTML += `<div class="subtaskContainer">
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
      onclick="addeditcheck(${index})"
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

//  DATA TO FireBASE upload

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
  console.log(addTask);
}

// trebuie sa urc sus

// Title
// Description
// Assignet To
// Due Date
// Prio
// Category
// SubTask
