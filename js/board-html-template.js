/**
 * Generates the HTML structure for an editable task card.
 *
 * @param {Object} task - The task object to populate the card with.
 * @param {string} task.id - The unique identifier of the task.
 * @param {Object} task.task - The details of the task.
 * @param {string} task.task.title - The title of the task.
 * @param {string} task.task.description - A description of the task.
 * @param {string} task.task.date - The due date of the task in ISO format (YYYY-MM-DD).
 * @param {string} task.task.prio - The priority of the task ("urgent", "medium", or "low").
 *
 * @returns {string} - A string representing the HTML structure for the task edit card.
 *
 * The generated HTML includes:
 * - Input fields for the task title, description, and due date.
 * - Priority selection buttons (urgent, medium, low).
 * - A dropdown menu for selecting assigned contacts.
 * - A section to add subtasks with options to create, edit, and delete subtasks.
 * - A button to confirm and save changes, triggering the `toDoForUpdateTaskOnFireBase` function with the task ID.
 *
 */
function showEditCard(task) {
  return `
          
              <div class="taskHeder">
                  <div>
                  </div>
                  <span onclick="closeOverlayInfoCard()" class="cursor closeX">X</span>
              </div>
                          <div class="testA">
              <label for="addTaskTittle"
                >Title<span class="req">*</span>
              </label>
              <input
                id="addTaskTittle"
                type="text"
                class="inputStyle"
                placeholder="Enter a title"
                value="${task.task.title}"
                required
              />
            </div>
                        <div class="testA">
              <label for="addTaskDescription">Description</label>
              <textarea
                name=""
                id="addTaskDescription"
                placeholder="Enter a Description"
                class="inputStyle"
              >${task.task.description}</textarea>
                        <div class="testA">
              <span>Due date<span class="req">*</span></span>
              <input type="date" class="inputStyle" id="addTaskDate" value="${
                task.task.date
              }"/>
            </div>

            <div class="priority">
              <span>Prio</span>
              <div class="radio-group">
                <label class="custom-radio-urgent" for="urgentBtn">
                  <input
                    type="radio"
                    name="group1"
                    value="urgent"
                    id="urgentBtn"
                    ${task.task.prio === "urgent" ? "checked" : ""}
                  />
                  <span class="radio-btn-urgent">
                    Urgent
                    <svg
                      class="imgCheckedUrgent"
                      width="21"
                      height="15"
                      viewBox="0 0 21 15"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.5708 14.755C19.3361 14.7554 19.1076 14.6805 18.9187 14.5414L10.6666 8.45824L2.4146 14.5414C2.29874 14.627 2.16716 14.6889 2.02736 14.7237C1.88756 14.7584 1.74228 14.7653 1.59981 14.7439C1.45734 14.7226 1.32048 14.6734 1.19703 14.5992C1.07359 14.525 0.965978 14.4272 0.880349 14.3114C0.79472 14.1957 0.732748 14.0642 0.697971 13.9245C0.663194 13.7848 0.656294 13.6396 0.677664 13.4973C0.720823 13.2097 0.876514 12.9511 1.11049 12.7783L10.0146 6.20786C10.2033 6.06826 10.4319 5.99292 10.6666 5.99292C10.9014 5.99292 11.13 6.06826 11.3187 6.20786L20.2228 12.7783C20.4087 12.9153 20.5466 13.1074 20.6168 13.3272C20.6869 13.5471 20.6858 13.7835 20.6135 14.0027C20.5411 14.2219 20.4014 14.4126 20.2141 14.5477C20.0269 14.6828 19.8017 14.7554 19.5708 14.755Z"
                      />
                      <path
                        d="M19.5708 9.00581C19.3361 9.00621 19.1076 8.93136 18.9187 8.79226L10.6667 2.7091L2.4146 8.79226C2.18063 8.96507 1.88754 9.03793 1.59981 8.9948C1.31209 8.95167 1.05329 8.7961 0.880353 8.5623C0.707418 8.3285 0.63451 8.03563 0.677669 7.74811C0.720828 7.4606 0.876518 7.20199 1.11049 7.02919L10.0146 0.45871C10.2033 0.319119 10.4319 0.243774 10.6667 0.243774C10.9014 0.243774 11.13 0.319119 11.3187 0.45871L20.2228 7.02919C20.4087 7.1661 20.5466 7.35822 20.6168 7.5781C20.6869 7.79797 20.6858 8.03438 20.6135 8.25356C20.5412 8.47274 20.4014 8.6635 20.2141 8.79859C20.0269 8.93368 19.8017 9.0062 19.5708 9.00581Z"
                      />
                    </svg>
                  </span>
                </label>

                <label class="custom-radio-medium">
                  <input type="radio" name="group1" value="medium" ${
                    task.task.prio === "medium" ? "checked" : ""
                  }/>
                  <span class="radio-btn-medium">
                    Medium
                    <svg
                      class="imgCheckedMedium"
                      width="21"
                      height="8"
                      viewBox="0 0 21 8"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.7596 7.91693H1.95136C1.66071 7.91693 1.38197 7.80063 1.17645 7.59362C0.970928 7.3866 0.855469 7.10584 0.855469 6.81308C0.855469 6.52032 0.970928 6.23955 1.17645 6.03254C1.38197 5.82553 1.66071 5.70923 1.95136 5.70923H19.7596C20.0502 5.70923 20.329 5.82553 20.5345 6.03254C20.74 6.23955 20.8555 6.52032 20.8555 6.81308C20.8555 7.10584 20.74 7.3866 20.5345 7.59362C20.329 7.80063 20.0502 7.91693 19.7596 7.91693Z"
                      />
                      <path
                        d="M19.7596 2.67376H1.95136C1.66071 2.67376 1.38197 2.55746 1.17645 2.35045C0.970928 2.14344 0.855469 1.86267 0.855469 1.56991C0.855469 1.27715 0.970928 0.996386 1.17645 0.789374C1.38197 0.582363 1.66071 0.466064 1.95136 0.466064L19.7596 0.466064C20.0502 0.466064 20.329 0.582363 20.5345 0.789374C20.74 0.996386 20.8555 1.27715 20.8555 1.56991C20.8555 1.86267 20.74 2.14344 20.5345 2.35045C20.329 2.55746 20.0502 2.67376 19.7596 2.67376Z"
                      />
                    </svg>
                  </span>
                </label>
                <label class="custom-radio-low">
                  <input type="radio" name="group1" value="low"  ${
                    task.task.prio === "low" ? "checked" : ""
                  }/>
                  <span class="radio-btn-low">
                    Low
                    <svg
                      class="imgCheckedLow"
                      width="21"
                      height="15"
                      viewBox="0 0 21 15"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.334 9.00589C10.0994 9.0063 9.87085 8.93145 9.682 8.79238L0.778897 2.22264C0.663059 2.13708 0.565219 2.02957 0.490964 1.90623C0.416709 1.78289 0.367492 1.64614 0.346125 1.50379C0.30297 1.21631 0.37587 0.923473 0.548786 0.689701C0.721702 0.455928 0.980471 0.300371 1.26817 0.257248C1.55586 0.214126 1.84891 0.286972 2.08286 0.45976L10.334 6.54224L18.5851 0.45976C18.7009 0.374204 18.8325 0.312285 18.9723 0.277538C19.1121 0.242791 19.2574 0.235896 19.3998 0.257248C19.5423 0.2786 19.6791 0.32778 19.8025 0.401981C19.926 0.476181 20.0336 0.573948 20.1192 0.689701C20.2048 0.805453 20.2668 0.936923 20.3015 1.07661C20.3363 1.21629 20.3432 1.36145 20.3218 1.50379C20.3005 1.64614 20.2513 1.78289 20.177 1.90623C20.1027 2.02957 20.0049 2.13708 19.8891 2.22264L10.986 8.79238C10.7971 8.93145 10.5686 9.0063 10.334 9.00589Z"
                      />
                      <path
                        d="M10.334 14.7544C10.0994 14.7548 9.87085 14.68 9.682 14.5409L0.778897 7.97117C0.544952 7.79839 0.389279 7.53981 0.346125 7.25233C0.30297 6.96485 0.37587 6.67201 0.548786 6.43824C0.721702 6.20446 0.980471 6.04891 1.26817 6.00578C1.55586 5.96266 1.84891 6.03551 2.08286 6.2083L10.334 12.2908L18.5851 6.2083C18.8191 6.03551 19.1121 5.96266 19.3998 6.00578C19.6875 6.04891 19.9463 6.20446 20.1192 6.43824C20.2921 6.67201 20.365 6.96485 20.3218 7.25233C20.2787 7.53981 20.123 7.79839 19.8891 7.97117L10.986 14.5409C10.7971 14.68 10.5686 14.7548 10.334 14.7544Z"
                      />
                    </svg>
                  </span>
                </label>
              </div>
            </div>


                     <div class="testA">
              <span>Assignet To</span>
              <div class="dropDownGroup">
                <div id="dropDownHeaderId" class="dropDownHeader">
                  <span id="dinamicText">Select contacts to assign</span>
                  <img src="./assets/menu/arrow_drop_down.svg" alt="" />
                </div>
                <div id="dropDownBodyId" class="dropDownBody dNone"></div>
              </div>
              <div>
                <div id="whoIsAssignet" class="addFisrtLetterContainer"></div>
              </div>
            </div>
                 
            <div class="testA">
              <span>Subtask<span class="req">*</span></span>
              <div class="containerInputSignUp">
                <input
                  id="inputSubTask"
                  type="text"
                  class="inputStyleWithBtn"
                  placeholder="Add a new subtask"
                />
                <div id="AddSubTaskStep1" class="imgContainer">
                  <img
                    id="AddSubTaskStep1Add"
                    class="inputWithImg"
                    src="./assets/menu/add.svg"
                    alt=""
                    onclick="hideSubTaskAddBtn()"
                  />
                </div>
                <div id="AddSubTaskStep2" class="imgContainer dNone">
                  <img
                    id="AddSubTaskStep2Delete"
                    class="cursor"
                    src="./assets/subtask/x.svg"
                    alt=""
                    onclick="deleteInputSubTask()"
                  />
                  <span>|</span>
                  <img
                    id="EditSubtasksCard"
                    class="cursor"
                    src="./assets/subtask/check.svg"
                    alt=""
                    onclick="addEditSubTask()"
                  />
                </div>
              </div>

              <div id="renderSubTask2"></div>
            
              </div>
                <div class="btnBoardOk">
                    <button class="btnPrimary" onclick="toDoForUpdateTaskOnFireBase('${
                      task.id
                    }')">
                      Ok <img src="./assets/priority/check.svg" alt="" />
                    </button>
                </div>
          </div>
         
      `;
}

