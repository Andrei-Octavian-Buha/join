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
  const user = localStorage.getItem("currentUser");
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

