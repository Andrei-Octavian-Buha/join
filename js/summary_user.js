document.addEventListener('DOMContentLoaded', function() {
    const image = document.getElementById('summary-icon-pen');
    const originalSrc = './assets/img/summary-button-pen.png';
    const hoverSrc = './assets/img/summary-button-pen-h.png';
    const anchor = document.querySelector('.stats-button-to-do');
 
    anchor.addEventListener('mouseenter', function() {
        image.src = hoverSrc; 
    });

    anchor.addEventListener('mouseleave', function() {
        image.src = originalSrc; 
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const image = document.getElementById('summary-icon-check');
    const originalSrc = './assets/img/summary-button-check.png';
    const hoverSrc = './assets/img/summary-button-check-h.png';
    const anchor = document.querySelector('.stats-button-done');
 
    anchor.addEventListener('mouseenter', function() {
        image.src = hoverSrc; 
    });

    anchor.addEventListener('mouseleave', function() {
        image.src = originalSrc; 
    });
});

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

function getCurrentUser() {
  const user = sessionStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null; 
}

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

document.addEventListener("DOMContentLoaded", () => {
  insertUserName();
});

function getInitials(name) {
  if (!name) return "??"; 
  const nameParts = name.trim().split(" ");
  const initials = nameParts.map(part => part.charAt(0).toUpperCase()); 
  return initials.slice(0, 2).join(""); 
}

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
  } else {
      console.warn("Keine Benutzerdaten im Local Storage unter 'currentUser' gefunden.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const checkHeaderInterval = setInterval(() => {
      const profileTextElement = document.getElementById("profileText");
      if (profileTextElement) {
          clearInterval(checkHeaderInterval); 
          setUserInitials(); 
      }
  }, 100); 
});

function fillInTasks(){
  const taskCounts = JSON.parse(sessionStorage.getItem("taskCounts")) || {};
  
  if (taskCounts.todo !== undefined) {
    document.getElementById("stats-button-to-do").textContent = taskCounts.todo;
  }

  if (taskCounts.done !== undefined) {
    document.getElementById("stats-button-done").textContent = taskCounts.done;
  }

  if (taskCounts.urgent !== undefined) {
    document.getElementById("stats-button-urgent").textContent = taskCounts.urgent;
  }

  if (taskCounts.inprogress !== undefined) {
    document.getElementById("stats-third-button-in-progress").textContent = taskCounts.inprogress;
  }

  if (taskCounts.awaitfeedback !== undefined) {
    document.getElementById("stats-third-button-await-feedback").textContent = taskCounts.awaitfeedback;
  }

  if (taskCounts.total !== undefined) {
    document.getElementById("stats-third-button-tasks-board").textContent = taskCounts.total;
  }
};

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

      console.log("Aufgaben erfolgreich geladen:", todos);
      
      // Aufgaben zählen und in sessionStorage speichern
      countTasksByCategory();

      updateHTML(); // HTML nach dem Laden der Aufgaben aktualisieren
    } else {
      console.error("Keine Aufgaben gefunden.");
    }
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
  }
}

function countTasksByCategory() {
  const counts = {
    todo: 0,
    inprogress: 0,
    awaitfeedback: 0,
    done: 0,
    urgent: 0,
    total: 0, // Add a field for total count
  };

  todos.forEach((task) => {
    counts.total++; 

    if (task.category === "1") counts.todo++;
    if (task.category === "2") counts.inprogress++;
    if (task.category === "3") counts.awaitfeedback++;
    if (task.category === "4") counts.done++;
    if (task.prio === "urgent") counts.urgent++;
  });

  sessionStorage.setItem("taskCounts", JSON.stringify(counts));
}

