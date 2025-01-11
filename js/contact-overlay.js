/**
 * Displays the contact overlay with the specified contact details.
 *
 * @param {string} contactId - The unique identifier of the contact.
 * @param {string} contactName - The name of the contact.
 * @param {string} contactEmail - The email address of the contact.
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
  }
}

/**
 * Handles the click event on a contact card, fetching contact details from an API.
 *
 * @param {string} contactId - The unique identifier of the contact.
 */
async function handleCardClick(contactId) {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`);
    if (!response.ok) {
    }
    const contact = await response.json();
    if (contact) {
      openContactOverlay(contactId, contact.name, contact.email, contact.phone);
    } else {
    }
  } catch (error) {}
}

/**
 * Creates a badge element displaying the initials of the contact's name.
 *
 * @param {string} name - The name of the contact.
 * @param {string} [className='default-badge'] - The CSS class to apply to the badge.
 * @returns {HTMLElement} The badge element.
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
 * Extracts the initials from a contact's name.
 *
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials of the contact's name.
 */
function getInitials(name) {
  const nameParts = name.split(" ");
  return (
    nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : "")
  ).toUpperCase();
}
