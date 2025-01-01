/**
 * The base URL for interacting with the Firebase Realtime Database.
 */
const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * A global variable to store the currently logged-in user.
 */
let currentUser = null;

/**
 * Prefills the login form with saved credentials (if available) after the DOM is loaded.
 */
document.addEventListener("DOMContentLoaded", prefillLoginData);

/**
 * Handles the login button click event.
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
 * Validates the login input fields.
 * @param {Object} input - The login input object containing email and password.
 * @returns {boolean} - True if input is invalid, otherwise false.
 */
function isInvalidLoginInput({ email, password }) {
  const errorContainer = document.getElementById("error-container");
  if (isInvalidInput(email, password, errorContainer)) return true;
  hideErrorContainer(errorContainer);
  return false;
}

/**
 * Attempts to log in by matching the email and password with stored users.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Object|null} - The matching user object or null if not found.
 */
async function attemptLogin(email, password) {
  try {
    return await findUser(email, password);
  } catch (error) {
    return null;
  }
}

/**
 * Handles a successful login by saving the user data and redirecting to the summary page.
 * @param {Object} user - The logged-in user object.
 * @param {boolean} rememberMe - Whether to remember the user's credentials.
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
 * Handles a failed login attempt by displaying an error message.
 */
function handleFailedLogin() {
  const errorContainer = document.getElementById("error-container");
  showErrorContainer(errorContainer, "Incorrect email or password.");
}

/**
 * Redirects the user to the summary page.
 */
function redirectToSummary() {
  window.location.href = "./summary_user.html";
}

/**
 * Stores the user data in local storage.
 * @param {Object} user - The logged-in user object.
 */
function storeUserInLocalStorage(user) {
  localStorage.setItem(
    "currentUser",
    JSON.stringify({ name: user.name, email: user.email })
  );
}

/**
 * Stores the user data in session storage.
 * @param {Object} user - The logged-in user object.
 */
function storeUserInSession(user) {
  sessionStorage.setItem(
    "currentUser",
    JSON.stringify({ name: user.name, email: user.email })
  );
}

/**
 * Retrieves login input values from the form.
 * @returns {Object} - An object containing email, password, and rememberMe values.
 */
function getLoginInput() {
  return {
    email: document.querySelector('input[type="email"]').value.trim(),
    password: document.getElementById("passwordFieldLogin").value.trim(),
    rememberMe: document.getElementById("checkbox").checked,
  };
}

/**
 * Handles the guest login process by setting a guest user in session storage.
 */
function handleGuestLoginClick() {
  sessionStorage.setItem("currentUser", JSON.stringify({ name: "Guest" }));
  window.location.href = "./summary_user.html";
}

/**
 * Checks if the login input is invalid.
 * @param {string} email - The email input value.
 * @param {string} password - The password input value.
 * @param {HTMLElement} errorContainer - The container to display errors.
 * @returns {boolean} - True if input is invalid, otherwise false.
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
 * Finds a user by email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Object|null} - The matching user object or null if not found.
 */
async function findUser(email, password) {
  const users = await fetchUsers();
  return users.find(
    (user) => user.email === email && user.password === password
  );
}

/**
 * Fetches all users from the database.
 * @returns {Array<Object>} - An array of user objects.
 */
async function fetchUsers() {
  const response = await fetch(`${BASE_URL}/users.json`);
  if (!response.ok) throw new Error("Failed to fetch users.");
  const data = await response.json();
  return data ? Object.values(data) : [];
}

/**
 * Displays an error message in the specified container.
 * @param {HTMLElement} container - The container to display the error message.
 * @param {string} message - The error message to display.
 */
function showErrorContainer(container, message) {
  container.textContent = message;
  container.style.display = "block";
}

/**
 * Hides the error container.
 * @param {HTMLElement} container - The container to hide.
 */
function hideErrorContainer(container) {
  container.style.display = "none";
}

/**
 * Saves the login data (email and password) in local storage.
 * @param {string} email - The email to save.
 * @param {string} password - The password to save.
 */
function saveLoginData(email, password) {
  localStorage.setItem("loginEmail", email);
  localStorage.setItem("loginPassword", password);
}

/**
 * Clears saved login data from local storage.
 */
function clearLoginData() {
  localStorage.removeItem("loginEmail");
  localStorage.removeItem("loginPassword");
}

/**
 * Prefills the login form with saved credentials from local storage (if available).
 */
function prefillLoginData() {
  const savedEmail = localStorage.getItem("loginEmail");
  const savedPassword = localStorage.getItem("loginPassword");

  if (savedEmail && savedPassword) {
    document.querySelector('input[type="email"]').value = savedEmail;
    document.getElementById("passwordFieldLogin").value = savedPassword;
    document.getElementById("checkbox").checked = true;
  }
}

/**
 * Validates user credentials and processes the login.
 * @param {Array<Object>} users - The list of users.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {HTMLElement} errorContainer - The container to display errors.
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
 * Handles the successful login process.
 * @param {Object} user - The matching user object.
 */
function onLoginSuccess(user) {
  currentUser = user;
  saveCurrentUser(user);
  window.location.href = "summary_user.html";
}

/**
 * Saves the current user data in session storage.
 * @param {Object} user - The user object to save.
 */
function saveCurrentUser(user) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
}

/**
 * Adds an event listener for redirecting to the registration page.
 */
function addEvent() {
  let signUp = document.getElementById("loginToSignUp");
  signUp.addEventListener("click", () => {
    window.location.href = "register.html";
  });
}

/**
 * Toggles password visibility for the login input field.
 * @param {string} inputId - The ID of the password input field.
 * @param {HTMLElement} icon - The icon element to toggle.
 */
function togglePassword(inputId, icon) {
  var input = document.getElementById(inputId);
  var isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  icon.src = isPassword
    ? "./assets/menu/visibility-off.png"
    : "./assets/menu/lock.svg";
}
