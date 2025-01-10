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




