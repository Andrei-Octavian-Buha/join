const BASE_URL = 'https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app';

function init() {
    fetchContactsData();
}

function openOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    overlay.style.display = "flex"; 
    overlay.classList.add("show");  
}

function closeOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    overlay.classList.remove("show");
    overlay.classList.add("hide"); 
    setTimeout(() => {
        overlay.style.display = "none"; 
        overlay.classList.remove("hide"); 
    }, 800); 
}


function closeContactOverlay() {
    const rightContent = document.querySelector('.right-content');
    rightContent.classList.remove('show');
    rightContent.style.display = ''; 
}


async function fetchContactsData() {
    try {
        const response = await fetch(`${BASE_URL}/contacts.json`);
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Kontaktdaten');
        }
        const data = await response.json();
        const contactArray = Array.isArray(data) ? data : Object.keys(data).map(key => {
            return { ...data[key], id: key };
        });

        displayContacts(contactArray);
    } catch (error) {
        console.error('Fehler beim Laden der Kontaktdaten:', error);
    }
}


function displayContacts(data) {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    const contactArray = Array.isArray(data) ? data : Object.values(data);

    const sortedContacts = sortContacts(contactArray);
    renderSortedContacts(contactList, sortedContacts);
}


function sortContacts(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}


function renderSortedContacts(contactList, sortedContacts) {
    let currentLetter = '';

    sortedContacts.forEach(contact => {
        console.log('Kontakt ID:', contact.id);

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


function addLetterHeader(contactList, letter) {
    const letterHeader = document.createElement('h4');
    letterHeader.classList.add('letter-header');
    letterHeader.textContent = letter;
    contactList.appendChild(letterHeader);
}


function addSilverline(contactList) {
    const silverline = document.createElement('div');
    silverline.classList.add('silverline');
    contactList.appendChild(silverline);
}


function createContactCard(contact) {
    const card = document.createElement('div');
    card.classList.add('contact-card'); 
    const initials = getInitials(contact.name);
    const badge = document.createElement('div');
    badge.classList.add('initials-badge');
    badge.textContent = initials;
    badge.style.backgroundColor = getColorForInitial(initials[0]);
    card.appendChild(badge);
    card.innerHTML += createContactCardHTML(contact);
    card.onclick = () => {
        setActiveContact(card); 
        handleCardClick(contact.id); 
    };
    return card;
}


function setActiveContact(element) {
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => {
        card.classList.remove('active');
    });

    element.classList.add('active');
}


function openContactOverlay(contactId, contactName, contactEmail, contactPhone) {
    const overlayContent = document.createElement('div');
    overlayContent.innerHTML = generateContactOverlayHTML(contactId, contactName, contactEmail, contactPhone);
    const contactOverlay = document.getElementById('contact-overlay');
    contactOverlay.innerHTML = '';  
    contactOverlay.appendChild(overlayContent);
    contactOverlay.style.display = 'block'; 

    const rightContent = document.querySelector('.right-content');
    if (window.innerWidth <= 920) {
        rightContent.classList.add('show');
        rightContent.style.display = 'flex';  
    } else {
        rightContent.classList.remove('show');
        rightContent.style.display = '';  
    }
}


async function handleCardClick(contactId) {
    console.log('Karte angeklickt, Kontakt-ID:', contactId);

    try {
        const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`);
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Kontaktdaten');
        }

        const contact = await response.json();

        if (contact) {
            openContactOverlay(contactId, contact.name, contact.email, contact.phone);
        } else {
            console.error('Kontakt nicht gefunden:', contactId);
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Kontaktdaten:', error);
    }
}


function createInitialsBadge(name, className = 'default-badge') {
    const initials = getInitials(name);
    const badge = document.createElement('div');
    badge.classList.add(className); 
    badge.textContent = initials;
    badge.style.backgroundColor = getColorForInitial(initials[0]);
    return badge;
}


function generateContactOverlayHTML(contactId, contactName, contactEmail, contactPhone) {
    return `
        <div class="second-overlay-content">
                <div class="badge-and-name">
                    <div class="badge">
                        ${createInitialsBadge(contactName, 'custom-badge').outerHTML}
                        <h1 class="contact-name">${contactName}</h1>
                    </div>

                    <div class="detail">
                        <div class="detail-content">
                            <div class="edit-container">
                                <div class="edit-button-container">
                                    <img src="assets/img/edit-pencil.png" alt="Edit" class="edit-image" />
                                    <p class="edit-label" onclick="editContact('${contactId}')">Edit</p>
                                </div>
                                <div class="delete-button-container">
                                    <img src="assets/img/trash-can-icon..png" alt="Delete" class="delete-image" />
                                    <p class="delete-label" onclick="deleteContact('${contactId}')">Delete</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            <div class="sub-content">
                <h3 class="sub-info">Contact Information</h3>
                <div class="email">
                    <p class="contact-email-label">Email:</p>
                    <p class="contact-email">${contactEmail}</p>
                </div>
                <div class="phone">    
                    <p class="contact-phone-label">Telefon: </p>
                    <p class="contact-phone">+49 ${contactPhone}</p>
                </div> 
                    <div class="three-points" onclick="toggleMenu()">
                        <img src="assets/img/threePoints.png" alt="Menu" class="small-img">
                    </div>
                    <div class="menu hidden-menu">
                        <div class="edit-button-container hidden">
                            <img src="assets/img/edit-pencil.png" alt="Edit" class="edit-image hidden" />
                            <p class="edit-label" onclick="editContact('${contactId}')">Edit</p>
                        </div>
                        <div class="delete-button-container hidden">
                            <img src="assets/img/trash-can-icon..png" alt="Delete" class="delete-image" />
                            <p class="delete-label" onclick="deleteContact('${contactId}')">Delete</p>
                        </div>
                    </div>   
            </div>
        </div>
    `;
}


function getInitials(name) {
    const nameParts = name.split(" ");
    return (nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : '')).toUpperCase();
}


function createContactCardHTML(contact) {
    return `
    <div class="contact-details">
        <h3>${contact.name}</h3>
        <p>Email: ${contact.email}</p>
    </div>
    `;
}


async function addContact(event) {
    event.preventDefault();
    const contact = gatherContactData();
    try {
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


function gatherContactData() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    return {
        name: name,
        email: email,
        phone: phone
    };
}


async function sendContactData(contact) {
    const response = await fetch(`${BASE_URL}/contacts.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    return response;
}


function handleSuccess() {
    console.log('Kontakt erfolgreich hinzugefügt!');
    document.getElementById('contactForm').reset(); 
    closeOverlay('overlay'); 
    fetchContactsData(); 
}


function handleError(errorMessage) {
    console.error('Fehler beim Hinzufügen des Kontakts:', errorMessage);
}

function handleNetworkError(error) {
    console.error('Netzwerkfehler:', error);
}



function getColorForInitial(initial) {
    const colors = {
        A: '#FF5733', B: '#FFBD33', C: '#DBFF33', D: '#75FF33', E: '#33FF57', 
        F: '#33FFBD', G: '#33DBFF', H: '#3375FF', I: '#5733FF', J: '#BD33FF', 
        K: '#FF33DB', L: '#FF3375', M: '#FF3333', N: '#FF6633', O: '#FF9933', 
        P: '#FFCC33', Q: '#FFFF33', R: '#CCFF33', S: '#99FF33', T: '#66FF33', 
        U: '#33FF66', V: '#33FF99', W: '#33FFCC', X: '#33FFFF', Y: '#33CCFF', 
        Z: '#3399FF'
    };
    return colors[initial] || '#333333'; 
}


async function deleteContact(contactId) {
    const confirmDelete = confirm('Möchten Sie diesen Kontakt wirklich löschen?');
    if (!confirmDelete) {
        console.log('Löschen abgebrochen');
        return; 
    }
    try {
        const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Fehler beim Löschen des Kontakts');
        }
        alert('Der Kontakt wurde erfolgreich gelöscht.');
        const contactOverlay = document.getElementById('contact-overlay');
        contactOverlay.classList.remove('visible');
        contactOverlay.innerHTML = '';
        fetchContactsData();
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error);
        alert('Es ist ein Fehler beim Löschen des Kontakts aufgetreten.');
    }
}


function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('visible');

    document.addEventListener('click', function handleOutsideClick(event) {
        if (!menu.contains(event.target) && !event.target.closest('.three-points')) {
            menu.classList.remove('visible');
            document.removeEventListener('click', handleOutsideClick);
        }
    });
}


