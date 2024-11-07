function startEventListner() {
  let clickHeader = document.getElementById("dropDownHeaderId");
  let body = document.getElementById("dropDownBodyId");
  clickHeader.addEventListener("click", () => {
    body.classList.toggle("dNone");
  });
}

function bg() {
  let checkbox = document.getElementById("contactIdCheckbox");
  let container = document.getElementById("dropDownContactContainerId");
  if (checkbox.checked) {
    container.classList.add("checkedBgColor");
  } else {
    container.classList.remove("checkedBgColor");
  }
}

function startEvent() {
  document.getElementById("contactIdCheckbox").addEventListener("change", bg);
  document.getElementById("contactIdCheckbox2").addEventListener("change", bg);
}
