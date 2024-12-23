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
        dropdown.style.display = "none";}
    }
  };

function getCurrentUser() {
  const user = sessionStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null; 
}

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