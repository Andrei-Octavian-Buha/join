/**
 * Base URL for Firebase Realtime Database.
 * @constant {string} BASE_URL
 */
const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Stores the current user's name and email in session storage.
 * @param {Object} user - The user object.
 * @param {string} user.name - The user's name.
 * @param {string} user.email - The user's email.
 */
function storeUserInSessionStorage(user) {
  sessionStorage.setItem(
    "currentUser",
    JSON.stringify({ name: user.name, email: user.email })
  );
}

/**
 * Collects input values from the sign-up form.
 * @returns {Object} An object containing the form inputs.
 * @returns {string} name - The user's name.
 * @returns {string} email - The user's email.
 * @returns {string} password - The user's password.
 * @returns {string} confirmPassword - The confirmation of the password.
 * @returns {boolean} isChecked - Whether the user agrees to the terms.
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
 * Validates the form inputs before submission.
 * @param {Object} inputs - The collected inputs from the form.
 * @returns {boolean} True if inputs are valid, false otherwise.
 */
function validateInputs(inputs) {
  if (
    !inputs.name ||
    !inputs.email ||
    !inputs.password ||
    !inputs.confirmPassword
  ) {
    return false;
  }

  if (!inputs.isChecked) {
    return false;
  }

  if (inputs.password !== inputs.confirmPassword) {
    showPasswordError();
    return false;
  }

  return true;
}

/**
 * Displays an error message if the passwords do not match.
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
 * Creates a user object to store in the database.
 * @param {Object} inputs - The validated user inputs.
 * @returns {Object} A user object with the name, email, and password.
 */
function createUserObject(inputs) {
  return {
    name: inputs.name,
    email: inputs.email,
    password: inputs.password,
  };
}

/**
 * Pushes the user data to the Firebase Realtime Database.
 * @param {Object} user - The user object.
 * @returns {Promise} A promise indicating the success or failure of the operation.
 * @throws {Error} If the request fails.
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
 * Saves the current user data to session storage.
 * @param {Object} user - The current user object.
 * @param {string} user.name - The user's name.
 * @param {string} user.email - The user's email.
 */
function saveCurrentUser(user) {
  const currentUser = {
    name: user.name,
    email: user.email,
  };
  sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
}

/**
 * Redirects to the summary page after a successful sign-up.
 */
function redirectToHomeSSummary() {
  window.location.href = "summary_user.html";
}

/**
 * Displays a popup message when the sign-up is successful.
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
 * Redirects to the home page after a delay.
 */
function redirectToHome() {
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
}

/**
 * Initializes event listeners after the DOM is loaded.
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
 * Toggles the visibility of the password input field.
 * @param {string} inputId - The ID of the password input element.
 * @param {HTMLImageElement} icon - The icon element that indicates visibility.
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
 * Validates if the two password fields match.
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
 * Redirects to the login page when the back button is clicked.
 */
function backToLogin() {
  let backToLogin = document.getElementById("backToLogin");
  backToLogin.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

/**
 * Validates the email address using a regular expression.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

/**
 * Validates the user's name, ensuring it is at least 3 characters long and contains only letters and spaces.
 * @param {string} name - The name to validate.
 * @returns {boolean} True if the name is valid, false otherwise.
 */
function validateName(name) {
  const isValidLength = name.length >= 3;
  const isValidFormat = /^[a-zA-ZäöüÄÖÜß\s]+$/.test(name); // Allows letters (including German umlauts) and spaces
  return isValidLength && isValidFormat;
}

/**
 * Displays an error message in a specified field.
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
 * Clears any errors displayed on the form.
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
 * @async
 * @function
 */
async function handleSignUp() {
  const inputs = getSignUpInputs();
  if (!validateInputs(inputs)) return;

  const isValid = validateSignUpInputs(inputs);
  if (!isValid) return;

  processSignUp(inputs);
}

/**
 * Validates the sign-up form fields.
 * @param {Object} inputs - The collected inputs from the form.
 * @returns {boolean} True if inputs are valid, false otherwise.
 */
function validateSignUpInputs(inputs) {
  clearErrors();

  if (!validateEmail(inputs.email)) {
    showError("Please enter a valid email address.", "emailField");
    return false;
  }

  if (!validateName(inputs.name)) {
    showError("Please enter a valid name.", "nameField");
    return false;
  }

  return true;
}

/**
 * Processes the sign-up and stores the user in the database.
 * @async
 * @param {Object} inputs - The validated user inputs.
 */
async function processSignUp(inputs) {
  const user = createUserObject(inputs);
  try {
    await pushUserToDatabase(user);
    storeUserInSessionStorage(user);
    showSignUpPopup();
    redirectToHome();
  } catch (error) {
    showError("An error occurred. Please try again.", "nameField");
  }
}
