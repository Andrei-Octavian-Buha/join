/**
 * Base URL for the Firebase Realtime Database.
 * @constant {string}
 */
const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Initializes the application by fetching the contact data.
 * @function
 */
function init() {
  fetchContactsData();
}

/**
 * A map to track event listeners for overlays.
 * @type {Map<string, Function>}
 */
const overlayListeners = new Map();

/**
 * Opens an overlay by its ID and sets up a click event listener to close it.
 * @function
 * @param {string} overlayId - The ID of the overlay to open.
 */
function openOverlay(overlayId) {
  const overlay = document.getElementById(overlayId);
  const overlaycontent = document.getElementById("overlay-content");
  overlay.style.display = "block"; // Sichtbar machen
  setTimeout(() => overlay.classList.add("show"), 0); // Animation starten
  const handleClickOutside = (event) => {
    if (!overlaycontent.contains(event.target)) {
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
 * Resets the contact form and clears any errors.
 * @function
 */
function resetForm() {
  document.getElementById("contactForm").reset();
  const errorContainer = document.querySelector(".error-container");
  errorContainer.style.display = "none";
  errorContainer.textContent = "";
  const inputs = document.querySelectorAll("#contactForm input");
  inputs.forEach((input) => (input.style.border = ""));
}

/**
 * Closes an overlay and resets the form and its errors.
 * @function
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
 * Closes the contact overlay.
 * @function
 */
function closeContactOverlay() {
  const rightContent = document.querySelector(".right-content");
  rightContent.classList.remove("show");
  rightContent.style.display = "";
}

/**
 * Fetches the contact data from the Firebase database.
 * @async
 * @function
 */
async function fetchContactsData() {
  try {
    const response = await fetch(`${BASE_URL}/contacts.json`);
    if (!response.ok) {
    }
    const data = await response.json();
    const contactArray = Array.isArray(data)
      ? data
      : Object.keys(data).map((key) => {
          return { ...data[key], id: key };
        });
    displayContacts(contactArray);
  } catch (error) {}
}

/**
 * Displays the contact data in the UI.
 * @function
 * @param {Array} data - The array of contacts to display.
 */
function displayContacts(data) {
  const contactList = document.getElementById("contactList");
  contactList.innerHTML = "";
  const contactArray = Array.isArray(data) ? data : Object.values(data);
  const sortedContacts = sortContacts(contactArray);
  renderSortedContacts(contactList, sortedContacts);
}

/**
 * Sorts the contacts alphabetically by their names.
 * @function
 * @param {Array} contacts - The array of contacts to sort.
 * @returns {Array} The sorted contacts.
 */
function sortContacts(contacts) {
  return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Renders the sorted contacts list in the UI.
 * @function
 * @param {Element} contactList - The DOM element to append the contact cards to.
 * @param {Array} sortedContacts - The sorted contacts to render.
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
 * Adds a letter header to the contact list.
 * @function
 * @param {Element} contactList - The DOM element to append the header to.
 * @param {string} letter - The letter to display as the header.
 */
function addLetterHeader(contactList, letter) {
  const letterHeader = document.createElement("h4");
  letterHeader.classList.add("letter-header");
  letterHeader.textContent = letter;
  contactList.appendChild(letterHeader);
}

/**
 * Adds a silver line separator to the contact list.
 * @function
 * @param {Element} contactList - The DOM element to append the silver line to.
 */
function addSilverline(contactList) {
  const silverline = document.createElement("div");
  silverline.classList.add("silverline");
  contactList.appendChild(silverline);
}

/**
 * Creates a contact card element for the contact.
 * @function
 * @param {Object} contact - The contact data.
 * @returns {Element} The contact card element.
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
 * Sets a contact card as the active card (highlighted).
 * @function
 * @param {Element} element - The contact card element to mark as active.
 */
function setActiveContact(element) {
  const contactCards = document.querySelectorAll(".contact-card");
  contactCards.forEach((card) => {
    card.classList.remove("active");
  });

  element.classList.add("active");
}

/**
 * Opens the contact overlay with the contact's details.
 * @function
 * @param {string} contactId - The ID of the contact.
 * @param {string} contactName - The name of the contact.
 * @param {string} contactEmail - The email of the contact.
 * @param {string} contactPhone - The phone number of the contact.
 */
function openContactOverlay(
  contactId,
  contactName,
  contactEmail,
  contactPhone
) {
  const overlayContent = createOverlayContent(
    contactId,
    contactName,
    contactEmail,
    contactPhone
  );
  const contactOverlay = document.getElementById("contact-overlay");
  contactOverlay.innerHTML = "";
  contactOverlay.appendChild(overlayContent);
  showOverlayWithAnimation(overlayContent, contactOverlay);
  adjustRightContentDisplay();
}

/**
 * Creates the content for the contact overlay.
 * @function
 * @param {string} contactId - The ID of the contact.
 * @param {string} contactName - The name of the contact.
 * @param {string} contactEmail - The email of the contact.
 * @param {string} contactPhone - The phone number of the contact.
 * @returns {Element} The content element for the contact overlay.
 */
function createOverlayContent(
  contactId,
  contactName,
  contactEmail,
  contactPhone
) {
  const content = document.createElement("div");
  content.innerHTML = generateContactOverlayHTML(
    contactId,
    contactName,
    contactEmail,
    contactPhone
  );
  content.classList.add("fly-in");
  return content;
}

/**
 * Displays the contact overlay with an animation.
 * @function
 * @param {Element} overlayContent - The content to display inside the overlay.
 * @param {Element} contactOverlay - The overlay element.
 */
function showOverlayWithAnimation(overlayContent, contactOverlay) {
  contactOverlay.style.display = "block";
  overlayContent.addEventListener("animationend", () => {
    overlayContent.classList.remove("fly-in");
  });
}

/**
 * Creates the HTML structure for the contact card.
 * @function
 * @param {Object} contact - The contact data.
 * @returns {string} The HTML structure for the contact card.
 */
function createContactCardHTML(contact) {
  return `
    <div class="contact-details">
        <h3>${contact.name}</h3>
        <p>Email: ${contact.email}</p>
    </div>
    `;
}

/**
 * Creates a badge for the contact based on their name.
 * @function
 * @param {string} contactName - The name of the contact.
 * @returns {Element|null} The badge element or null if creation failed.
 */
function createBadge(contactName) {
  const badge = createInitialsBadge(contactName, "custom-badge");
  if (!badge) {
    return null;
  }
  return badge;
}

/**
 * Inserts the badge into the specified container.
 * @function
 * @param {Element} badge - The badge element to insert.
 * @param {Element} badgeContainer - The container element to insert the badge into.
 */
function insertBadgeIntoContainer(badge, badgeContainer) {
  try {
    badgeContainer.appendChild(badge);
    badgeContainer.style.display = "block";
  } catch (error) {}
}

/**
 * Displays the badge for the contact in the container.
 * @function
 * @param {string} contactName - The name of the contact.
 */
function displayBadgeInContainer(contactName) {
  const badge = createBadge(contactName);
  if (!badge) return;

  const badgeContainer = prepareBadgeContainer();
  if (!badgeContainer) return;

  insertBadgeIntoContainer(badge, badgeContainer);
}

/**
 * Generates the initials from a contact's name.
 * @function
 * @param {string} name - The name of the contact.
 * @returns {string} The initials of the contact.
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
 * Loads the user data from the session storage.
 * @function
 * @returns {Object|null} The user data object or null if not found or invalid.
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
 * Inserts the user's initials into the specified element.
 * @function
 * @param {string} initials - The user's initials.
 * @param {string} elementId - The ID of the element to insert the initials into.
 */
function insertInitialsIntoElement(initials, elementId) {
  const profileTextElement = document.getElementById(elementId);
  profileTextElement.innerHTML = initials;
}

/**
 * Event listener that runs when the DOM is loaded.
 * @function
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
