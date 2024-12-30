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

function resetErrorStates() {
  // Fehleranzeigen zurücksetzen
  document.getElementById("reqTitle").classList.add("dNone");
  document.getElementById("reqDate").classList.add("dNone");
  document.getElementById("reqCategory").classList.add("dNone");

  // Fehlerklassen von den Eingabefeldern entfernen
  document.getElementById("addTaskTittle").classList.remove("input-error");
  document.getElementById("addTaskDate").classList.remove("input-error");
  document.getElementById("categorySelectId").classList.remove("input-error");
}

function requiredValidation() {
  let inputValue = getValueFromInputs();

  // Fehleranzeigen und -klassen zurücksetzen
  resetErrorStates();

  if (!inputValue.title) {
    document.getElementById("reqTitle").classList.remove("dNone");
    document.getElementById("addTaskTittle").classList.add("input-error"); // Rote Umrandung hinzufügen
  } else if (!inputValue.date) {
    document.getElementById("reqDate").classList.remove("dNone");
    document.getElementById("addTaskDate").classList.add("input-error"); // Rote Umrandung hinzufügen
  } else if (inputValue.category == 0) {
    document.getElementById("reqCategory").classList.remove("dNone");
    document.getElementById("categorySelectId").classList.add("input-error"); // Rote Umrandung hinzufügen
  } else {
    addDataToFireBase();
    showPopupAndRedirect();
  }
}

function requiredValidationAddTaskToBoard() {
  let inputValue = getValueFromInputs();
  if (!inputValue.title) {
    document.getElementById("reqTitle").classList.remove("dNone");
    document.getElementById("addTaskTittle").classList.add("input-error");
  } else if (!inputValue.date) {
    document.getElementById("reqDate").classList.remove("dNone");
    document.getElementById("addTaskDate").classList.add("input-error");
  } else if (inputValue.category == 0) {
    document.getElementById("reqCategory").classList.remove("dNone");
    document.getElementById("categorySelectId").classList.add("input-error");
  } else {
    addDataToFireBaseFromBoard();
    taskInit();
    let template = document.getElementById("add-task-template");
    template.classList.add("dNone");
  }
}
