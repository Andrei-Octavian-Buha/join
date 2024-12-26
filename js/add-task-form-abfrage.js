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
  }
}

function requiredValidationAddTaskToBoard() {
  let inputValue = getValueFromInputs();
  if (!inputValue.title) {
    document.getElementById("reqTitle").classList.remove("dNone");
  } else if (!inputValue.date) {
    document.getElementById("reqDate").classList.remove("dNone");
  } else if (inputValue.category == 0) {
    document.getElementById("reqCategory").classList.remove("dNone");
  } else {
    addDataToFireBaseFromBoard();
    taskInit();
    let template = document.getElementById("add-task-template");
    template.classList.add("dNone");
  }
}
