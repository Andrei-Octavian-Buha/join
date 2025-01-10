/**
 * Updates the content and displays the toast element.
 * @param {HTMLElement} toast - The toast element to display.
 * @param {string} message - The message to display in the toast.
 */
function showToast(toast, message) {
  toast.innerHTML = message; 
  toast.style.display = "block"; 
  toast.classList.add("show"); 
  toast.classList.remove("hide"); 
}

/**
 * Hides the toast element after a specified duration.
 * @param {HTMLElement} toast - The toast element to hide.
 * @param {number} duration - The duration (in milliseconds) to display the toast before hiding it.
 */
function hideToast(toast, duration) {
  setTimeout(() => {
    toast.classList.remove("show"); 
    toast.classList.add("hide"); 
    
    const fadeOutDuration = 2000; 
    setTimeout(() => {
      toast.style.display = "none"; 
    }, fadeOutDuration);
  }, duration);
}

/**
 * Displays a toast message with the provided text and hides it automatically after a delay.
 * @param {string} message - The message to display in the toast.
 * @param {number} duration - The duration (in milliseconds) to display the toast.
 * @returns {HTMLElement} The toast element.
 */
function showToastMessage(message, duration = 4000) {
  const toast = document.getElementById("toast"); 
  showToast(toast, message); 
  hideToast(toast, duration); 
  return toast;
}




/**
 * Adds confirmation buttons (Delete and Cancel) to the toast message.
 * @param {HTMLElement} toast - The toast element to append the buttons to.
 * @returns {Object} An object containing the confirm and cancel buttons.
 */
function addConfirmationButtons(toast) {
  const confirmButton = document.createElement("button");
  const cancelButton = document.createElement("button");
  confirmButton.textContent = "Löschen";
  cancelButton.textContent = "Abbrechen";
  confirmButton.classList.add("toast-button");
  cancelButton.classList.add("toast-button");
  toast.appendChild(confirmButton);
  toast.appendChild(cancelButton);
  return { confirmButton, cancelButton };
}

/**
 * Deletes a contact from the API.
 * @param {string} contactId - The ID of the contact to delete.
 * @returns {Promise<boolean>} Resolves to true if the contact was deleted successfully, otherwise false.
 */
async function deleteContactFromApi(contactId) {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
      method: "DELETE",
    });

    if (!response.ok) {
    }

    return true;
  } catch (error) {}
}

/**
 * Shows a success toast message when a contact is deleted.
 */
function showDeletionSuccessToast() {
  const toast = document.getElementById("toast");
  toast.innerHTML = "Kontakt wurde erfolgreich gelöscht!";
  setTimeout(() => {
    toast.classList.add("show");
    toast.classList.remove("hide");
  }, 100);
}

/**
 * Hides the toast message after a delay.
 */
function hideToast() {
  const toast = document.getElementById("toast");
  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => {
      toast.style.display = "none";
    }, 500);
  }, 1000);
}

/**
 * Updates the second overlay to show the "Add a new Contact" section.
 */
function updateSecondOverlay() {
  const secondOverlay = document.getElementById("secondOverlay");
  const contactOverlay = document.getElementById("contact-overlay");
  contactOverlay.style.display = "none";
  secondOverlay.style.display = "block";
  secondOverlay.innerHTML = "<h3>Add a new Contact</h3>";
}

/**
 * Hides the second overlay and clears its content.
 */
function hideSecondOverlay() {
  const secondOverlay = document.getElementById("secondOverlay");
  secondOverlay.style.display = "none";
  secondOverlay.innerHTML = "";
}

/**
 * Shows a confirmation toast asking if the user is sure they want to delete a contact.
 * @returns {Object} An object containing the toast, confirm button, and cancel button elements.
 */
function showConfirmationToast() {
  const toast = document.getElementById("toast");
  toast.innerHTML = "Kontakt wirklich löschen?";
  const confirmButton = createToastButton("Löschen", "toast-button");
  const cancelButton = createToastButton("Abbrechen", "toast-button");
  toast.append(confirmButton, cancelButton);
  displayToast(toast);
  return { toast, confirmButton, cancelButton };
}

/**
 * Creates a toast button with specified text and class name.
 * @param {string} text - The text to display on the button.
 * @param {string} className - The class to apply to the button.
 * @returns {HTMLElement} The created button element.
 */
function createToastButton(text, className) {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add(className);
  return button;
}

/**
 * Displays the toast message by making it visible.
 * @param {HTMLElement} toast - The toast element to display.
 */
function displayToast(toast) {
  toast.style.display = "block";
  setTimeout(() => {
    toast.classList.add("show");
    toast.classList.remove("hide");
  }, 100);
}

/**
 * Handles user confirmation for deleting a contact. Resolves or rejects based on the user's action.
 * @param {HTMLElement} confirmButton - The button to confirm the deletion.
 * @param {HTMLElement} cancelButton - The button to cancel the deletion.
 * @param {string} contactId - The ID of the contact to delete.
 * @param {HTMLElement} toast - The toast element containing the confirmation buttons.
 * @returns {Promise<void>} Resolves if the user confirms deletion, rejects if canceled.
 */
function handleUserConfirmation(confirmButton, cancelButton, contactId, toast) {
  return new Promise((resolve, reject) => {
    confirmButton.addEventListener("click", async () => {
      const isDeleted = await deleteContactFromApi(contactId);
      if (isDeleted) {
        showDeletionSuccessToast();
        setTimeout(() => hideToast(), 3000);
        fetchContactsData();
        updateSecondOverlay();
        resolve();
      } else {
      }
    });
    cancelButton.addEventListener("click", () => {
      toast.classList.add("hide");
      setTimeout(() => (toast.style.display = "none"), 100);
      reject("Abgebrochen");
    });
  });
}