function editContact(contactId) {
    const editContactOverlay = document.getElementById('edit-contact-overlay');
    
    if (editContactOverlay) {
        editContactOverlay.style.display = 'block'; 
    } else {
        console.error('Element mit der ID "edit-contact-overlay" wurde nicht gefunden.');
    }
}


function showEditContactOverlay() {
    const editContactOverlay = document.getElementById('edit-contact-overlay');
    
    if (editContactOverlay) {
        console.log('Overlay gefunden, wird angezeigt.');
        editContactOverlay.style.display = 'block'; 
    } else {
        console.error('Element mit der ID "edit-contact-overlay" wurde nicht gefunden.');
    }
}


async function fetchAndFillContactData(contactId) {
    try {
        console.log(`Abrufe der Kontaktdaten für Kontakt-ID: ${contactId}`);
        const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`);
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Kontaktdaten');
        }
        const contact = await response.json();
        console.log('Kontaktdaten erfolgreich abgerufen:', contact);

        document.getElementById('inputName').value = contact.name;
        document.getElementById('inputMail').value = contact.email;
        document.getElementById('inputPhone').value = contact.phone;

        const editContactOverlay = document.getElementById('edit-contact-overlay');
        if (editContactOverlay) {
            editContactOverlay.dataset.contactId = contactId;
        }
        console.log('Formular mit den Kontaktdaten gefüllt.');
    } catch (error) {
        console.error('Fehler beim Abrufen der Kontaktdaten:', error);
    }
}


async function editContact(contactId) {
    showEditContactOverlay(); 
    await fetchAndFillContactData(contactId); 
}


async function updateContactOnServer(contactId, name, email, phone) {
    try {
        const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
            method: 'PUT', // PUT für Update
            body: JSON.stringify({ name, email, phone }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Fehler beim Speichern der Kontaktdaten');
        }

        const updatedContact = await response.json();
        console.log('Kontakt erfolgreich aktualisiert:', updatedContact);
        return updatedContact;

    } catch (error) {
        console.error('Fehler beim Aktualisieren des Kontakts:', error);
        throw error; 
    }
}


function updateContactOverlay(updatedContact) {
    closeOverlay('edit-contact-overlay');
    alert('Kontakt wurde erfolgreich aktualisiert.');

    const contactOverlay = document.getElementById('contact-overlay');
    if (contactOverlay) {
        contactOverlay.querySelector('.contact-name').textContent = updatedContact.name;
        contactOverlay.querySelector('.contact-email').textContent = updatedContact.email;
        contactOverlay.querySelector('.contact-phone').textContent = '+49 ' + updatedContact.phone;
    }

    fetchContactsData(); 
}


async function handleFormSubmit(event) {
    event.preventDefault();

    const contactId = document.getElementById('edit-contact-overlay').dataset.contactId;
    const name = document.getElementById('inputName').value;
    const email = document.getElementById('inputMail').value;
    const phone = document.getElementById('inputPhone').value;

    try {
        const updatedContact = await updateContactOnServer(contactId, name, email, phone);

        updateContactOverlay(updatedContact);

    } catch (error) {
        console.error('Fehler beim Aktualisieren des Kontakts:', error);
    }
}
