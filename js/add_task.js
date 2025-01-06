const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/";

async function init() {
  await loadContacts();
  // updateEmptyColumnMessages();
}
function subtasktrigger() {
  hideSubTaskAddBtn();
  deleteInputSubTask();
  addSubTask();
}

function sortContacts(contacts) {
  return contacts.sort((a, b) => {
    let nameA = a.cont.name.toUpperCase();
    let nameB = b.cont.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

function createContactElement(element) {
  let container = document.createElement("label");
  container.id = `ContainerID${element.id}`;
  container.classList.add("dropDownContactContainer");
  let initials = element.cont.name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2);
  let color = getColorForInitial(initials[0]);
  container.innerHTML = dropDownContactNameHTML(element, color, initials);
  return container;
}

function renderContacts(contacts) {
  let dropdown = document.getElementById("dropDownBodyId");
  dropdown.innerHTML = "";
  contacts.forEach((element) => {
    let container = createContactElement(element);
    dropdown.appendChild(container);
    startEvent(element);
  });
}

async function loadContactsData() {
  let ContactResponse = await getAllContacts("contacts");
  let UserKeyArray = Object.keys(ContactResponse);
  return UserKeyArray.map((id) => ({
    id: id,
    cont: ContactResponse[id],
  }));
}

async function loadContacts() {
  let contactsData = await loadContactsData();
  let sortedContacts = sortContacts(contactsData);
  renderContacts(sortedContacts);
  subtasktrigger();
}

async function loadContactsForEdit(taskId) {
  let contactsData = await loadContactsData();
  let sortedContacts = sortContacts(contactsData);
  renderContactsforEdit(sortedContacts, taskId);
}

function renderContactsforEdit(contacts, taskId) {
  let dropdown = document.getElementById("dropDownBodyId");
  dropdown.innerHTML = "";
  const task = tasks.find((t) => t.id === taskId);
  const assignedContactKeys = Array.isArray(task.task.assignet)
    ? task.task.assignet.map((contact) => contact.key)
    : [];
  contacts.forEach((element) => {
    let container = createContactElementforEdit(element, taskId);
    const checkbox = container.querySelector(`input[type="checkbox"]`);
    console.log("element.id:", element.id);
    if (assignedContactKeys.includes(element.id)) {
      checkbox.checked = true;
    }
    dropdown.appendChild(container);
    startEvent(element);
  });
}

function createContactElementforEdit(element, taskId) {
  let container = document.createElement("label");
  container.id = `ContainerID${element.id}`;
  container.classList.add("dropDownContactContainer");

  let initials = element.cont.name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2);

  let color = getColorForInitial(initials[0]);
  container.innerHTML = dropDownContactNameHTML(
    element,
    color,
    initials,
    taskId
  );
  return container;
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

function startEvent(contactId) {
  const ck = document.getElementById(`CheckboxID${contactId.id}`);
  if (ck) {
    ck.addEventListener("change", () => {
      whenChecked(contactId);
    });
  } else {
    console.error(`CheckboxID${contactId.id} not found`);
  }
}

async function getAllContacts(path = "") {
  let response = await fetch(`${BASE_URL}` + path + ".json");
  return (responseJs = await response.json());
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
}

const maxDisplay = 3;

function updateTextAndClearAssignees(
  textElement,
  assigneeElement,
  checkedLength
) {
  if (checkedLength === 0) {
    textElement.innerHTML = "Select contacts to assign";
    assigneeElement.innerHTML = "";
  } else {
    textElement.innerHTML = "An |";
  }
}

function handleCheckboxState(ck, container, contactId) {
  if (ck.checked) {
    if (!checked.includes(contactId.id)) {
      checked.push({ name: contactId.cont.name, key: contactId.id });
    }
    container.classList.add("checkedBgColor");
  } else {
    const index = checked.findIndex((item) => item.key === contactId.id);
    if (index > -1) {
      checked.splice(index, 1);
    }
    container.classList.remove("checkedBgColor");
  }
}

function generateInitialsHTML(checked, assigneeElement, maxCount) {
  checked.slice(0, maxCount).forEach((element) => {
    let initials = element.name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("")
      .slice(0, 2);
    let color = getColorForInitial(initials[0]);
    assigneeElement.innerHTML += `<p class="firstLetterCircle" style="background-color: ${color};">${initials}</p>`;
  });
}

function generateRemainingCountHTML(checked, assigneeElement, maxCount) {
  const remainingCount = checked.length - maxCount;
  if (remainingCount > 0) {
    assigneeElement.innerHTML += `
      <div class="firstLetterCircle" style="background: linear-gradient(135deg,rgba(123, 97, 119, 0.81) 0%,rgb(36, 178, 29) 100%);">
        +${remainingCount}
      </div>
    `;
  }
}

function renderAssignees(checked, assigneeElement, maxCount) {
  assigneeElement.innerHTML = ""; // Clear existing content
  if (checked.length > maxCount) {
    generateInitialsHTML(checked, assigneeElement, maxCount);
    generateRemainingCountHTML(checked, assigneeElement, maxCount);
  } else {
    generateInitialsHTML(checked, assigneeElement, checked.length);
  }
}

function whenChecked(contactId) {
  let ck = document.getElementById(`CheckboxID${contactId.id}`);
  let container = document.getElementById(`ContainerID${contactId.id}`);
  let text = document.getElementById("dinamicText");
  let assigneeElement = document.getElementById("whoIsAssignet");

  // Update text and clear assignees if necessary
  updateTextAndClearAssignees(text, assigneeElement, checked.length);

  // Handle checkbox state
  handleCheckboxState(ck, container, contactId);

  // Render assignees
  renderAssignees(checked, assigneeElement, maxDisplay);
}

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
    if (inputText.value && subtasks.length <= 1) {
      subtasks.push({ name: inputText.value, checked: false });
    }
    hideEditAddBtn();
    rendSubTask();
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
  inputToEdit.value = subtasks[index].name;
  subtasks[index].name = inputToEdit.value;
  console.log(subtasks);
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
      subtasks[index].name = inputText.value;
      console.log(subtasks);

      rendSubTask();
    } else {
      deleteSubTask(index);
    }
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
    toRender.innerHTML += rendsubtaskHTML(subtask, index);
  });
}

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
  if (!Array.isArray(subtasks)) {
    subtasks = [];
  }
  return {
    title,
    description,
    assignet,
    date,
    prio,
    category,
    subtask: subtasks,
  };
}