/**
 * Generates an HTML string for a task information card.
 * This card displays detailed information about a task, including title, description,
 * due date, priority, assigned members, and subtasks, with options to delete or edit the task.
 * 
 * @param {Object} task - The task object containing information about a specific task.
 * @param {Object} task.task - The task details.
 * @param {number|string} task.task.category - The category of the task.
 * @param {string} task.task.title - The title of the task.
 * @param {string} task.task.description - A description of the task.
 * @param {string} task.task.date - The due date of the task.
 * @param {string} task.task.prio - The priority of the task (e.g., "high", "low").
 * @param {string} task.id - The unique identifier for the task.
 * @returns {string} HTML string representing the task information card.
 */
function showInfoCard(task) {
  return `       
      <div class="boardOverlay">
          <div id="showListCard" class="taskContainer">
              <div class="taskHeder">
                  <div class="boardCategoryCard cat${task.task.category}">
                      ${fromNumberToName(task)}
                  </div>
                  <span onclick="hideOverlayInfoCard()" class="cursor closeX">X</span>
              </div>
              <div class="taskTitle">
                  <h1 class="margin0 h161">${task.task.title}</h1>
                  <p class="margin0">${task.task.description}</p>
                  <span>Due date: ${task.task.date}</span>
                  <div class="prioContainer">
                      <div class="gap8">
                          <p class="margin0">Priority:</p>
                          ${capitalizeFirstLetter(
                            task.task.prio
                          )}${showPrioIcon(task)}
                      </div>
                  </div>
                  <div class="direction-column ">
                    <p class="margin0">Assigned To:</p>
                    <div id="asignedd${task.id}" 
                    class="assignetPersonCard direction-column pLeft16"></div>
                  </div>
                  <div class="boardCardSubtaskContainer">
                      <p class="margin0">Subtasks</p>
                      <div id="subtaskList" class="pLeft16"></div>
                  </div>
                  <div class="dflex gap8">
                      <div class="gap8 cursor btnDeleteEdit" 
                            onclick="deleteTask('${task.id}')">
                          <div>
                                                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="custom-svg">
                                <mask id="mask0_251030_8603" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                                <rect x="0.000976562" width="24" height="24" fill="#D9D9D9"/>
                                </mask>
                                <g mask="url(#mask0_251030_8603)">
                                <path d="M7.00098 21C6.45098 21 5.98014 20.8042 5.58848 20.4125C5.19681 20.0208 5.00098 19.55 5.00098 19V6C4.71764 6 4.48014 5.90417 4.28848 5.7125C4.09681 5.52083 4.00098 5.28333 4.00098 5C4.00098 4.71667 4.09681 4.47917 4.28848 4.2875C4.48014 4.09583 4.71764 4 5.00098 4H9.00098C9.00098 3.71667 9.09681 3.47917 9.28848 3.2875C9.48014 3.09583 9.71764 3 10.001 3H14.001C14.2843 3 14.5218 3.09583 14.7135 3.2875C14.9051 3.47917 15.001 3.71667 15.001 4H19.001C19.2843 4 19.5218 4.09583 19.7135 4.2875C19.9051 4.47917 20.001 4.71667 20.001 5C20.001 5.28333 19.9051 5.52083 19.7135 5.7125C19.5218 5.90417 19.2843 6 19.001 6V19C19.001 19.55 18.8051 20.0208 18.4135 20.4125C18.0218 20.8042 17.551 21 17.001 21H7.00098ZM7.00098 6V19H17.001V6H7.00098ZM9.00098 16C9.00098 16.2833 9.09681 16.5208 9.28848 16.7125C9.48014 16.9042 9.71764 17 10.001 17C10.2843 17 10.5218 16.9042 10.7135 16.7125C10.9051 16.5208 11.001 16.2833 11.001 16V9C11.001 8.71667 10.9051 8.47917 10.7135 8.2875C10.5218 8.09583 10.2843 8 10.001 8C9.71764 8 9.48014 8.09583 9.28848 8.2875C9.09681 8.47917 9.00098 8.71667 9.00098 9V16ZM13.001 16C13.001 16.2833 13.0968 16.5208 13.2885 16.7125C13.4801 16.9042 13.7176 17 14.001 17C14.2843 17 14.5218 16.9042 14.7135 16.7125C14.9051 16.5208 15.001 16.2833 15.001 16V9C15.001 8.71667 14.9051 8.47917 14.7135 8.2875C14.5218 8.09583 14.2843 8 14.001 8C13.7176 8 13.4801 8.09583 13.2885 8.2875C13.0968 8.47917 13.001 8.71667 13.001 9V16Z"/>
                                </g>
                                </svg>
                          </div>
                            Delete
                      </div>
                      <img src="./assets/subtask/bar1.svg" alt="" />
                      <div class="gap8 cursor btnDeleteEdit" 
                            onclick="editListDataCard('${task.id}')">
                        <div style="fill:#2A3647">
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="#2A3647" xmlns="http://www.w3.org/2000/svg" class="custom-svg">
                        <path d="M2.00098 17H3.40098L12.026 8.375L10.626 6.975L2.00098 15.6V17ZM16.301 6.925L12.051 2.725L13.451 1.325C13.8343 0.941667 14.3051 0.75 14.8635 0.75C15.4218 0.75 15.8926 0.941667 16.276 1.325L17.676 2.725C18.0593 3.10833 18.2593 3.57083 18.276 4.1125C18.2926 4.65417 18.1093 5.11667 17.726 5.5L16.301 6.925ZM14.851 8.4L4.25098 19H0.000976562V14.75L10.601 4.15L14.851 8.4Z"/>
                        </svg>
                        </div>
                        Edit
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
}

/**
 * Generates an HTML string for a single editable subtask within a task editing interface.
 * This structure includes an input field, control buttons for editing and deleting,
 * and visual elements such as dots and separators.
 * 
 * @param {Object} subtask - The subtask object containing information about the subtask.
 * @param {string} subtask.name - The name of the subtask to display as a placeholder.
 * @param {number} index - The index of the subtask in the list (used for unique element IDs).
 * @returns {string} HTML string representing the subtask's editable UI.
 */
function rendEditSubTaskHtml(subtask, index) {
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
        onclick="addEditSubTaskcheck(${index})"
        />
        <img src="./assets/priority/bar.svg" alt="Separator" />
        <img
          id="subTaskDeleteBtn-${index}"
          class="cursor"
          src="./assets/priority/delete.svg"
          alt="Delete"
          onclick="deleteEditTask(${index})"
        />
      </div>
    </div>`;
}

