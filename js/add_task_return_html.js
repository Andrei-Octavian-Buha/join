/**
 * Generates the HTML structure for displaying a subtask.
 *
 * @function rendsubtaskHTML
 * @param {Object} subtask - An object representing the subtask. Expected to have a "name" property.
 * @param {number} index - The index of the subtask, used to uniquely identify elements in the DOM.
 * @returns {string} - A string containing the HTML structure for the subtask.
 *
 * @description
 * This function dynamically creates and returns the HTML string for a single subtask. 
 * The HTML includes:
 * - A container div with a unique ID for the subtask.
 * - An input field displaying the subtask name, initially readonly.
 * - Buttons for editing, confirming edits, and deleting the subtask, each with unique IDs.
 * - A separator image for design purposes.
 *
 * Key Features:
 * - The `placeholder` attribute of the input field is set to the `subtask.name` value.
 * - Event listeners are added to the edit, confirm, and delete buttons via `onclick` attributes.
 * - Unique IDs are generated for each element using the provided `index` parameter.
 *  */
function rendsubtaskHTML(subtask, index) {
  return `<div class="subtaskContainer" id="subtaskContainerId${index}">
    <div class="subtaskInputWithDot">
      <span id="idSpanSubTaskEdit${index}" class="dot"></span>
      <input
        id="toEditInputSubTask-${index}"
        type="text"
        class="inputsubTask"
        readonly
        placeholder="${subtask.name}"
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

/**
 * Generates the HTML structure for a contact dropdown entry.
 *
 * @function dropDownContactNameHTML
 * @param {Object} element - An object representing the contact, expected to have a `cont` property containing `name`, and an `id`.
 * @param {string} color - A string representing the background color for the initials circle.
 * @param {string} initials - A string containing the initials of the contact's name.
 * @param {number|string} taskId - An optional parameter for identifying the task associated with this dropdown (unused in this function but can help in context).
 * @returns {string} - A string containing the HTML structure for a contact dropdown entry.
 *
 * @description
 * This function dynamically creates and returns an HTML string for a single contact entry in a dropdown. 
 * The HTML includes:
 * - A styled circle displaying the contact's initials, with a customizable background color.
 * - The full name of the contact.
 * - A checkbox for selecting the contact, with a unique ID based on the contact's `id`.
 * - A label for the checkbox, styled as a clickable element.
 *
 * Key Features:
 * - The `firstLetterCircle` div visually represents the contact using the provided initials and background color.
 * - The contact's full name is displayed in a `<p>` tag.
 * - Each checkbox and its corresponding label are uniquely associated using the `id` and `for` attributes.
*  */
function dropDownContactNameHTML(element, color, initials, taskId) {
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
