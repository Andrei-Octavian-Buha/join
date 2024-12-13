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


function gatherContactData() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    return { name, email, phone };
}


function validateContactData(contact) {
    const { name, email, phone } = contact;
    if (!name || !email || !phone) {
        alert('Bitte alle Felder ausfüllen.');
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
    const toast = document.getElementById('toast');

    toast.innerHTML = 'Kontakt erfolgreich gespeichert!';
    toast.style.display = 'block';
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    document.getElementById('contactForm').reset();
    closeOverlay('overlay');
    fetchContactsData();

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.style.display = 'none';
        }, 500);
    }, 3000);
}


function handleError(errorText) {
    console.error(`Fehler beim Hinzufügen des Kontakts: ${errorText}`);
    alert('Fehler beim Hinzufügen des Kontakts. Bitte erneut versuchen.');
}


function handleNetworkError(error) {
    console.error('Netzwerkfehler:', error);
    alert('Es ist ein Netzwerkfehler aufgetreten. Bitte überprüfen Sie Ihre Verbindung.');
}