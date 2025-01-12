/**
 * Handles the submission of the contact form, validates the contact data,
 * and sends the data to the server if valid.
 *
 * @param {Event} event - The event object representing the form submission.
 * @returns {Promise<void>} - A promise that resolves when the process is complete.
 */
async function addContact(event) {
  event.preventDefault();
  try {
    const contact = gatherContactData();
    if (!validateContactData(contact)) return;
    const response = await sendContactData(contact);
    if (response.ok) {
      handleSuccess();
    } else {
      handleError(response.statusText);
    }
  } catch (error) {
    handleNetworkError(error);
  }
}

/**
 * Gathers the contact data from the form inputs.
 *
 * @returns {Object} - An object containing the contact data (name, email, and phone).
 */
function gatherContactData() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  return { name, email, phone };
}

/**
 * Validates the contact data to ensure all fields are filled in correctly.
 *
 * @param {Object} contact - The contact data to validate.
 * @returns {boolean} - Returns true if the data is valid, false otherwise.
 */
function validateContactData({ name, email, phone }) {
  if (![name, email, phone].every(Boolean)) {
    return alert("Bitte alle Felder ausfüllen."), false;
  }
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[0-9]{8,15}$/
  };
  for (const [field, regex] of Object.entries(patterns)) {
    if (!regex.test(eval(field))) {
      return alert(`Bitte eine gültige ${field === "email" ? "E-Mail-Adresse" : "Telefonnummer"} eingeben.`), false;
    }
  }
  return true;
}


/**
 * Sends the contact data to the server.
 *
 * @param {Object} contact - The contact data to send.
 * @returns {Promise<Response>} - A promise that resolves to the response object from the server.
 */
