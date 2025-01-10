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

