const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app";

let currentUser = null;

/**
 * Stores the user data in session storage after a successful registration.
 * @param {Object} user - The user object containing name and email.
 */
function storeUserInSessionStorage(user) {
  sessionStorage.setItem(
    "currentUser",
    JSON.stringify({ name: user.name, email: user.email })
  );
}

/**
 * Collects input values from the sign-up form.
 * @returns {Object} - An object containing the values of the name, email, password, confirmPassword, and checkbox.
 */
function getSignUpInputs() {
  return {
    name: document.querySelector('input[placeholder="Name"]').value.trim(),
    email: document.querySelector('input[placeholder="Email"]').value.trim(),
    password: document.querySelector('input[placeholder="Password"]').value,
    confirmPassword: document.querySelector(
      'input[placeholder="Confirm Password"]'
    ).value,
    isChecked: document.getElementById("checkbox").checked,
  };
}

/**
 * Validates user inputs for a form.
 * @param {Object} inputs - The input fields to validate.
 * @returns {boolean} True if all inputs are valid, false otherwise.
 */
function validateInputs(inputs) {
  if (!areRequiredFieldsFilled(inputs)) return false;
  if (!inputs.isChecked) return false;
  if (!arePasswordsMatching(inputs.password, inputs.confirmPassword)) {
    showPasswordError();
    return false;
  }
  return true;
}

/**
 * Checks if all required fields are filled.
 * @param {Object} inputs - The input fields to check.
 * @returns {boolean} True if all required fields are filled, false otherwise.
 */
function areRequiredFieldsFilled(inputs) {
  return inputs.name && inputs.email && inputs.password && inputs.confirmPassword;
}

/**
 * Checks if the password and confirmation password match.
 * @param {string} password - The password input.
 * @param {string} confirmPassword - The confirmation password input.
 * @returns {boolean} True if the passwords match, false otherwise.
 */
function arePasswordsMatching(password, confirmPassword) {
  return password === confirmPassword;
}


/**
 * Displays an error when passwords don't match.
 */
function showPasswordError() {
  const errorContainer = document.getElementById("passwordError");
  const passwordInputs = document.querySelectorAll('input[type="password"]');

  errorContainer.style.display = "block";

  passwordInputs.forEach((input) => {
    input.classList.add("error");
  });
}

/**
 * Creates a user object from the input values.
 * @param {Object} inputs - The input values.
 * @returns {Object} - The created user object.
 */
function createUserObject(inputs) {
  return {
    name: inputs.name,
    email: inputs.email,
    password: inputs.password,
  };
}

/**
 * Pushes the user data to the database.
 * @param {Object} user - The user object containing user data.
 * @throws {Error} - Throws an error if the request fails.
 */
async function pushUserToDatabase(user) {
  const response = await fetch(`${BASE_URL}/users.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Failed to create account. Please try again.");
  }
}

/**
 * Saves the current user in session storage.
 * @param {Object} user - The user object containing name and email.
 */
function saveCurrentUser(user) {
  const currentUser = {
    name: user.name,
    email: user.email,
  };
  sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
}

/**
 * Displays the sign-up success popup.
 */
function showSignUpPopup() {
  const popup = document.getElementById("signUpPopup");
  popup.classList.remove("hide");
  Object.assign(popup.style, {
    backgroundColor: "#2A3647",
    color: "white",
    textAlign: "center",
    padding: "20px",
    borderRadius: "10px",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "1000",
  });
}

/**
 * Redirects to the home page (index.html) after a 2-second delay.
 */
function redirectToHome() {
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
}

/**
 * Initializes event listeners after the DOM has loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const signUpButton = document.getElementById("signupButton");
  if (signUpButton) {
    signUpButton.addEventListener("click", handleSignUp);
  } else {
    console.error("Sign up button not found in the DOM.");
  }
});

/**
 * Toggles the visibility of a password input field.
 * @param {string} inputId - The ID of the password input element.
 * @param {HTMLElement} icon - The icon element to change based on visibility.
 */
function togglePassword(inputId, icon) {
  var input = document.getElementById(inputId);
  var isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  icon.src = isPassword
    ? "./assets/menu/visibility-off.png"
    : "./assets/menu/lock.svg";
}

/**
 * Validates if the passwords in two fields match.
 */
function validatePasswords() {
  var passwordField1 = document.getElementById("passwordField1");
  var passwordField2 = document.getElementById("passwordField2");
  if (passwordField1.value !== passwordField2.value) {
    passwordField1.style.border = "1px solid red";
    passwordField2.style.border = "1px solid red";
  } else {
    passwordField1.style.border = "";
    passwordField2.style.border = "";
  }
}

/**
 * Redirects the user to the login page when the "Back to Login" link is clicked.
 */
function backToLogin() {
  let backToLogin = document.getElementById("backToLogin");
  backToLogin.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

/**
 * Validates if the provided email address is in a correct format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

/**
 * Validates if the provided name is valid.
 * @param {string} name - The name to validate.
 * @returns {boolean} - True if the name is valid, false otherwise.
 */
function validateName(name) {
  const isValidLength = name.length >= 3;
  const isValidFormat = /^[a-zA-ZäöüÄÖÜß\s]+$/.test(name);
  return isValidLength && isValidFormat;
}

/**
 * Displays an error message in the error container and highlights the relevant input field.
 * @param {string} message - The error message to display.
 * @param {string} fieldId - The ID of the input field to highlight.
 */
function showError(message, fieldId) {
  const errorContainer = document.getElementById("passwordError");
  errorContainer.textContent = message;
  errorContainer.style.display = "block";
  const field = document.getElementById(fieldId);
  if (field) {
    field.style.border = "1px solid red";
  }
}

/**
 * Clears all error messages and resets input field styles.
 */
function clearErrors() {
  const errorContainer = document.getElementById("passwordError");
  errorContainer.style.display = "none";
  const fields = document.querySelectorAll(".loginInputFeld");
  fields.forEach((field) => {
    field.style.border = "";
  });
}

/**
 * Handles the sign-up process when the "Sign up" button is clicked.
 */
async function handleSignUp() {
  const inputs = getSignUpInputs();
  if (!validateInputs(inputs)) return;
  const isValid = validateSignUpInputs(inputs);
  if (!isValid) return;
  processSignUp(inputs);
}

/**
 * Validates the sign-up inputs (email and name).
 * @param {Object} inputs - The input values.
 * @returns {boolean} - True if the inputs are valid, false otherwise.
 */
function validateSignUpInputs(inputs) {
  clearErrors();
  if (!validateEmail(inputs.email)) {
    showError("Bitte gib eine gültige E-Mail-Adresse ein.", "emailField");
    return false;
  }
  if (!validateName(inputs.name)) {
    showError("Bitte gib einen gültigen Namen ein.", "nameField");
    return false;
  }
  return true;
}

/**
 * Processes the sign-up and pushes the user data to the database.
 * @param {Object} inputs - The user inputs.
 */
async function processSignUp(inputs) {
  const user = createUserObject(inputs);
  try {
    await pushUserToDatabase(user);
    storeUserInSessionStorage(user);
    showSignUpPopup();
    redirectToHome();
  } catch (error) {
    showError(
      "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
      "nameField"
    );
  }
}
