function showOverlayAddTask() {
  document.getElementById("add-task-template").classList.remove("dNone");
}

function hideOverlayAddTask() {
  let template = document.getElementById("add-task-template");
  template.classList.add("dNone");
}

function showOverlayInfoCard() {
  document.getElementById("taskInfoCard").classList.remove("dNone");
}

function hideOverlayInfoCard() {
  document.getElementById("taskInfoCard").classList.add("dNone");
}

function hideshowListCard() {
  document.getElementById("showListCard").classList.add("dNone");
}
