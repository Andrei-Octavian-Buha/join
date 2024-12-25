function rendsubtaskHTML(subtask, index) {
  return `<div class="subtaskContainer" id="subtaskContainerId${index}">
    <div class="subtaskInputWithDot">
      <span id="idSpanSubTaskEdit${index}" class="dot"></span>
      <input
        id="toEditInputSubTask-${index}"
        type="text"
        class="inputsubTask"
        readonly
        placeholder="${subtask}"
      />
    </div>
    <div class="subtaskEdiBtns">
      <img
        id="subTaskEditBtn-${index}"
        class="cursor"
        src="./assets/priority/edit.svg"
        alt="Edit"
        onclick="editAddedSubTask(${index})"
      />
      <img
      id="AddSubTaskStep2-${index}"
      class="cursor dNone"
      src="./assets/subtask/check.svg"
      alt=""
      onclick="addEditcheck(${index})"
      />
      <img src="./assets/priority/bar.svg" alt="Separator" />
      <img
        id="subTaskDeleteBtn-${index}"
        class="cursor"
        src="./assets/priority/delete.svg"
        alt="Delete"
        onclick="deleteSubTask(${index})"
      />
    </div>
  </div>`;
}

function dropDownContactNameHTML(element, color, initials) {
  return `    <div class="dropDownContactName">
      <p class="firstLetterCircle" style="background-color: ${color};">${initials}</p>
      <p class="dropDownFullName">${element.cont.name}</p>
    </div>
    <input
      type="checkbox"
      class="contactCheckbox"
      id="CheckboxID${element.id}"
    />
    <label for="CheckboxID${element.id}" class="checkedNachAufgabe"></label>
    `;
}
