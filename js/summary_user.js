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

  // Funktion, um den aktuellen Benutzer aus dem Local Storage zu laden
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


// Führt die Funktion aus, wenn die Seite geladen wird
document.addEventListener("DOMContentLoaded", () => {
  insertUserName();
});

// Funktion, um Initialen aus dem Namen zu generieren
function getInitials(name) {
  if (!name) return "??"; // Fallback, falls der Name nicht existiert
  const nameParts = name.trim().split(" "); // Name in Teile (z. B. Vorname, Nachname) aufteilen
  const initials = nameParts.map(part => part.charAt(0).toUpperCase()); // Initialen aus den ersten Buchstaben erstellen
  return initials.slice(0, 2).join(""); // Maximal 2 Initialen zurückgeben
}

// Funktion, um den Namen aus dem Local Storage zu laden und Initialen einzusetzen
function setUserInitials() {
  const userData = sessionStorage.getItem("currentUser"); // Daten aus dem Local Storage abrufen
  if (userData) {
      try {
          const user = JSON.parse(userData); // JSON-String in ein Objekt umwandeln
          const initials = getInitials(user.name); // Initialen generieren
          const profileTextElement = document.getElementById("profileText"); // Element mit der ID 'profileText' finden
          if (profileTextElement) {
              profileTextElement.innerHTML = initials; // Initialen in das Element einfügen
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


 function tasksIntoDisplay() {
  // Retrieve the sorted tasks from localStorage
  let sortedTasks = getSortedTasksFromLocalStorage();
  
  if (sortedTasks) {
    // Calculate the task counts
    let toDoCount = sortedTasks.todo.length;
    let doneCount = sortedTasks.done.length;
    let urgentCount = sortedTasks.urgent.length;
    let allTasksCount = sortedTasks.all.length;
    let inProgressCount = sortedTasks.inprogress.length;
    let awaitingFeedbackCount = sortedTasks.awaitfeedback.length;
    
    // Update the HTML elements with the task counts
    document.getElementById("summary-icon-pen").innerText = toDoCount; // To-Do tasks
    document.getElementById("summary-icon-check").innerText = doneCount; // Done tasks
    document.getElementById("summary-icon-urgent").innerText = urgentCount; // Urgent tasks
    document.getElementById("stats-button-to-do").innerText = toDoCount; // To-Do link count
    document.getElementById("stats-button-done").innerText = doneCount; // Done link count
    document.getElementById("stats-button-urgent").innerText = urgentCount; // Urgent link count
    document.getElementById("stats-third-button-tasks-board").innerText = allTasksCount; // All tasks
    document.getElementById("stats-third-button-in-progress").innerText = inProgressCount; // In Progress
    document.getElementById("stats-third-button-await-feedback").innerText = awaitingFeedbackCount; // Awaiting Feedback
  } else {
    console.log("No sorted tasks found in localStorage");
  }
};

// Retrieve sorted tasks from localStorage
function getSortedTasksFromSessionStorage() {
  let sortedTasks = JSON.parse(sessionStorage.getItem('sortedTasks'));
  if (!sortedTasks) {
    console.log("No sorted tasks found in localStorage");
    return null;
  }
  return sortedTasks;
}

