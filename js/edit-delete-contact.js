function showToastMessage(message, isConfirmation = false) {
    const toast = document.getElementById('toast');
    const confirmButton = document.createElement('button');
    const cancelButton = document.createElement('button');

    confirmButton.textContent = 'Löschen';
    cancelButton.textContent = 'Abbrechen';
    confirmButton.classList.add('toast-button');
    cancelButton.classList.add('toast-button');

    toast.innerHTML = message;
    
    if (isConfirmation) {
        toast.appendChild(confirmButton);
        toast.appendChild(cancelButton);
    }

    toast.style.display = 'block';
    setTimeout(() => {
        toast.classList.add('show');
        toast.classList.remove('hide');
    }, 100);

    return { toast, confirmButton, cancelButton };
}


async function deleteContactFromApi(contactId) {
    try {
        const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Fehler beim Löschen des Kontakts');
        }

        return true;
    } catch (error) {
        throw new Error('Fehler beim Löschen des Kontakts');
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


function reloadPageAfterDelay() {
    setTimeout(() => {
        location.reload();
    }, 1000); // Seite nach 1 Sekunde neu laden
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


async function deleteContactFromApi(contactId) {
    try {
        const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Fehler beim Löschen des Kontakts');
        }

        return true; // Erfolgreiches Löschen
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error);
        return false; // Fehler beim Löschen
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
    }, 3000); // Verzögerung von 3 Sekunden vor dem Ausblenden
}


function reloadPageAfterDelay() {
    setTimeout(() => {
        location.reload();
    }, 1000); // Seite nach 1 Sekunde neu laden
}


function handleUserConfirmation(confirmButton, cancelButton, contactId, toast) {
    return new Promise((resolve, reject) => {
        confirmButton.addEventListener('click', async () => {
            const isDeleted = await deleteContactFromApi(contactId);

            if (isDeleted) {
                showDeletionSuccessToast();
                setTimeout(() => hideToast(), 3000);
                reloadPageAfterDelay();
                resolve();
            } else {
                reject('Fehler beim Löschen');
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
        // Zeige den Toast zur Bestätigung an
        const { toast, confirmButton, cancelButton } = showConfirmationToast();

        // Bestätigung und Abbruch behandeln
        return await handleUserConfirmation(confirmButton, cancelButton, contactId, toast);
        
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error);
    }
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

        displayBadgeInContainer(contact.name); 
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

    if (!name || name.trim().length === 0) {
        alert('Bitte einen gültigen Namen eingeben.');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Bitte eine gültige E-Mail-Adresse eingeben.');
        return false;
    }

    const phoneRegex = /^\+?[0-9]{8,15}$/;
    if (!phoneRegex.test(phone)) {
        alert('Bitte eine gültige Telefonnummer eingeben (8-15 Ziffern).');
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
        console.error('Fehler beim Aktualisieren des Kontakts:', error);
        alert('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
    }
}
