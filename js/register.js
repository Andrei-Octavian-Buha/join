// Define BASE_URL
const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app";

  let currentUser = null; // Globale Variable für den aktuellen Nutzer

// Nach erfolgreichem Registrieren
function storeUserInLocalStorage(user) {
  localStorage.setItem("currentUser", JSON.stringify({ name: user.name, email: user.email }));
}

async function handleSignUp() {
  const inputs = getSignUpInputs();
  if (!validateInputs(inputs)) return;
  const user = createUserObject(inputs);

  try {
    await pushUserToDatabase(user);
    storeUserInLocalStorage(user); // Speichert Name und Email
    showSignUpPopup();
    redirectToHome();
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again.");
  }
}


// Collect input values
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

// Function to validate inputs
function validateInputs(inputs) {
  if (!inputs.name || !inputs.email || !inputs.password || !inputs.confirmPassword) {
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

// Function that shows error if passwords don't match
function showPasswordError() {
  const errorContainer = document.getElementById("passwordError");
  const passwordInputs = document.querySelectorAll('input[type="password"]');

  errorContainer.style.display = "block";

  passwordInputs.forEach(input => {
    input.classList.add("error");
  });
}

// Create a user object
function createUserObject(inputs) {
  return {
    name: inputs.name,
    email: inputs.email,
    password: inputs.password,
  };
}

// Push user data to the database
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

// Save current user in Local Storage
function saveCurrentUser(user) {
  const currentUser = {
    name: user.name,
    email: user.email,
  };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

// Redirect to Summary Page
function redirectToHome() {
  window.location.href = "summary_user.html";
}

// Display signup success popup
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



// Redirect to home page after a delay
function redirectToHome() {
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
}

// Initialize event listeners after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const signUpButton = document.getElementById("signupButton");
  if (signUpButton) {
    signUpButton.addEventListener("click", handleSignUp);
  } else {
    console.error("Sign up button not found in the DOM.");
  }
});

function togglePassword(inputId, icon) {
    var input = document.getElementById(inputId);
    var isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    icon.src = isPassword ? './assets/menu/visibility-off.png' : './assets/menu/lock.svg';
  }

  function validatePasswords() {
    var passwordField1 = document.getElementById('passwordField1');
    var passwordField2 = document.getElementById('passwordField2');
    
    if (passwordField1.value !== passwordField2.value) {
      passwordField1.style.border = "1px solid red";
      passwordField2.style.border = "1px solid red";
    } else {
      passwordField1.style.border = "";
      passwordField2.style.border = "";
    }
  }
  









function backToLogin(){
    let backToLogin = document.getElementById("backToLogin");
    backToLogin.addEventListener("click", ()=>{
        window.location.href = "index.html";
    })
}


