/**
 * The base URL for the Firebase database.
 * @constant {string}
 */
const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Initializes the application by fetching the contact data.
 */
function init() {
  fetchContactsData();
}

/**
 * Stores overlay event listeners to track them and handle clicks outside overlays.
 * @type {Map<string, Function>}
 */
const overlayListeners = new Map();

/**
 * Opens an overlay with a specified ID, adding animation and handling clicks outside to close it.
 * @param {string} overlayId - The ID of the overlay to open.
 */
function openOverlay(overlayId) {
  const overlay = document.getElementById(overlayId);
  const overlayContent = document.getElementById("overlay-content");
  overlay.style.display = "block"; // Make visible
  setTimeout(() => overlay.classList.add("show"), 0); // Start animation

  const handleClickOutside = (event) => {
    if (!overlayContent.contains(event.target)) {
      closeOverlay(overlayId);
      document.removeEventListener("click", overlayListeners.get(overlayId));
      overlayListeners.delete(overlayId);
    }
  };

  if (overlayListeners.has(overlayId)) {
    document.removeEventListener("click", overlayListeners.get(overlayId));
  }
  overlayListeners.set(overlayId, handleClickOutside);
  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);
}

/**
 * Resets the contact form by clearing the input fields and error messages.
 */
function resetForm() {
  document.getElementById("contactForm").reset();

  // Reset error container
  const errorContainer = document.querySelector(".error-container");
  errorContainer.style.display = "none";
  errorContainer.textContent = "";

  // Remove red borders
  const inputs = document.querySelectorAll("#contactForm input");
  inputs.forEach((input) => (input.style.border = ""));
}

/**
 * Closes an overlay by removing the active class and resetting the form.
 * @param {string} overlayId - The ID of the overlay to close.
 */
function closeOverlay(overlayId) {
  const overlay = document.getElementById(overlayId);
  resetForm();
  resetFormErrors(inputs);
  resetFormErrors(editInputs);

  overlay.classList.remove("show");
  overlay.classList.add("hide");
  setTimeout(() => {
    overlay.style.display = "none";
    overlay.classList.remove("hide");
  }, 800);
}

/**
 * Fetches the contact data from the Firebase database and displays it.
 */
async function fetchContactsData() {
  try {
    const response = await fetch(`${BASE_URL}/contacts.json`);
    if (!response.ok) {
      // Handle error
    }
    const data = await response.json();
    const contactArray = Array.isArray(data)
      ? data
      : Object.keys(data).map((key) => {
          return { ...data[key], id: key };
        });

    displayContacts(contactArray);
  } catch (error) {
    // Handle fetch error
  }
}

/**
 * Displays a list of contacts by sorting them and rendering their cards.
 * @param {Array<Object>} data - The contact data to display.
 */
function displayContacts(data) {
  const contactList = document.getElementById("contactList");
  contactList.innerHTML = "";
  const contactArray = Array.isArray(data) ? data : Object.values(data);

  const sortedContacts = sortContacts(contactArray);
  renderSortedContacts(contactList, sortedContacts);
}

/**
 * Sorts the contacts alphabetically by their name.
 * @param {Array<Object>} contacts - The array of contact objects to sort.
 * @returns {Array<Object>} The sorted contacts.
 */
function sortContacts(contacts) {
  return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Renders a list of sorted contacts as cards in the contact list.
 * @param {HTMLElement} contactList - The container element where contact cards will be appended.
 * @param {Array<Object>} sortedContacts - The sorted list of contacts.
 */
function renderSortedContacts(contactList, sortedContacts) {
  let currentLetter = "";
  sortedContacts.forEach((contact) => {
    const firstLetter = contact.name[0].toUpperCase();

    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      addLetterHeader(contactList, currentLetter);
      addSilverline(contactList);
    }
    const card = createContactCard(contact);
    contactList.appendChild(card);
  });
}

/**
 * Adds a header with the first letter of the contact's name.
 * @param {HTMLElement} contactList - The container element for the contact list.
 * @param {string} letter - The letter to display in the header.
 */