async function sendContactData(contact) {
  const response = await fetch(`${BASE_URL}/contacts.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  });
  return response;
}

/**
 * Handles the success response after the contact data is successfully saved.
 */
function handleSuccess() {
  const toast = document.getElementById("toast");
  toast.innerHTML = "Kontakt erfolgreich gespeichert!";
  toast.style.display = "block";
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);
  document.getElementById("contactForm").reset();
  closeOverlay("overlay");
  fetchContactsData();
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.style.display = "none";}, 500);}, 3000);
}

/**
 * Handles an error response when there is an issue with adding the contact.
 *
 * @param {string} errorText - The error message to display.
 */
function handleError(errorText) {
  console.error(`Fehler beim Hinzufügen des Kontakts: ${errorText}`);
  alert("Fehler beim Hinzufügen des Kontakts. Bitte erneut versuchen.");
}

/**
 * Handles a network error that occurs during the contact submission process.
 *
 * @param {Error} error - The error object representing the network error.
 */
function handleNetworkError(error) {
  console.error("Netzwerkfehler:", error);
  alert(
    "Es ist ein Netzwerkfehler aufgetreten. Bitte überprüfen Sie Ihre Verbindung."
  );
}

const inputs = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
};

const editInputs = {
  name: document.getElementById("inputName"),
  email: document.getElementById("inputMail"),
  phone: document.getElementById("inputPhone"),
};

const patterns = {
  name: /^[a-zA-ZäöüÄÖÜß\s-]{3,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[0-9]{8,15}$/,
};

const messages = {
  name: 'Bitte mindestens 3 Buchstaben. Leerzeichen / Bindestriche sind möglich (Beispiel: "Max", "Anna Maria", "Müller-Schmidt")',
  email:
    'Bitte eine gültige E-Mail-Adresse eingeben. (Beispiel: "name@domain.de")',
  phone:
    'Bitte eine gültige Telefonnummer (min. 8 Zahlen) eingeben. (Beispiel: "+49123456789")',
};

/**
 * Creates error message elements for the provided input set.
 *
 * @param {Object} inputSet - A set of form input elements.
 */
function createErrorMessages(inputSet) {
  Object.keys(inputSet).forEach((field) => {
    const input = inputSet[field];
    if (!document.getElementById(`${input.id}-error`)) {
      const errorMessage = document.createElement("div");
      errorMessage.id = `${input.id}-error`;
      errorMessage.style.color = "red";
      errorMessage.style.fontSize = "12px";
      errorMessage.style.marginTop = "5px";
      errorMessage.style.textAlign = "center";
      input.parentNode.appendChild(errorMessage);
    }
  });
}

/**
 * Validates a single field of the form.
 *
 * @param {string} field - The name of the field to validate.
 * @param {Object} inputSet - A set of form input elements.
 * @returns {boolean} - Returns true if the field is valid, false otherwise.
 */
function validateField(field, inputSet) {
  const input = inputSet[field];
  const isValid = patterns[field].test(input.value.trim());
  const errorMessage = document.getElementById(`${input.id}-error`);
  if (isValid) {
    input.style.border = "1px solid darkgreen";
    errorMessage.textContent = "";
  } else {
    input.style.border = "1px solid red";
    errorMessage.textContent = messages[field];
  }
  return isValid;
}

/**
 * Validates the entire form by checking all fields.
 *
 * @param {Object} inputSet - A set of form input elements.
 * @returns {boolean} - Returns true if all fields are valid, false otherwise.
 */
function validateForm(inputSet) {
  let isFormValid = true;
  Object.keys(inputSet).forEach((field) => {
    if (!validateField(field, inputSet)) {
      isFormValid = false;
    }
  });
  return isFormValid;
}

/**
 * Handles the form submission event, validating the form before submission.
 *
 * @param {Event} event - The submit event.
 * @param {Object} inputSet - A set of form input elements.
 */
function handleSubmit(event, inputSet) {
  event.preventDefault();
  const errorContainer = document.querySelector(".error-container");
  if (validateForm(inputSet)) {
    errorContainer.style.display = "none";
  } else {
    errorContainer.style.display = "block";
    errorContainer.textContent = "Bitte korrigiere die markierten Felder.";
  }
}

/**
 * Initializes blur validation for form fields.
 *
 * @param {Object} inputSet - A set of form input elements.
 */
function initializeBlurValidation(inputSet) {
  Object.keys(inputSet).forEach((field) => {
    inputSet[field].addEventListener("blur", () =>
      validateField(field, inputSet)
    );
  });
}

/**
 * Sets up event listeners and initializes validation for contact forms after the DOM has fully loaded.
 *
 * @description
 * This script listens for the `DOMContentLoaded` event to ensure that all DOM elements are fully loaded before executing. It performs the following tasks:
 * 
 * 1. **Create Error Messages**:
 *    - Calls `createErrorMessages` for two sets of inputs: `inputs` and `editInputs`.
 *    - These are likely collections of input fields for the main contact form and the edit contact form.
 * 
 * 2. **Initialize Blur Validation**:
 *    - Calls `initializeBlurValidation` for both `inputs` and `editInputs`.
 *    - Presumably sets up validation that triggers when a user leaves (blurs) an input field.
 * 
 * 3. **Add Submit Event Listeners**:
 *    - Adds a `submit` event listener to the main contact form (`contactForm`) and the edit contact form (`editContactForm`).
 *    - On submission, both forms call the `handleSubmit` function, passing the respective event object and input collection (`inputs` or `editInputs`) as arguments.
 * 
 * @event DOMContentLoaded
 * Executes the setup logic only after the DOM content has been completely loaded and parsed.
 * 
 * @functions
 * - `createErrorMessages(inputs)`: Creates error messages for the specified input fields.
 * - `initializeBlurValidation(inputs)`: Sets up blur validation for the specified input fields.
 * - `handleSubmit(event, inputs)`: Handles form submission, typically performing validation and processing logic.
 */
document.addEventListener("DOMContentLoaded", () => {
  createErrorMessages(inputs);
  createErrorMessages(editInputs);

  initializeBlurValidation(inputs);
  initializeBlurValidation(editInputs);

  document
    .getElementById("contactForm")
    .addEventListener("submit", (event) => handleSubmit(event, inputs));
  document
    .getElementById("editContactForm")
    .addEventListener("submit", (event) => handleSubmit(event, editInputs));
});

/**
 * Resets the form errors, clearing the error messages and borders.
 *
 * @param {Object} inputSet - A set of form input elements.
 */
function resetFormErrors(inputSet) {
  Object.keys(inputSet).forEach((field) => {
    const input = inputSet[field];
    const errorMessage = document.getElementById(`${input.id}-error`);

    input.style.border = "1px solid #ccc";

    if (errorMessage) {
      errorMessage.textContent = "";
    }
  });
}
