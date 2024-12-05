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
  if (!name) return "??"; 
  const nameParts = name.trim().split(" ");
  const initials = nameParts.map(part => part.charAt(0).toUpperCase()); 
  return initials.slice(0, 2).join(""); 
}

// Funktion, um den Namen aus dem Local Storage zu laden und Initialen einzusetzen
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