function addLetterHeader(contactList, letter) {
  const letterHeader = document.createElement("h4");
  letterHeader.classList.add("letter-header");
  letterHeader.textContent = letter;
  contactList.appendChild(letterHeader);
}

/**
 * Adds a silver line divider to the contact list.
 * @param {HTMLElement} contactList - The container element for the contact list.
 */
function addSilverline(contactList) {
  const silverline = document.createElement("div");
  silverline.classList.add("silverline");
  contactList.appendChild(silverline);
}

/**
 * Creates a contact card element with initials and contact details.
 * @param {Object} contact - The contact object containing details.
 * @returns {HTMLElement} The created contact card element.
 */
function createContactCard(contact) {
  const card = document.createElement("div");
  card.classList.add("contact-card");
  const initials = getInitials(contact.name);
  const badge = document.createElement("div");
  badge.classList.add("initials-badge");
  badge.textContent = initials;
  badge.style.backgroundColor = getColorForInitial(initials[0]);
  card.appendChild(badge);
  card.innerHTML += createContactCardHTML(contact);
  card.onclick = () => {
    setActiveContact(card);
    handleCardClick(contact.id);
    hideSecondOverlay();
  };
  return card;
}

/**
 * Sets the given contact card as the active one by adding an 'active' class.
 * @param {HTMLElement} element - The contact card to mark as active.
 */
function setActiveContact(element) {
  const contactCards = document.querySelectorAll(".contact-card");
  contactCards.forEach((card) => {
    card.classList.remove("active");
  });

  element.classList.add("active");
}

/**
 * Opens a detailed overlay for a specific contact.
 * @param {string} contactId - The ID of the contact to display.
 * @param {string} contactName - The name of the contact to display.
 * @param {string} contactEmail - The email of the contact to display.
 * @param {string} contactPhone - The phone number of the contact to display.
 */
function openContactOverlay(
  contactId,
  contactName,
  contactEmail,
  contactPhone
) {
  const overlayContent = document.createElement("div");
  overlayContent.innerHTML = generateContactOverlayHTML(
    contactId,
    contactName,
    contactEmail,
    contactPhone
  );

  const contactOverlay = document.getElementById("contact-overlay");
  contactOverlay.innerHTML = "";
  contactOverlay.appendChild(overlayContent);

  overlayContent.classList.add("fly-in");
  contactOverlay.style.display = "block";
  const rightContent = document.querySelector(".right-content");
  if (window.innerWidth <= 920) {
    rightContent.classList.add("show");
    rightContent.style.display = "flex";
  } else {
    rightContent.classList.remove("show");
    rightContent.style.display = "";
  }
  overlayContent.addEventListener("animationend", () => {
    overlayContent.classList.remove("fly-in"); // Remove the class after animation
  });
}

/**
 * Generates the initials from a name by extracting the first two letters.
 * @param {string} name - The name to generate initials from.
 * @returns {string} The initials from the name.
 */
