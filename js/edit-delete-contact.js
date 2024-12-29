function showToastMessage(message) {
    const toast = document.getElementById('toast');

    toast.innerHTML = message;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.classList.add('show');
        toast.classList.remove('hide');
    }, 100);

    return toast;
}

function addConfirmationButtons(toast) {
    const confirmButton = document.createElement('button');
    const cancelButton = document.createElement('button');

    confirmButton.textContent = 'Löschen';
    cancelButton.textContent = 'Abbrechen';
    confirmButton.classList.add('toast-button');
    cancelButton.classList.add('toast-button');

    toast.appendChild(confirmButton);
    toast.appendChild(cancelButton);

    return { confirmButton, cancelButton };
}



async function deleteContactFromApi(contactId) {
    try {
        const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            
        }

        return true;
    } catch (error) {
        
    }
}


function showDeletionSuccessToast() {
    const toast = document.getElementById('toast');
    toast.innerHTML = 'Kontakt wurde erfolgreich gelöscht!';
    setTimeout(() => {
        toast.classList.add('show');
        toast.classList.remove('hide');
    }, 100);
}

function hideToast() {
    const toast = document.getElementById('toast');
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.style.display = 'none';
        }, 500);
    }, 1000);
}


function updateSecondOverlay() {
    const secondOverlay = document.getElementById('secondOverlay');
    const contactOverlay = document.getElementById('contact-overlay');

    contactOverlay.style.display = 'none';

    secondOverlay.style.display = 'block';
    
    secondOverlay.innerHTML = '<h3>Add a new Contact</h3>';
}


function hideSecondOverlay() {
    const secondOverlay = document.getElementById('secondOverlay');
    secondOverlay.style.display = 'none';
    
    secondOverlay.innerHTML = '';
}


function showConfirmationToast() {
    const toast = document.getElementById('toast');
    const confirmButton = document.createElement('button');
    const cancelButton = document.createElement('button');

    confirmButton.textContent = 'Löschen';
    cancelButton.textContent = 'Abbrechen';
    confirmButton.classList.add('toast-button');
    cancelButton.classList.add('toast-button');

    toast.innerHTML = 'Kontakt wirklich löschen?';
    toast.appendChild(confirmButton);
    toast.appendChild(cancelButton);

    toast.style.display = 'block';
    setTimeout(() => {
        toast.classList.add('show');
        toast.classList.remove('hide');
    }, 100);

    return { toast, confirmButton, cancelButton };
}


function handleUserConfirmation(confirmButton, cancelButton, contactId, toast) {
    return new Promise((resolve, reject) => {
        confirmButton.addEventListener('click', async () => {
            const isDeleted = await deleteContactFromApi(contactId);

            if (isDeleted) {
                showDeletionSuccessToast();
                setTimeout(() => hideToast(), 3000);
                fetchContactsData();
                updateSecondOverlay()
                resolve();
            } else {
            
            }
        });

        cancelButton.addEventListener('click', () => {
            toast.classList.add('hide');
            setTimeout(() => toast.style.display = 'none', 100);
            reject('Abgebrochen');
        });
    });
}


async function deleteContact(contactId) {
    try {
        const { toast, confirmButton, cancelButton } = showConfirmationToast();

        return await handleUserConfirmation(confirmButton, cancelButton, contactId, toast);
        
    } catch (error) {
    }
}


function editContact(contactId) {
    const editContactOverlay = document.getElementById('edit-contact-overlay');
    
    if (editContactOverlay) {
        editContactOverlay.style.display = 'block'; 
    } else {
     
    }
}


function showEditContactOverlay() {
    const editContactOverlay = document.getElementById('edit-contact-overlay');
    
    if (editContactOverlay) {
        editContactOverlay.style.display = 'block'; 
    } else {
    }
}


async function fetchAndFillContactData(contactId) {
    try {

        const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`);
        if (!response.ok) {
        }
        const contact = await response.json();
        document.getElementById('inputName').value = contact.name;
        document.getElementById('inputMail').value = contact.email;
        document.getElementById('inputPhone').value = contact.phone;

        const editContactOverlay = document.getElementById('edit-contact-overlay');
        if (editContactOverlay) {
            editContactOverlay.dataset.contactId = contactId;
        }

        displayBadgeInContainer(contact.name); 
    } catch (error) {
    }
}


function editContact(contactId, event) {
    event.stopPropagation(); // Verhindert, dass das Klick-Event nach oben propagiert
    const editContactOverlay = document.getElementById('edit-contact-overlay');
    editContactOverlay.style.display = 'block'; // Overlay anzeigen
}


async function updateContactOnServer(contactId, name, email, phone) {
    try {
        const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
            method: 'PUT', // PUT für Update
            body: JSON.stringify({ name, email, phone }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
        }
        const updatedContact = await response.json();
        return updatedContact;
    } catch (error) {
        throw error; 
    }
}


function updateContactOverlay(updatedContact) {
    closeOverlay('edit-contact-overlay');

    const contactOverlay = document.getElementById('contact-overlay');
    if (contactOverlay) {
        contactOverlay.querySelector('.contact-name').textContent = updatedContact.name;
        contactOverlay.querySelector('.contact-email').textContent = updatedContact.email;
        contactOverlay.querySelector('.contact-phone').textContent = '+49 ' + updatedContact.phone;
    }

    fetchContactsData(); 
}


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



function getFormData() {
    const name = document.getElementById('inputName').value.trim();
    const email = document.getElementById('inputMail').value.trim();
    const phone = document.getElementById('inputPhone').value.trim();

    return { name, email, phone };
}


function validateFormData(contactData) {
    return validateContactData(contactData); 
}


async function updateContact(contactId, name, email, phone) {
    return await updateContactOnServer(contactId, name, email, phone); 
}


function showToastMessage(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.style.display = 'none';
        }, 500);
    }, 3000);
}


async function handleFormSubmit(event) {
    event.preventDefault();

    const contactId = document.getElementById('edit-contact-overlay').dataset.contactId;
    const contactData = getFormData();

    if (!validateFormData(contactData)) return;

    try {
        const updatedContact = await updateContact(contactId, contactData.name, contactData.email, contactData.phone);
        updateContactOverlay(updatedContact); 

        showToastMessage('Kontakt erfolgreich aktualisiert!'); 
    } catch (error) {
    
    }
}

function handleClickOutsideOverlay(event) {
    const editContactOverlay = document.getElementById('edit-contact-overlay');
    
    if (!editContactOverlay || editContactOverlay.style.display !== 'block') {
        return; // Kein geöffnetes Overlay vorhanden
    }

    // Überprüfe, ob der Klick innerhalb des Overlays oder auf den Edit-Button war
    if (
        editContactOverlay.contains(event.target) || 
        event.target.closest('.edit-button-container')
    ) {
        return; // Klick innerhalb des Overlays oder auf den Edit-Button, nichts tun
    }

    closeOverlay('edit-contact-overlay');
}

document.addEventListener('click', handleClickOutsideOverlay);