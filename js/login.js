/**
 * Base URL for Firebase database.
 * @constant {string}
 */
const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Current logged-in user.
 * @type {object|null}
 */
let currentUser = null; // Globale Variable für den aktuellen Nutzer

/**
 * Prefills login data from local storage if available.
 */
document.addEventListener("DOMContentLoaded", prefillLoginData);

/**
 * Handles the login button click, processes the login input, and attempts login.
 * @param {Event} event - The click event.
 */
async function handleLoginClick(event) {
  event.preventDefault();
  const input = getLoginInput();
  if (isInvalidLoginInput(input)) return;

  const user = await attemptLogin(input.email, input.password);
  user ? handleSuccessfulLogin(user, input.rememberMe) : handleFailedLogin();
}

/**
 * Validates the login input.
 * @param {object} loginData - The login data containing email, password.
 * @param {string} loginData.email - The email input.
 * @param {string} loginData.password - The password input.
 * @returns {boolean} - Returns true if the input is invalid, false otherwise.
 */
function isInvalidLoginInput({ email, password }) {
  const errorContainer = document.getElementById("error-container");
  if (isInvalidInput(email, password, errorContainer)) return true;
  hideErrorContainer(errorContainer);
  return false;
}

/**
 * Attempts to login by finding the user with the given email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object|null>} - The user object if found, or null if login fails.
 */
async function attemptLogin(email, password) {
  try {
    return await findUser(email, password);
  } catch (error) {
    return null;
  }
}

/**
 * Handles a successful login, stores user data, and redirects.
 * @param {object} user - The logged-in user.
 * @param {boolean} rememberMe - Whether the user chose to be remembered.
 */
function handleSuccessfulLogin(user, rememberMe) {
  if (rememberMe) {
    saveLoginData(user.email, user.password);
    storeUserInLocalStorage(user);
    storeUserInSession(user);
  } else {
    clearLoginData();
    storeUserInSession(user);
  }
  redirectToSummary();
}

/**
 * Handles a failed login, displaying an error message.
 */
function handleFailedLogin() {
  const errorContainer = document.getElementById("error-container");
  showErrorContainer(errorContainer, "Incorrect email or password.");
}

/**
 * Redirects to the summary page.
 */
function redirectToSummary() {
  window.location.href = "./summary_user.html";
}

/**
 * Stores the user data in local storage.
 * @param {object} user - The user object.
 */
function storeUserInLocalStorage(user) {
  localStorage.setItem(
    "currentUser",
    JSON.stringify({ name: user.name, email: user.email })
  );
}

/**
 * Stores the user data in session storage.
 * @param {object} user - The user object.
 */
function storeUserInSession(user) {
  sessionStorage.setItem(
    "currentUser",
    JSON.stringify({ name: user.name, email: user.email })
  );
}

/**
 * Retrieves the login input data.
 * @returns {object} - The login input data containing email, password, and rememberMe flag.
 */
function getLoginInput() {
  return {
    email: document.querySelector('input[type="email"]').value.trim(),
    password: document.getElementById("passwordFieldLogin").value.trim(),
    rememberMe: document.getElementById("checkbox").checked,
  };
}

/**
 * Handles the guest login button click, storing the guest user and redirecting.
 */
function handleGuestLoginClick() {
  sessionStorage.setItem("currentUser", JSON.stringify({ name: "Guest" }));
  window.location.href = "./summary_user.html";
}

/**
 * Validates the email and password input.
 * @param {string} email - The email input.
 * @param {string} password - The password input.
 * @param {HTMLElement} errorContainer - The error container element to display messages.
 * @returns {boolean} - Returns true if invalid, false otherwise.
 */
function isInvalidInput(email, password, errorContainer) {
  if (!email || !password) {
    showErrorContainer(
      errorContainer,
      "Please fill in both email and password."
    );
    return true;
  }
  return false;
}

/**
 * Finds a user in the database by email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object|null>} - The matching user object or null if not found.
 */
async function findUser(email, password) {
  const users = await fetchUsers();
  return users.find(
    (user) => user.email === email && user.password === password
  );
}

/**
 * Processes a valid login, storing the user data and redirecting.
 * @param {boolean} rememberMe - Whether the user chose to be remembered.
 * @param {object} user - The logged-in user.
 */
function processValidLogin(rememberMe, user) {
  if (rememberMe) {
    saveLoginData(user.email, user.password); // Save email and password
  } else {
    clearLoginData();
  }

  localStorage.setItem(
    "currentUser",
    JSON.stringify({ name: user.name, email: user.email })
  );

  window.location.href = "./summary_user.html";
}

/**
 * Fetches all users from the database.
 * @returns {Promise<object[]>} - A list of user objects.
 */
async function fetchUsers() {
  const response = await fetch(`${BASE_URL}/users.json`);
  if (!response.ok) throw new Error("Failed to fetch users.");
  const data = await response.json();
  return data ? Object.values(data) : [];
}