/**
 * Deletes a contact and handles the confirmation process.
 * @param {string} contactId - The ID of the contact to delete.
 * @returns {Promise<void>} Resolves once the deletion process is complete.
 */
async function deleteContact(contactId) {
  try {
    const { toast, confirmButton, cancelButton } = showConfirmationToast();
    return await handleUserConfirmation(
      confirmButton,
      cancelButton,
      contactId,
      toast
    );
  } catch (error) {}
}

/**
 * Displays the overlay for editing a contact.
 */
function showEditContactOverlay() {
  const editContactOverlay = document.getElementById("edit-contact-overlay");

  if (editContactOverlay) {
    editContactOverlay.style.display = "block";
  } else {
  }
}

/**
 * Fetches and fills in the contact data for editing.
 * @param {string} contactId - The ID of the contact to fetch.
 */
async function fetchAndFillContactData(contactId) {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`);
    if (!response.ok) {
    }
    const contact = await response.json();
    document.getElementById("inputName").value = contact.name;
    document.getElementById("inputMail").value = contact.email;
    document.getElementById("inputPhone").value = contact.phone;
    const editContactOverlay = document.getElementById("edit-contact-overlay");
    if (editContactOverlay) {
      editContactOverlay.dataset.contactId = contactId;
    }
    displayBadgeInContainer(contact.name);
  } catch (error) {}
}

function editContact(contactId, event) {
  const menu = document.querySelector(".menu");
  if (event) {
    event.stopPropagation();
  }
  const editContactOverlay = document.getElementById("edit-contact-overlay");
  editContactOverlay.style.display = "block"; // Display overlay
  fetchAndFillContactData(contactId);
  const deleteButton = document.getElementById("deleteButton");
  deleteButton.onclick = function () {
    deleteContact(contactId);
  };
  menu.classList.remove("visible");
}

/**
 * Updates a contact on the server.
 * @param {string} contactId - The ID of the contact to update.
 * @param {string} name - The updated name of the contact.
 * @param {string} email - The updated email of the contact.
 * @param {string} phone - The updated phone number of the contact.
 * @returns {Promise<Object>} The updated contact data.
 */
async function updateContactOnServer(contactId, name, email, phone) {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
      method: "PUT", // PUT für Update
      body: JSON.stringify({ name, email, phone }),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
    }
    const updatedContact = await response.json();
    return updatedContact;
  } catch (error) {
    throw error;
  }
}

/**
 * Updates the contact overlay with the updated contact information.
 * @param {Object} updatedContact - The updated contact data.
 */
function updateContactOverlay(updatedContact) {
  closeOverlay("edit-contact-overlay");
  const contactOverlay = document.getElementById("contact-overlay");
  if (contactOverlay) {
    contactOverlay.querySelector(".contact-name").textContent =
      updatedContact.name;
    contactOverlay.querySelector(".contact-email").textContent =
      updatedContact.email;
    contactOverlay.querySelector(".contact-phone").textContent =
      "+49 " + updatedContact.phone;
  }
  fetchContactsData();
}

/**
 * Validates the contact data (name, email, and phone).
 * @param {Object} contact - The contact data to validate.
 * @returns {boolean} True if the contact data is valid, false otherwise.
 */
function validateContactData(contact) {
  const { name, email, phone } = contact;
  const nameRegex = /^[A-Za-z\s\-]+$/;
  if (!name || name.trim().length === 0 || !nameRegex.test(name)) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  const phoneRegex = /^\+?[0-9]{8,15}$/;
  if (!phoneRegex.test(phone)) {
    return false;
  }
  return true;
}

/**
 * Retrieves the form data from the input fields.
 * @returns {Object} An object containing the name, email, and phone data from the form.
 */
function getFormData() {
  const name = document.getElementById("inputName").value.trim();
  const email = document.getElementById("inputMail").value.trim();
  const phone = document.getElementById("inputPhone").value.trim();
  return { name, email, phone };
}

/**
 * Validates the form data.
 * @param {Object} contactData - The contact data to validate.
 * @returns {boolean} True if the form data is valid, false otherwise.
 */
function validateFormData(contactData) {
  return validateContactData(contactData);
}

/**
 * Updates a contact's information on the server.
 * @param {string} contactId - The ID of the contact to update.
 * @param {string} name - The updated name of the contact.
 * @param {string} email - The updated email of the contact.
 * @param {string} phone - The updated phone number of the contact.
 * @returns {Promise<Object>} The updated contact data.
 */
async function updateContact(contactId, name, email, phone) {
  return await updateContactOnServer(contactId, name, email, phone);
}

/**
 * Handles the form submission event to update the contact information.
 * @param {Event} event - The form submit event.
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  const contactId = document.getElementById("edit-contact-overlay").dataset
    .contactId;
  const contactData = getFormData();
  if (!validateFormData(contactData)) return;
  try {
    const updatedContact = await updateContact(
      contactId,
      contactData.name,
      contactData.email,
      contactData.phone
    );
    updateContactOverlay(updatedContact);
    showToastMessage("Kontakt erfolgreich aktualisiert!");
  } catch (error) {}
}

/**
 * Handles clicks outside of the overlay to close it.
 * @param {Event} event - The click event.
 */
function handleClickOutsideOverlay(event) {
  const editContactOverlay = document.getElementById("edit-contact-overlay");
  if (!editContactOverlay || editContactOverlay.style.display !== "block") {
    return;
  }
  if (
    editContactOverlay.contains(event.target) ||
    event.target.closest(".edit-button-container")
  ) {
    return; 
  }
  closeOverlay("edit-contact-overlay");
}

document.addEventListener("click", handleClickOutsideOverlay);