/**
 * Renders an HTML card element for a task, including its title, description, category, progress bar, and assignment details.
 * The task card is designed to be draggable, with features like moving the card up/down and viewing more details when clicked.
 * 
 * @param {Object} task - The task object containing the task's data.
 * @param {Object} task.task - The data for the specific task.
 * @param {string} task.id - The unique ID of the task.
 * @param {string} task.task.title - The title of the task.
 * @param {string} task.task.description - The description of the task.
 * @param {number} task.task.category - The category of the task (used for styling).
 * @param {Array} task.task.subtasks - The subtasks related to the task.
 * @param {string} task.task.prio - The priority of the task.
 * @returns {string} The HTML string representing the task card.
 */
function renderCard(task) {
  const maxTitleLength = 30;
  const maxDescriptionLength = 35;
  const truncatedTitle = truncateText(task.task.title, maxTitleLength);
  const truncatedDescription = truncateText(
    task.task.description,
    maxDescriptionLength
  );
  return `
    <div 
      class="boardTaskCard" 
      id="${task.id}" 
      draggable="true" 
      ondragstart="dragStart(event, '${task.id}')"
      ondragend="dragEnd(event)"
      onclick="listDataCard('${task.id}')"
    >
      <div class="cardHeader">
      <div 
        id="Category${task.task.category}" 
        class="boardCategoryCard cat${task.task.category}">
        ${fromNumberToName(task)}
      </div>
      <div class="cardButtonsDiv"><img onclick="event.stopPropagation(); moveCardUp('${
        task.id
      }')" class="arrow-up" src="./assets/img/arrow-up.png" alt=""><img onclick="event.stopPropagation(); moveCardDown('${
    task.id
  }')"  class="arrow-down" src="./assets/img/arrow-down.png" alt=""></div>
      </div>
      <div>
        <h3 class="boardCardTitle">${truncatedTitle}</h3>
        <p class="boardCardDescription">${truncatedDescription}</p>
      </div>
      <div class="progresBar" id="progBar-${task.id}" >
            <div class="progress-container">
                <div class="progress-bar" style="width:${calculatePercentage(
                  task
                )}%">
                </div>
            </div>
        <div style="font-size: 12px;">
          ${howManyAreChecked(task)} /${showSubTasks(task)} Subtasks
        </div>
      </div>
      <div class="assignetPersonContainer">
        <div id="asigned${task.id}" class="assignetPersonCard"></div>
        <div>${showPrioIcon(task)}</div>
      </div>
    </div>`;
}

/**
 * Creates the HTML markup for an assigned person.
 * @param {string} key The unique key of the person.
 * @param {string} initials The initials of the person.
 * @param {string} color The background color for the initials.
 * @param {string} name The full name of the person.
 * @returns {string} The HTML string for the assigned person.
 */
function createAssignedPersonHTML(key, initials, color, name) {
  return `
    <div class="dflex" style="gap:16px;">
      <div id="${key}" class="assignetPersonKreis" style="background-color: ${color};">
        ${initials}
      </div>
      <span>${name}</span>
    </div>
  `;
}

/**
 * Generates the HTML for a single subtask item.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {Object} subtask - The subtask object.
 * @param {number} index - The index of the subtask in the list.
 * @returns {string} The HTML string for the subtask item.
 */
function generateSubtaskHTML(taskId, subtask, index) {
  const checkboxSrc = subtask.checked ? "checkbox-checked.svg" : "checkbox.svg";
  return `
    <div class="subtaskItem">
      <img src="./assets/subtask/${checkboxSrc}" alt="" 
           class="cursor" onclick="toggleImage(this, '${taskId}', '${index}')" 
           data-index="${index}" id="checkbox" />
      ${subtask.name}
    </div>`;
}