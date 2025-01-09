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
 * Gets the color associated with a contact's initial.
 * @function
 * @param {string} initial - The initial character of the contact's name.
 * @returns {string} The hex color code for the initial.
 */
function getColorForInitial(initial) {
    const colors = {
    A: "#FF5733",
    B: "#FFBD33",
    C: "#DBFF33",
    D: "#75FF33",
    E: "#33FF57",
    F: "#33FFBD",
    G: "#3399FF",
    H: "#8A2BE2",
    I: "#5733FF",
    J: "#BD33FF",
    K: "#FF33DB",
    L: "#FF3375",
    M: "#FF3333",
    N: "#FF6633",
    O: "#FF9933",
    P: "#FFCC33",
    Q: "#FFFF33",
    R: "#99CC29",
    S: "#66CC99",
    T: "#66A3A3",
    U: "#3399CC",
    V: "#33FF99",
    W: "#33FFCC",
    X: "#33FFFF",
    Y: "#33CCFF",
    Z: "#3399FF",
    };
    return colors[initial] || "#333333";
}