function getValueFromInputs() {
  title = document.getElementById("addTaskTittle").value;
  date = document.getElementById("addTaskDate").value;
  category = document.getElementById("categorySelectId").value;
  return {
    title,
    date,
    category,
  };
}

function requiredValidation() {
  let inputValue = getValueFromInputs();
  if (!inputValue.title) {
    document.getElementById("reqTitle").classList.remove("dNone");
  } else if (!inputValue.date) {
    document.getElementById("reqDate").classList.remove("dNone");
  } else if (inputValue.category == 0) {
    document.getElementById("reqCategory").classList.remove("dNone");
  } else {
    addDataToFireBase();
    showPopupAndRedirect();
    subtasks = [];
  }
}

function resetErrorStates() {
  document.getElementById("reqTitle").classList.add("dNone");
  document.getElementById("reqDate").classList.add("dNone");
  document.getElementById("reqCategory").classList.add("dNone");

  document.getElementById("addTaskTittle").classList.remove("input-error");
  document.getElementById("addTaskDate").classList.remove("input-error");
  document.getElementById("categorySelectId").classList.remove("input-error");
}

function validateInput(inputValue) {
  if (!inputValue.title) {
    showError("reqTitle", "addTaskTittle");
    return false;
  }
  if (!inputValue.date) {
    showError("reqDate", "addTaskDate");
    return false;
  }
  if (inputValue.category == 0) {
    showError("reqCategory", "categorySelectId");
    return false;
  }
  return true;
}

function showError(errorId, inputId) {
  document.getElementById(errorId).classList.remove("dNone");
  document.getElementById(inputId).classList.add("input-error");
}

function requiredValidation() {
  let inputValue = getValueFromInputs();
  resetErrorStates();
  if (validateInput(inputValue)) {
    addDataToFireBase();
    showPopupAndRedirect();
  }
}

function requiredValidationAddTaskToBoard() {
  let inputValue = getValueFromInputs();
  if (validateInput(inputValue)) {
    addDataToFireBaseFromBoard();
    taskInit();
    document.getElementById("add-task-template").classList.add("dNone");
    subtasks = [];
  }
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
