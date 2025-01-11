/**
 * Listens for the 'DOMContentLoaded' event to initialize the image change behavior
 * when hovering over specific elements on the page.
 */
document.addEventListener("DOMContentLoaded", function () {
  const image = document.getElementById("summary-icon-pen");
  const originalSrc = "./assets/img/summary-button-pen.png";
  const hoverSrc = "./assets/img/summary-button-pen-h.png";
  const anchor = document.querySelector(".stats-button-to-do");

  anchor.addEventListener("mouseenter", function () {
    image.src = hoverSrc;
  });

  anchor.addEventListener("mouseleave", function () {
    image.src = originalSrc;
  });
});

/**
 * Listens for the 'DOMContentLoaded' event to initialize the image change behavior
 * when hovering over specific elements on the page.
 */
document.addEventListener("DOMContentLoaded", function () {
  const image = document.getElementById("summary-icon-check");
  const originalSrc = "./assets/img/summary-button-check.png";
  const hoverSrc = "./assets/img/summary-button-check-h.png";
  const anchor = document.querySelector(".stats-button-done");
  anchor.addEventListener("mouseenter", function () {
    image.src = hoverSrc;
  });
  anchor.addEventListener("mouseleave", function () {
    image.src = originalSrc;
  });
});

/**
 * Toggles the visibility of a dropdown menu.
 */
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

/**
 * Closes the dropdown menu if the click is outside of the profile picture.
 * @param {Event} event - The event object representing the click event.
 */
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

/**
 * Retrieves the current user from sessionStorage.
 * @returns {Object|null} The user object if found, otherwise null.
 */
function getCurrentUser() {
  const user = sessionStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

/**
 * Inserts the current user's name into specific elements on the page.
 */
function insertUserName() {
  const user = getCurrentUser();
  if (user) {
    document.querySelector(".greeting-name").textContent = user.name;
    document.querySelector(".fullscreen-greeting-name").textContent = user.name;
  } else {
    document.querySelector(".greeting-name").textContent = "Guest";
    document.querySelector(".fullscreen-greeting-name").textContent = "Guest";
  }
}

/**
 * Initializes the user name display on page load.
 */
document.addEventListener("DOMContentLoaded", () => {
  insertUserName();
});

/**
 * Initializes the page, loading tasks, and updating deadlines and HTML content.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await initializePage();
});

/**
 * Loads tasks for sorting and updates the page with task details.
 */
async function initializePage() {
  await loadTasksForSorting();
  updateNextDeadline();
  fillInTasks();
  updateHTML(todos);
}

/**
 * Updates the display of the next task deadline on the page.
 */
function updateNextDeadline() {
  if (!todos || todos.length === 0) return;
  const nextTask = findNextDeadline(todos);
  if (nextTask) {
    updateDeadlineText(nextTask.date);
  }
}

/**
 * Finds the task with the closest upcoming deadline.
 * @param {Array} tasks - Array of task objects with a `date` property.
 * @returns {Object|null} The task with the closest deadline, or null if none found.
 */
function findNextDeadline(tasks) {
  return tasks.reduce(
    (closest, task) => {
      const taskDate = new Date(task.date);
      const closestDate = new Date(closest?.date);
      return !isNaN(taskDate) && (isNaN(closestDate) || taskDate < closestDate)
        ? task
        : closest;
    },
    null
  );
}

/**
 * Updates the text content of the deadline display element.
 * @param {string} date - The date string of the next deadline.
 */
function updateDeadlineText(date) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  document.getElementById("date-text").textContent = formattedDate;
}


/**
 * Updates the statistics display with task counts from session storage.
 */
function fillInTasks() {
  const taskCounts = JSON.parse(sessionStorage.getItem("taskCounts")) || {};
  const mappings = {
    todo: "stats-button-to-do",
    done: "stats-button-done",
    urgent: "stats-button-urgent",
    inprogress: "stats-third-button-in-progress",
    awaitfeedback: "stats-third-button-await-feedback",
    total: "stats-third-button-tasks-board",
  };
  Object.keys(mappings).forEach((key) => updateStat(mappings[key], taskCounts[key]));
}

/**
 * Updates a specific stat button with a given value if the value exists.
 * @param {string} elementId - The ID of the HTML element to update.
 * @param {number} value - The value to set as the text content of the element.
 */
function updateStat(elementId, value) {
  if (value !== undefined) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = value;
    }
  }
}


/**
 * Loads tasks from a remote database and processes them for sorting.
 */
async function loadTasksForSorting() {
  try {
    const response = await fetch(
      "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/task.json"
    );
    const data = await response.json();
    if (data) {
      todos = Object.keys(data).map((key) => {
        return { id: key, ...data[key] };
      });
      countTasksByCategory();
    } else {}
  } catch (error) {}
}

/**
 * Updates the HTML content for task categories based on the provided data.
 * @param {Array} data - An array of task objects with progress information.
 */
function updateHTML(data) {
  if (!data || !data.length) return; // Exit if no data is provided
  const categories = ["todoColumn", "inprogressColumn", "awaitfeedbackColumn", "doneColumn"];
  categories.forEach((category) => updateCategoryHTML(category, data));
}

/**
 * Updates the HTML content for a specific category.
 * @param {string} category - The ID of the HTML container for the category.
 * @param {Array} data - An array of task objects.
 */
function updateCategoryHTML(category, data) {
  const container = document.getElementById(category);
  if (!container) return; // Skip if the container does not exist
  container.innerHTML = ""; // Clear existing content
  const filteredTasks = filterTasksByCategory(category, data);
  filteredTasks.forEach((task) => (container.innerHTML += generateTodoHTML(task)));
}

/**
 * Filters tasks that belong to a specific category.
 * @param {string} category - The ID of the HTML container for the category.
 * @param {Array} data - An array of task objects.
 * @returns {Array} An array of tasks that match the category.
 */
function filterTasksByCategory(category, data) {
  const categoryName = category.replace("Column", "").toLowerCase();
  return data.filter(
    (task) => task.progress && task.progress.toLowerCase() === categoryName
  );
}


/**
 * Counts tasks by category and priority, then stores the results in session storage.
 * Categories include "todo", "inprogress", "awaitfeedback", "done", and "urgent".
 */
function countTasksByCategory() {
  const counts = initializeCounts(); // Initialize the counts object
  todos.forEach((task) => updateCounts(task, counts)); // Update counts for each task
  sessionStorage.setItem("taskCounts", JSON.stringify(counts)); // Store counts in session storage
}

/**
 * Initializes the counts object with default values for all categories.
 * @returns {Object} An object with initialized count values.
 */
function initializeCounts() {
  return { todo: 0, inprogress: 0, awaitfeedback: 0, done: 0, urgent: 0, total: 0 };
}

/**
 * Updates the counts object based on the task's progress and priority.
 * @param {Object} task - The task object containing progress and priority information.
 * @param {Object} counts - The counts object to be updated.
 */
function updateCounts(task, counts) {
  counts.total++; // Increment total count
  if (counts[task.progress] !== undefined) {
    counts[task.progress]++; // Increment progress-specific count
  }
  if (task.prio === "urgent") {
    counts.urgent++; // Increment urgent count if task priority is "urgent"
  }
}

