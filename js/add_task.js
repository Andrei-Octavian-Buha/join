const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/";

let contacts = [];

function init() {
  loadContacts();
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
      checked.push(contactId.cont.name);
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
