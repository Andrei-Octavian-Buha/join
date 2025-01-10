/**
 * Adds task data to Firebase.
 */
function addDataToFireBase() {
  const taskData = variableId();
  uploadToFireBase("task", {
    title: taskData.title,
    description: taskData.description,
    assignet: taskData.assignet,
    date: taskData.date,
    prio: taskData.prio,
    category: taskData.category,
    subtask: taskData.subtask,
    progress: "todo",
  });
}

/**
 * Retrieves the task details from the form inputs.
 * @returns {Object} The task details.
 */
function variableId() {
  title = document.getElementById("addTaskTittle").value;
  description = document.getElementById("addTaskDescription").value;
  assignet = checked;
  date = document.getElementById("addTaskDate").value;
  prio = getPriorityValue();
  category = document.getElementById("categorySelectId").value;
  if (!Array.isArray(subtasks)) {
    subtasks = [];
  }
  return {
    title,
    description,
    assignet,
    date,
    prio,
    category,
    subtask: subtasks,
  };
}

/**
 * Retrieves the value of the selected priority radio button.
 * @returns {string} The value of the selected priority.
 */
function getPriorityValue() {
  const priorityRadios = document.querySelectorAll(
    ".radio-group input[type='radio']"
  );
  let selectedPriority;
  priorityRadios.forEach((radio) => {
    if (radio.checked) {
      selectedPriority = radio.value;
    }
  });
  return selectedPriority;
}

/**
 * Uploads data to Firebase.
 * @param {string} [path=""] - The path to append to the base URL.
 * @param {Object} [data={}] - The data to upload.
 * @returns {Promise<Object>} A promise that resolves to the JSON response.
 */
async function uploadToFireBase(path = "", data = {}) {
  let response = await fetch(`${BASE_URL}` + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseJs = await response.json());
}

/**
 * Saves edits to a subtask or deletes it if the input is empty.
 * @param {number} index - The index of the subtask to update.
 */
function addEditcheck(index) {
  let btn = document.getElementById(`AddSubTaskStep2-${index}`);
  let inputText = document.getElementById(`toEditInputSubTask-${index}`);
  btn.addEventListener("click", () => {
    if (inputText.value) {
      subtasks[index].name = inputText.value;
      rendSubTask();
    } else {
      deleteSubTask(index);
    }
  });
}

/**
 * Deletes a subtask by index and re-renders the subtasks.
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubTask(index) {
  subtasks.splice(index, 1);
  rendSubTask();
}

/**
 * Edits an existing subtask by index and enables editing mode.
 * @param {number} index - The index of the subtask to edit.
 */
function editAddedSubTask(index) {
  let inputToEdit = document.getElementById(`toEditInputSubTask-${index}`);
  inputToEdit.classList.remove("inputsubTask");
  inputToEdit.classList.add("inputsubTaskActive");
  backgroundEdit(index);
  changeEditWithCheck(index);
  inputToEdit.removeAttribute("readonly");
  inputToEdit.value = subtasks[index].name;
  subtasks[index].name = inputToEdit.value;
}

/**
 * Sorts an array of contact objects alphabetically by name.
 * @function
 * @param {Array<Object>} contacts - The array of contact objects to be sorted.
 * @returns {Array<Object>} Sorted array of contact objects.
 */
function sortContacts(contacts) {
  return contacts.sort((a, b) => {
    let nameA = a.cont.name.toUpperCase();
    let nameB = b.cont.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

/**
 * Changes the edit button to a save button for a specific subtask.
 * @param {number} index - The index of the subtask to update.
 */
function changeEditWithCheck(index) {
  document.getElementById(`AddSubTaskStep2-${index}`).classList.remove("dNone");
  document.getElementById(`subTaskEditBtn-${index}`).classList.add("dNone");
  document.getElementById(`idSpanSubTaskEdit${index}`).classList.add("dNone");
}
