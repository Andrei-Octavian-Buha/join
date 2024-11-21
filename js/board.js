// function newPost() {
//     const template = document.getElementById("cardTemplate");
//     const newCard = template.content.cloneNode(true);
//     const container = document.getElementById("open");

//     container.insertBefore(newCard, container.firstChild);

//     const addedCard = container.firstChild;
//     addDragFunctionality(addedCard);
// }

function newProgress() {
  const template = document.getElementById("cardTemplate");
  const newCard = template.content.cloneNode(true);
  const container = document.getElementById("closed");

  container.insertBefore(newCard, container.firstChild);

  const addedCard = container.firstChild;
  addDragFunctionality(addedCard);
}

function newFeedback() {
  const template = document.getElementById("cardTemplate");
  const newCard = template.content.cloneNode(true);
  const container = document.getElementById("wait");

  container.insertBefore(newCard, container.firstChild);

  const addedCard = container.firstChild;
  addDragFunctionality(addedCard);
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
