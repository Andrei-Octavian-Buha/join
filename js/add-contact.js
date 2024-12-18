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


const inputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone')
};

const patterns = {
    name: /.{3,}/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[0-9]{8,15}$/
};

const messages = {
    name: 'Der Name muss mindestens 3 Buchstaben lang sein. (Beispiel: "Max")',
    email: 'Bitte eine gültige E-Mail-Adresse eingeben. (Beispiel: "name@domain.de")',
    phone: 'Bitte eine gültige Telefonnummer (min. 8 Zahlen) eingeben. (Beispiel: "+49123456789")'
};

/**
 * 
 */
function createErrorMessages() {
    Object.keys(inputs).forEach(field => {
        if (!document.getElementById(`${field}-error`)) {
            const errorMessage = document.createElement('div');
            errorMessage.id = `${field}-error`;
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.style.marginTop = '5px';
            inputs[field].parentNode.appendChild(errorMessage);
        }
    });
}

/**
 * 
 * @param {string} field 
 * @returns {boolean} 
 */
function validateField(field) {
    const input = inputs[field];
    const isValid = patterns[field].test(input.value.trim());
    const errorMessage = document.getElementById(`${field}-error`);

    if (isValid) {
        input.style.border = '1px solid darkgreen';
        errorMessage.textContent = '';
    } else {
        input.style.border = '1px solid red';
        errorMessage.textContent = messages[field];
    }

    return isValid;
}

/**
 * 
 * @returns {boolean} 
 */
function validateForm() {
    let isFormValid = true;
    Object.keys(inputs).forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    return isFormValid;
}

/**
 * 
 * @param {Event} event 
 */
function handleSubmit(event) {
    event.preventDefault();
    const errorContainer = document.querySelector('.error-container');
    if (validateForm()) {
        errorContainer.style.display = 'none';
        console.log('Formular erfolgreich gesendet!');
    } else {
        errorContainer.style.display = 'block';
        errorContainer.textContent = 'Bitte korrigiere die markierten Felder.';
    }
}


function initializeBlurValidation() {
    Object.keys(inputs).forEach(field => {
        inputs[field].addEventListener('blur', () => validateField(field));
    });
}


document.addEventListener('DOMContentLoaded', () => {
    createErrorMessages();
    initializeBlurValidation();
    document.getElementById('contactForm').addEventListener('submit', handleSubmit);
});