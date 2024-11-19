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
<<<<<<< Updated upstream
=======

  function test() {
    const overlay = document.getElementById('overlayId');
    const logo = document.getElementById('imgHeader1');
    const animatedLogo = setupAnimatedLogo(logo);

    applyOverlayColor(overlay);
    animateLogoToTarget(animatedLogo, logo.getBoundingClientRect());

    setTimeout(() => finalizeAnimation(animatedLogo, overlay), 2000);
}

// Erstellt und positioniert das animierte Logo
function setupAnimatedLogo(logo) {
    const animatedLogo = logo.cloneNode(true);
    animatedLogo.classList.add('logoCentered'); // Startposition und Farbe Weiß
    document.body.appendChild(animatedLogo);
    return animatedLogo;
}

// Passt die Overlay-Farbe basierend auf der Bildschirmbreite an
function applyOverlayColor(overlay) {
    if (window.innerWidth < 770) {
        overlay.style.backgroundColor = '#2A3647'; // Dunklere Farbe für kleine Bildschirme
    } else {
        overlay.style.backgroundColor = '#ffffff'; // Weiß für größere Bildschirme
    }
    overlay.classList.remove('dNone'); // Overlay anzeigen
}

// Führt die Animation des Logos zur Zielposition aus
function animateLogoToTarget(animatedLogo, target) {
    setTimeout(() => {
        animatedLogo.style.top = `${target.top}px`;
        animatedLogo.style.left = `${target.left}px`;
        animatedLogo.style.transform = 'translate(0, 0)';
        animatedLogo.style.width = `${target.width}px`;
        animatedLogo.classList.add('logoMoved'); // Farbe zurück zum Original
    }, 100); // Kleiner Delay
}

// Entfernt das animierte Logo und blendet das Overlay aus
function finalizeAnimation(animatedLogo, overlay) {
    animatedLogo.remove();
    overlay.classList.add('dNone');
>>>>>>> Stashed changes
}

function test() {
  const overlay = document.getElementById("overlayId");
  const logo = document.getElementById("imgHeader1");
  const target = logo.getBoundingClientRect();
  const animatedLogo = logo.cloneNode(true);
  animatedLogo.classList.add("logoCentered");
  document.body.appendChild(animatedLogo);
  setTimeout(() => {
    animatedLogo.style.top = `${target.top}px`;
    animatedLogo.style.left = `${target.left}px`;
    animatedLogo.style.transform = "translate(0, 0)";
    animatedLogo.style.width = `${target.width}px`;
  }, 100);
  setTimeout(() => {
    animatedLogo.remove();
    overlay.classList.add("dNone");
  }, 2000);
}

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