function generateInitials(name) {
  if (!name) return "??";
  const nameParts = name.trim().split(" ");
  return nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

/**
 * Loads user data from session storage.
 * @returns {Object|null} The parsed user data, or null if no user data exists.
 */
function loadUserDataFromSession() {
  const userData = sessionStorage.getItem("currentUser");
  if (!userData) {
    return null;
  }
  try {
    return JSON.parse(userData);
  } catch (error) {
    return null;
  }
}

/**
 * Inserts initials into the specified HTML element.
 * @param {string} initials - The initials to insert.
 * @param {string} elementId - The ID of the element to insert the initials into.
 */
function insertInitialsIntoElement(initials, elementId) {
  const profileTextElement = document.getElementById(elementId);
  profileTextElement.innerHTML = initials;
}

/**
 * Sets the user's initials from session data and inserts them into the profile text element.
 */
function setUserInitials() {
  const user = loadUserDataFromSession();
  if (!user || !user.name) return;

  const initials = generateInitials(user.name);
  insertInitialsIntoElement(initials, "profileText");
}

/**
 * Waits for the DOM to be fully loaded and sets the user's initials in the profile text.
 */
document.addEventListener("DOMContentLoaded", () => {
  const checkHeaderInterval = setInterval(() => {
    const profileTextElement = document.getElementById("profileText");
    if (profileTextElement) {
      clearInterval(checkHeaderInterval);
      setUserInitials();
    }
  }, 100);
});

/**
 * Displays the contact overlay with the provided contact information.
 * This function generates the overlay HTML and updates the container to display it.
 * @param {string} contactId - The unique ID of the contact.
 * @param {string} contactName - The name of the contact.
 * @param {string} contactEmail - The email of the contact.
 * @param {string} contactPhone - The phone number of the contact.
 */
function displayContactOverlay(
  contactId,
  contactName,
  contactEmail,
  contactPhone
) {
  const overlayContainer = document.getElementById("overlay-container");
  const overlayHTML = generateContactOverlayHTML(
    contactId,
    contactName,
    contactEmail,
    contactPhone
  );

  if (overlayContainer) {
    overlayContainer.innerHTML = overlayHTML;
  } else {
    // Handle error (container not found)
  }
}

/**
 * Handles the click event on a contact card by fetching the detailed contact information
 * and displaying it in an overlay.
 * @param {string} contactId - The unique ID of the contact.
 * @returns {Promise<void>}
 */
async function handleCardClick(contactId) {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`);
    if (!response.ok) {
      // Handle error (failed to fetch contact data)
    }
    const contact = await response.json();
    if (contact) {
      openContactOverlay(contactId, contact.name, contact.email, contact.phone);
    } else {
      // Handle case where contact does not exist
    }
  } catch (error) {
    // Handle fetch error
  }
}

/**
 * Creates a badge displaying the initials of a given name.
 * Optionally, you can pass a custom class name for the badge's styling.
 * @param {string} name - The name from which to generate initials.
 * @param {string} [className='default-badge'] - The class name to apply to the badge (optional).
 * @returns {HTMLElement} The badge element with initials and background color.
 */
function createInitialsBadge(name, className = "default-badge") {
  const initials = getInitials(name);
  const badge = document.createElement("div");
  badge.classList.add(className);
  badge.textContent = initials;
  badge.style.backgroundColor = getColorForInitial(initials[0]);
  return badge;
}

/**
 * Toggles the visibility of the dropdown menu by switching its display style between "block" and "none".
 */
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

/**
 * Closes the dropdown menu if the user clicks outside of the dropdown or profile picture element.
 * This function listens for a click event on the window and checks if the target is outside the dropdown and profile picture.
 * @param {Event} event - The click event triggered on the window.
 */
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

/**
 * Retrieves the current user data from session storage.
 * @returns {Object|null} The parsed user data if it exists, otherwise null.
 */
function getCurrentUser() {
  const user = sessionStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

/**
 * Extracts the initials from a full name by splitting the name into parts and taking the first letter of each part.
 * If no name is provided, returns "??".
 * @param {string} name - The full name to extract initials from.
 * @returns {string} The initials derived from the name (up to two initials).
 */
function getInitials(name) {
  if (!name) return "??";
  const nameParts = name.trim().split(" ");
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase());
  return initials.slice(0, 2).join("");
}

/**
 * Sets the initials of the current user (stored in session storage) and updates the element with ID "profileText".
 * If the user data is not valid or not found, no updates will occur.
 */
function setUserInitialss() {
  const userData = sessionStorage.getItem("currentUser");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      const initials = getInitials(user.name);
      const profileTextElement = document.getElementById("profileText");
      if (profileTextElement) {
        profileTextElement.innerHTML = initials;
      }
    } catch (error) {
      console.error("Error processing user data:", error);
    }
  }

  /**
   * Waits for the DOM content to be fully loaded, then sets the user's initials in the profile text element.
   * The function checks for the existence of the "profileText" element before updating it.
   */
  document.addEventListener("DOMContentLoaded", () => {
    const checkHeaderInterval = setInterval(() => {
      const profileTextElement = document.getElementById("profileText");
      if (profileTextElement) {
        clearInterval(checkHeaderInterval);
        setUserInitials();
      }
    }, 100);
  });
}

/**
 * Displays a toast message with a specified message.
 * @param {string} message - The message to be displayed in the toast.
 * @returns {HTMLElement} The toast element.
 */
function showToastMessage(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.style.display = "none";
    }, 500);
  }, 3000);

  return toast;
}

/**
 * Adds confirmation buttons (confirm and cancel) to the toast message.
 * @param {HTMLElement} toast - The toast element to append the buttons to.
 * @returns {Object} An object containing the confirm and cancel button elements.
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
 * Sends a request to delete a contact from the API by its ID.
 * @param {string} contactId - The ID of the contact to be deleted.
 * @returns {boolean} A boolean indicating if the contact was successfully deleted.
 */
async function deleteContactFromApi(contactId) {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Displays a toast message indicating that the contact was successfully deleted.
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
 * Displays a secondary overlay for adding a new contact.
 */
function updateSecondOverlay() {
  const secondOverlay = document.getElementById("secondOverlay");
  const contactOverlay = document.getElementById("contact-overlay");

  contactOverlay.style.display = "none";

  secondOverlay.style.display = "block";

  secondOverlay.innerHTML = "<h3>Add a new Contact</h3>";
}

/**
 * Hides the secondary overlay for adding a new contact.
 */
function hideSecondOverlay() {
  const secondOverlay = document.getElementById("secondOverlay");
  secondOverlay.style.display = "none";

  secondOverlay.innerHTML = "";
}

/**
 * Displays a confirmation toast asking if the contact should be deleted.
 * @returns {Object} An object containing the toast and the confirm and cancel buttons.
 */
function showConfirmationToast() {
  const toast = document.getElementById("toast");
  const confirmButton = document.createElement("button");
  const cancelButton = document.createElement("button");

  confirmButton.textContent = "Löschen";
  cancelButton.textContent = "Abbrechen";
  confirmButton.classList.add("toast-button");
  cancelButton.classList.add("toast-button");

  toast.innerHTML = "Kontakt wirklich löschen?";
  toast.appendChild(confirmButton);
  toast.appendChild(cancelButton);

  toast.style.display = "block";
  setTimeout(() => {
    toast.classList.add("show");
    toast.classList.remove("hide");
  }, 100);

  return { toast, confirmButton, cancelButton };
}

/**
 * Handles the user confirmation to delete a contact.
 * @param {HTMLElement} confirmButton - The confirm button element.
 * @param {HTMLElement} cancelButton - The cancel button element.
 * @param {string} contactId - The ID of the contact to be deleted.
 * @param {HTMLElement} toast - The toast element.
 * @returns {Promise} Resolves if the deletion is confirmed, rejects if cancelled.
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
        reject("Fehler bei der Löschung");
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
 * Deletes a contact after user confirmation.
 * @param {string} contactId - The ID of the contact to be deleted.
 * @returns {Promise} Resolves if the contact is deleted, otherwise rejects.
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
  } catch (error) {
    console.error(error);
  }
}

/**
 * Displays the overlay for editing a contact.
 * @param {string} contactId - The ID of the contact to be edited.
 */
function editContact(contactId) {
  const editContactOverlay = document.getElementById("edit-contact-overlay");

  if (editContactOverlay) {
    editContactOverlay.style.display = "block";
  } else {
    console.error("Edit overlay not found");
  }
}

/**
 * Fetches and populates the form fields with the contact data.
 * @param {string} contactId - The ID of the contact to fetch.
 */
async function fetchAndFillContactData(contactId) {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch contact data");
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
  } catch (error) {
    console.error("Error fetching contact data:", error);
  }
}

/**
 * Updates a contact on the server with new data.
 * @param {string} contactId - The ID of the contact to update.
 * @param {string} name - The updated name of the contact.
 * @param {string} email - The updated email of the contact.
 * @param {string} phone - The updated phone number of the contact.
 * @returns {Object} The updated contact data.
 */
async function updateContactOnServer(contactId, name, email, phone) {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
      method: "PUT",
      body: JSON.stringify({ name, email, phone }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to update contact");
    }

    const updatedContact = await response.json();
    return updatedContact;
  } catch (error) {
    throw error;
  }
}

/**
 * Validates the contact data to ensure it's in the correct format.
 * @param {Object} contact - The contact data to validate.
 * @returns {boolean} True if the contact data is valid, otherwise false.
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
 * Retrieves the data from the form fields.
 * @returns {Object} The contact data from the form.
 */
function getFormData() {
  const name = document.getElementById("inputName").value.trim();
  const email = document.getElementById("inputMail").value.trim();
  const phone = document.getElementById("inputPhone").value.trim();

  return { name, email, phone };
}

/**
 * Validates the form data before submitting.
 * @param {Object} contactData - The contact data to validate.
 * @returns {boolean} True if the form data is valid, otherwise false.
 */
function validateFormData(contactData) {
  return validateContactData(contactData);
}

/**
 * Handles the form submission for editing a contact.
 * @param {Event} event - The submit event triggered by the form.
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
  } catch (error) {
    console.error("Error updating contact:", error);
  }
}

/**
 * Handles clicks outside of the edit contact overlay to close it.
 * @param {Event} event - The click event triggered when a user clicks outside the overlay.
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

/**
 * Adds a new contact by gathering, validating, and sending the data to the server.
 * @param {Event} event - The submit event triggered by the form submission.
 * @returns {Promise<void>}
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
 * Gathers contact data from the form inputs.
 * @returns {Object} The contact data containing name, email, and phone.
 */
function gatherContactData() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  return { name, email, phone };
}

/**
 * Sends the contact data to the server.
 * @param {Object} contact - The contact data to send.
 * @returns {Promise<Response>} The response from the server.
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
 * Handles a successful contact addition.
 * Displays a success message, resets the form, and refreshes the contact list.
 */
function handleSuccess() {
  const toast = document.getElementById("toast");

  toast.innerHTML = "Contact successfully saved!";
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
      toast.style.display = "none";
    }, 500);
  }, 3000);
}

/**
 * Handles an error during contact addition.
 * @param {string} errorText - The error message.
 */
function handleError(errorText) {
  console.error(`Error adding contact: ${errorText}`);
  alert("Error adding contact. Please try again.");
}

/**
 * Handles a network error.
 * @param {Error} error - The error object.
 */
function handleNetworkError(error) {
  console.error("Network error:", error);
  alert("A network error occurred. Please check your connection.");
}

/**
 * Validates a single form field based on its pattern.
 * @param {string} field - The field name (e.g., 'name', 'email', 'phone').
 * @param {Object} inputSet - The set of input fields.
 * @returns {boolean} `true` if the field is valid, otherwise `false`.
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
 * @param {Object} inputSet - The set of input fields to validate.
 * @returns {boolean} `true` if all fields are valid, otherwise `false`.
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
 * Handles the form submission.
 * @param {Event} event - The submit event triggered by the form.
 * @param {Object} inputSet - The set of input fields to validate and process.
 */
function handleSubmit(event, inputSet) {
  event.preventDefault();
  const errorContainer = document.querySelector(".error-container");
  if (validateForm(inputSet)) {
    errorContainer.style.display = "none";
  } else {
    errorContainer.style.display = "block";
    errorContainer.textContent = "Please correct the marked fields.";
  }
}

/**
 * Initializes the blur validation for each input field.
 * @param {Object} inputSet - The set of input fields to add blur event listeners to.
 */
function initializeBlurValidation(inputSet) {
  Object.keys(inputSet).forEach((field) => {
    inputSet[field].addEventListener("blur", () =>
      validateField(field, inputSet)
    );
  });
}

/**
 * Resets form errors by removing error messages and resetting styles.
 * @param {Object} inputSet - The set of input fields to reset errors for.
 */
function resetFormErrors(inputSet) {
  Object.keys(inputSet).forEach((field) => {
    const input = inputSet[field];
    const errorMessage = document.getElementById(`${input.id}-error`);

    // Removes the red border
    input.style.border = "1px solid #ccc"; // Standard border or as desired

    // Removes the error message
    if (errorMessage) {
      errorMessage.textContent = "";
    }
  });
}

/**
 * Creates error message containers for each input field.
 * @param {Object} inputSet - The set of input fields to create error messages for.
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
 * Sets up the event listeners for form submission and validation.
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
