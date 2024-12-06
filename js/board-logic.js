function showOverlayAddTask() {
  document.getElementById("add-task-template").classList.remove("dNone");
}

function hideOverlayAddTask() {
  let template = document.getElementById("add-task-template");
  template.classList.add("dNone");
}

function showOverlayInfoCard() {
  const overlay = document.getElementById("overlay");
  const card = document.getElementById("taskInfoCard");

  overlay.style.display = "block";
  
  card.classList.add("showCard");

  overlay.addEventListener("click", closeOverlayInfoCard);
}

function hideOverlayInfoCard() {
  const overlay = document.getElementById("overlay");
  const card = document.getElementById("taskInfoCard");

  overlay.style.display = "none";

  card.classList.remove("showCard");
  card.classList.add("hideCard");

  setTimeout(() => {
    card.classList.remove("hideCard");
  }, 500); 
}

function closeOverlayInfoCard() {
  hideOverlayInfoCard();
}

function hideshowListCard() {
  document.getElementById("showListCard").classList.add("dNone");
}
