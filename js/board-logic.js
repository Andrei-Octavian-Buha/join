function showOverlayAddTask() {
  document.getElementById("add-task-template").classList.remove("dNone");
}

function hideOverlayAddTask() {
  let template = document.getElementById("add-task-template");
  template.classList.add("dNone");
}

function showOverlayInfoCard() {
  // Blende die Card ein und zeige den Hintergrund
  const overlay = document.getElementById("overlay");
  const card = document.getElementById("taskInfoCard");

  // Sicherstellen, dass der Overlay-Hintergrund angezeigt wird
  overlay.style.display = "block";
  
  // Animation starten
  card.classList.add("showCard");

  // Event-Listener für das Schließen der Card durch Klicken auf den Hintergrund
  overlay.addEventListener("click", closeOverlayInfoCard);
}

function hideOverlayInfoCard() {
  const overlay = document.getElementById("overlay");
  const card = document.getElementById("taskInfoCard");

  // Blende den Overlay-Hintergrund aus
  overlay.style.display = "none";

  // Animation zum Schließen der Card
  card.classList.remove("showCard");
  card.classList.add("hideCard");

  // Event-Listener entfernen, wenn die Card geschlossen wird
  setTimeout(() => {
    card.classList.remove("hideCard");
  }, 500); // Warte bis die Animation vorbei ist
}

function closeOverlayInfoCard() {
  // Wenn der Hintergrund angeklickt wird, schließe die Card
  hideOverlayInfoCard();
}

function hideshowListCard() {
  document.getElementById("showListCard").classList.add("dNone");
}
