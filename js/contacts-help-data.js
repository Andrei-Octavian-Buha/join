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