function handleFormSubmit(event) {
  event.preventDefault();
  // addDataToFireBase();
  requiredValidation();
  // showPopupAndRedirect();
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
    progress: "todo",
  });
}

function addDataToFireBaseFromBoard() {
  const taskData = variableId();
  uploadToFireBase("task", {
    title: taskData.title,
    description: taskData.description,
    assignet: taskData.assignet,
    date: taskData.date,
    prio: taskData.prio,
    category: taskData.category,
    subtask: taskData.subtask,
    progress: "todo",
  });
}

function showPopupAndRedirect() {
  const popup = document.getElementById("popup");
  popup.classList.remove("hidden");
  popup.classList.add("visible");
  setTimeout(() => {
    window.location.href = "board.html";
  }, 2500);
}

document.addEventListener("DOMContentLoaded", () => {
  const dropDownHeader = document.getElementById("dropDownHeaderId");
  const dropDownBody = document.getElementById("dropDownBodyId");
  if (!dropDownHeader || !dropDownBody) {
    return;
  }
  let isDropDownOpen = false;
  dropDownHeader.addEventListener("click", (event) => {
    isDropDownOpen = !isDropDownOpen;
    event.stopPropagation();
  });

  document.addEventListener("click", (event) => {
    if (isDropDownOpen && !dropDownBody.contains(event.target)) {
      isDropDownOpen = false;
      dropDownBody.classList.add("dNone");
    }
  });

  dropDownBody.addEventListener("click", (event) => {
    const contactContainer = event.target.closest(".dropDownContactContainer");
    if (contactContainer) {
      const checkbox = contactContainer.querySelector(".contactCheckbox");
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
      }
    }
  });
});
