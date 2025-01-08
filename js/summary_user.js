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
 * Extracts the initials from a full name.
 * @param {string} name - The full name of the user.
 * @returns {string} The first two initials of the name.
 */
function getInitials(name) {
  if (!name) return "??";
  const nameParts = name.trim().split(" ");
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase());
  return initials.slice(0, 2).join("");
}

/**
 * Sets the user's initials in the profile element.
 */
function setUserInitials() {
  const userData = sessionStorage.getItem("currentUser");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      const initials = getInitials(user.name);
      const profileTextElement = document.getElementById("profileText");
      if (profileTextElement) {
        profileTextElement.innerHTML = initials;
      }
    } catch (error) {
      console.error("Fehler beim Verarbeiten der Benutzerdaten:", error);
    }
  }
}

/**
 * Waits for the DOM to load and sets the user's initials once profile text is available.
 */
document.addEventListener("DOMContentLoaded", () => {
  const checkHeaderInterval = setInterval(() => {
    const profileTextElement = document.getElementById("profileText");
    if (profileTextElement) {
      clearInterval(checkHeaderInterval);
      setUserInitials();
    }
  }, 100);
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
  const nextTask = todos.reduce(
    (closest, task) => {
      const taskDate = new Date(task.date);
      const closestDate = new Date(closest.date);
      return !isNaN(taskDate) && (isNaN(closestDate) || taskDate < closestDate)
        ? task
        : closest;
    },
    { date: Infinity }
  );
  if (nextTask && nextTask.date && !isNaN(new Date(nextTask.date))) {
    document.getElementById("date-text").textContent = new Date(
      nextTask.date
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

/**
 * Updates the task counts for various categories and reflects them on the page.
 */
function fillInTasks() {
  const taskCounts = JSON.parse(sessionStorage.getItem("taskCounts")) || {};
  if (taskCounts.todo !== undefined) {
    document.getElementById("stats-button-to-do").textContent = taskCounts.todo;
  }
  if (taskCounts.done !== undefined) {
    document.getElementById("stats-button-done").textContent = taskCounts.done;
  }
  if (taskCounts.urgent !== undefined) {
    document.getElementById("stats-button-urgent").textContent =
      taskCounts.urgent;
  }
  if (taskCounts.inprogress !== undefined) {
    document.getElementById("stats-third-button-in-progress").textContent =
      taskCounts.inprogress;
  }
  if (taskCounts.awaitfeedback !== undefined) {
    document.getElementById("stats-third-button-await-feedback").textContent =
      taskCounts.awaitfeedback;
  }
  if (taskCounts.total !== undefined) {
    document.getElementById("stats-third-button-tasks-board").textContent =
      taskCounts.total;
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
    } else {
      console.error("Keine Aufgaben gefunden.");
    }
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
  }
}

/**
 * Updates the HTML content based on the tasks' progress categories.
 * @param {Array} data - The array of task objects.
 */
function updateHTML(data) {
  if (!data || Object.keys(data).length === 0) {
    return;
  }
  const categories = [
    "todoColumn",
    "inprogressColumn",
    "awaitfeedbackColumn",
    "doneColumn",
  ];
  categories.forEach((category) => {
    const container = document.getElementById(category);
    if (container) {
      container.innerHTML = ""; // Clear existing content
      data.forEach((task) => {
        if (
          task.progress &&
          task.progress.toLowerCase() ===
            category.replace("Column", "").toLowerCase()
        ) {
          container.innerHTML += generateTodoHTML(task);
        }
      });
    }
  });
}

/**
 * Counts the number of tasks in each category and updates session storage.
 */
function countTasksByCategory() {
  const counts = {
    todo: 0,
    inprogress: 0,
    awaitfeedback: 0,
    done: 0,
    urgent: 0,
    total: 0,
  };
  todos.forEach((task) => {
    counts.total++;
    if (task.progress === "todo") counts.todo++;
    if (task.progress === "inprogress") counts.inprogress++;
    if (task.progress === "awaitfeedback") counts.awaitfeedback++;
    if (task.progress === "done") counts.done++;
    if (task.prio === "urgent") counts.urgent++;
  });
  sessionStorage.setItem("taskCounts", JSON.stringify(counts));
}
