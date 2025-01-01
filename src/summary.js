/**
 * Event listener for the 'DOMContentLoaded' event to handle hover effects on 'summary-icon-pen' and 'summary-icon-check' images.
 * Changes the images on mouse enter and leave.
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
 * Event listener for the 'DOMContentLoaded' event to handle hover effects on 'summary-icon-check' image.
 * Changes the image on mouse enter and leave.
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
 * The dropdown is either displayed or hidden based on its current state.
 */
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

/**
 * Event listener for clicks outside the dropdown. Closes the dropdown if clicked outside the profile picture.
 * @param {Event} event - The click event.
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
 * @returns {Object|null} The current user's data, or null if no user is found.
 */
function getCurrentUser() {
  const user = sessionStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

/**
 * Inserts the user's name into the DOM, if a user exists in sessionStorage. If no user exists, it displays "Guest".
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
 * Event listener for 'DOMContentLoaded' to insert the user's name into the DOM.
 */
document.addEventListener("DOMContentLoaded", () => {
  insertUserName();
});

/**
 * Extracts the initials from a user's name.
 * @param {string} name - The full name of the user.
 * @returns {string} The initials of the user or "??" if no name is provided.
 */
function getInitials(name) {
  if (!name) return "??";
  const nameParts = name.trim().split(" ");
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase());
  return initials.slice(0, 2).join("");
}

/**
 * Sets the user's initials in the profile section based on sessionStorage data.
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
      console.error("Error processing user data:", error);
    }
  }

  /**
   * Event listener for 'DOMContentLoaded' that initializes user initials after the profile text element is available.
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
   * Event listener for 'DOMContentLoaded' to initialize the page by loading tasks and updating UI elements.
   */
  document.addEventListener("DOMContentLoaded", async () => {
    await initializePage();
  });

  /**
   * Initializes the page by loading tasks, updating deadlines, and filling in task details.
   */
  async function initializePage() {
    await loadTasksForSorting();
    updateNextDeadline();
    fillInTasks();
    updateHTML(todos);
  }

  /**
   * Updates the next deadline display with the closest upcoming task's deadline.
   */
  function updateNextDeadline() {
    if (!todos || todos.length === 0) return;
    const nextTask = todos.reduce(
      (closest, task) => {
        const taskDate = new Date(task.date);
        const closestDate = new Date(closest.date);
        return !isNaN(taskDate) &&
          (isNaN(closestDate) || taskDate < closestDate)
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
   * Fills in the task counts in the UI based on the taskCounts stored in sessionStorage.
   */
  function fillInTasks() {
    const taskCounts = JSON.parse(sessionStorage.getItem("taskCounts")) || {};
    if (taskCounts.todo !== undefined) {
      document.getElementById("stats-button-to-do").textContent =
        taskCounts.todo;
    }
    if (taskCounts.done !== undefined) {
      document.getElementById("stats-button-done").textContent =
        taskCounts.done;
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
   * Loads tasks for sorting from the Firebase database and updates task categories.
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
        console.error("No tasks found.");
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }

  /**
   * Updates the HTML for task categories based on the provided task data.
   * @param {Array} data - The task data to update the UI with.
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
   * Counts tasks by their category (e.g., "todo", "inprogress", etc.) and updates sessionStorage with these counts.
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
}
