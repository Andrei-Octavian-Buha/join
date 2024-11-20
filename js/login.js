const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app";
let currentUser = null; // Globale Variable für den aktuellen Nutzer

document.addEventListener("DOMContentLoaded", prefillLoginData);

async function handleLoginClick(event) {
  event.preventDefault();
  const { email, password, rememberMe } = getLoginInput();
  const errorContainer = document.getElementById("error-container");

  hideErrorContainer(errorContainer);

  if (isInvalidInput(email, password, errorContainer)) return;

  const user = await findUser(email, password);
  user ? processValidLogin(rememberMe) : showErrorContainer(errorContainer, "Incorrect email or password.");
}

function getLoginInput() {
  return {
    email: document.querySelector('input[type="email"]').value.trim(),
    password: document.getElementById("passwordFieldLogin").value.trim(),
    rememberMe: document.getElementById("checkbox").checked,
  };
}

function handleGuestLoginClick() {
  localStorage.setItem("currentUser", JSON.stringify({ email: "Guest" }));
  window.location.href = "./summary_user.html";
}

function isInvalidInput(email, password, errorContainer) {
  if (!email || !password) {
    showErrorContainer(errorContainer, "Please fill in both email and password.");
    return true;
  }
  return false;
}

async function findUser(email, password) {
  const users = await fetchUsers();
  return users.find(user => user.email === email && user.password === password);
}

function processValidLogin(rememberMe) {
  const { email, password } = getLoginInput();
  rememberMe ? saveLoginData(email, password) : clearLoginData();
  localStorage.setItem("currentUser", JSON.stringify({ email }));
  window.location.href = "./summary_user.html";
}

function fetchUsers() {
  const BASE_URL = "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app";
  return fetch(`${BASE_URL}/users.json`).then(response => response.json());
}

function showErrorContainer(container, message) {
  container.textContent = message;
  container.style.display = "block";
}

function hideErrorContainer(container) {
  container.style.display = "none";
}

function saveLoginData(email, password) {
  localStorage.setItem("loginEmail", email);
  localStorage.setItem("loginPassword", password);
}

function clearLoginData() {
  localStorage.removeItem("loginEmail");
  localStorage.removeItem("loginPassword");
}

function prefillLoginData() {
  const savedEmail = localStorage.getItem("loginEmail");
  const savedPassword = localStorage.getItem("loginPassword");

  if (savedEmail && savedPassword) {
    document.querySelector('input[type="email"]').value = savedEmail;
    document.getElementById("passwordFieldLogin").value = savedPassword;
    document.getElementById("checkbox").checked = true; // Checkbox aktivieren
  }
}


function validateUser(users, email, password, errorContainer) {
  const matchingUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (matchingUser) {
    onLoginSuccess(matchingUser);
  } else {
    showErrorContainer(errorContainer, "Wrong password. Ups! Try again.");
  }
}

function onLoginSuccess(user) {
  currentUser = user;
  saveCurrentUser(user);
  window.location.href = "summary_user.html";
}

async function fetchUsers() {
  const response = await fetch(`${BASE_URL}/users.json`);
  if (!response.ok) throw new Error("Failed to fetch users.");
  return Object.values(await response.json() || {});
}

function saveCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function showErrorContainer(container, message) {
  container.textContent = message; // Fehlermeldung einfügen
  container.style.display = "block"; // Sichtbar machen
}

function hideErrorContainer(container) {
  container.style.display = "none"; // Verbergen
}


function addEvent(){
    let signUp = document.getElementById("loginToSignUp");
    signUp.addEventListener("click", ()=>{
        window.location.href = "register.html";
    })
}

function test() {
    const overlay = document.getElementById('overlayId');
    const logo = document.getElementById('imgHeader1');
    const animatedLogo = setupAnimatedLogo(logo);

    applyOverlayColor(overlay);
    animateLogoToTarget(animatedLogo, logo.getBoundingClientRect());

    setTimeout(() => finalizeAnimation(animatedLogo, overlay), 2000);
}


function setupAnimatedLogo(logo) {
    const animatedLogo = logo.cloneNode(true);
    animatedLogo.classList.add('logoCentered'); 
    document.body.appendChild(animatedLogo);
    return animatedLogo;
}


function applyOverlayColor(overlay) {
    if (window.innerWidth < 770) {
        overlay.style.backgroundColor = '#2A3647'; 
    } else {
        overlay.style.backgroundColor = '#ffffff'; 
    }
    overlay.classList.remove('dNone');
}


function animateLogoToTarget(animatedLogo, target) {
    setTimeout(() => {
        animatedLogo.style.top = `${target.top}px`;
        animatedLogo.style.left = `${target.left}px`;
        animatedLogo.style.transform = 'translate(0, 0)';
        animatedLogo.style.width = `${target.width}px`;
        animatedLogo.classList.add('logoMoved'); 
    }, 100); 
}


function finalizeAnimation(animatedLogo, overlay) {
    animatedLogo.remove();
    overlay.classList.add('dNone');
}

function togglePassword(inputId, icon) {
    var input = document.getElementById(inputId);
    var isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    icon.src = isPassword ? './assets/menu/visibility-off.png' : './assets/menu/lock.svg';
  }