/**
 * Shows an error message in the provided container.
 * @param {HTMLElement} container - The container element to display the message.
 * @param {string} message - The error message to display.
 */
function showErrorContainer(container, message) {
  container.textContent = message;
  container.style.display = "block";
}

/**
 * Hides the error message container.
 * @param {HTMLElement} container - The container element to hide.
 */
function hideErrorContainer(container) {
  container.style.display = "none";
}

/**
 * Saves the login data (email and password) to local storage.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
function saveLoginData(email, password) {
  localStorage.setItem("loginEmail", email);
  localStorage.setItem("loginPassword", password);
}

/**
 * Clears the saved login data from local storage.
 */
function clearLoginData() {
  localStorage.removeItem("loginEmail");
  localStorage.removeItem("loginPassword");
}

/**
 * Prefills the login data from local storage if available.
 */
function prefillLoginData() {
  const savedEmail = localStorage.getItem("loginEmail");
  const savedPassword = localStorage.getItem("loginPassword");

  if (savedEmail && savedPassword) {
    document.querySelector('input[type="email"]').value = savedEmail;
    document.getElementById("passwordFieldLogin").value = savedPassword;
    document.getElementById("checkbox").checked = true; // Checkbox aktivieren
  }
}

/**
 * Validates a user's login credentials against a list of users.
 * @param {object[]} users - A list of user objects.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {HTMLElement} errorContainer - The error container element to display messages.
 */
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

/**
 * Handles the login success, saving the user and redirecting.
 * @param {object} user - The logged-in user.
 */
function onLoginSuccess(user) {
  currentUser = user;
  saveCurrentUser(user);
  window.location.href = "summary_user.html";
}

/**
 * Saves the current user in session storage.
 * @param {object} user - The logged-in user.
 */
function saveCurrentUser(user) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
}

/**
 * Displays the error message in the container.
 * @param {HTMLElement} container - The container to show the error in.
 * @param {string} message - The error message.
 */
function showErrorContainer(container, message) {
  container.textContent = message; // Fehlermeldung einfügen
  container.style.display = "block"; // Sichtbar machen
}

/**
 * Hides the error message container.
 * @param {HTMLElement} container - The container to hide the error.
 */
function hideErrorContainer(container) {
  container.style.display = "none"; // Verbergen
}

/**
 * Adds the event listener for the signup link.
 */
function addEvent() {
  let signUp = document.getElementById("loginToSignUp");
  signUp.addEventListener("click", () => {
    window.location.href = "register.html";
  });
}

/**
 * Test function for logo animation and overlay.
 */
function test() {
  const overlay = document.getElementById("overlayId");
  const logo = document.getElementById("imgHeader1");
  const animatedLogo = setupAnimatedLogo(logo);

  applyOverlayColor(overlay);
  animateLogoToTarget(animatedLogo, logo.getBoundingClientRect());

  setTimeout(() => finalizeAnimation(animatedLogo, overlay), 2000);
}

/**
 * Sets up the animated logo by cloning and styling it.
 * @param {HTMLElement} logo - The logo element to clone.
 * @returns {HTMLElement} - The cloned animated logo.
 */
function setupAnimatedLogo(logo) {
  const animatedLogo = logo.cloneNode(true);
  animatedLogo.classList.add("logoCentered");
  document.body.appendChild(animatedLogo);
  return animatedLogo;
}

/**
 * Applies the appropriate overlay color based on screen width.
 * @param {HTMLElement} overlay - The overlay element to style.
 */
function applyOverlayColor(overlay) {
  if (window.innerWidth < 770) {
    overlay.style.backgroundColor = "#2A3647";
  } else {
    overlay.style.backgroundColor = "#ffffff";
  }
  overlay.classList.remove("dNone");
}

/**
 * Animates the logo to the target position.
 * @param {HTMLElement} animatedLogo - The animated logo element.
 * @param {DOMRect} target - The target position for the logo.
 */
function animateLogoToTarget(animatedLogo, target) {
  setTimeout(() => {
    animatedLogo.style.top = `${target.top}px`;
    animatedLogo.style.left = `${target.left}px`;
    animatedLogo.style.transform = "translate(0, 0)";
    animatedLogo.style.width = `${target.width}px`;
    animatedLogo.classList.add("logoMoved");
  }, 100);
}

/**
 * Finalizes the logo animation by removing the animated logo and hiding the overlay.
 * @param {HTMLElement} animatedLogo - The animated logo element.
 * @param {HTMLElement} overlay - The overlay element to hide.
 */
function finalizeAnimation(animatedLogo, overlay) {
  animatedLogo.remove();
  overlay.classList.add("dNone");
}

/**
 * Toggles the visibility of the password input field.
 * @param {string} inputId - The ID of the input field.
 * @param {HTMLElement} icon - The icon element to change.
 */
function togglePassword(inputId, icon) {
  var input = document.getElementById(inputId);
  var isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  icon.src = isPassword
    ? "./assets/menu/visibility-off.png"
    : "./assets/menu/lock.svg";
}
