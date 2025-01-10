async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  }

/**
 * Gets the color associated with a contact's initial.
 * @function
 * @param {string} initial - The initial character of the contact's name.
 * @returns {string} The hex color code for the initial.
 */
function getColorForInitial(initial) {
  const colors = {
  A: "#FF5733",
  B: "#FFBD33",
  C: "#DBFF33",
  D: "#75FF33",
  E: "#33FF57",
  F: "#33FFBD",
  G: "#3399FF",
  H: "#8A2BE2",
  I: "#5733FF",
  J: "#BD33FF",
  K: "#FF33DB",
  L: "#FF3375",
  M: "#FF3333",
  N: "#FF6633",
  O: "#FF9933",
  P: "#FFCC33",
  Q: "#FFFF33",
  R: "#99CC29",
  S: "#66CC99",
  T: "#66A3A3",
  U: "#3399CC",
  V: "#33FF99",
  W: "#33FFCC",
  X: "#33FFFF",
  Y: "#33CCFF",
  Z: "#3399FF",
  };
  return colors[initial] || "#333333";
}


/**
 * Extracts the initials from a given name.
 * @param {string} name - The full name of a person.
 * @returns {string} The initials of the person, or "??" if no name is provided.
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
 * Initializes the user's profile text by repeatedly checking for the header element.
 * Stops the interval once the element is found and updates the user's initials.
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

