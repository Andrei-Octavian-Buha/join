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

const editInputs = {
    name: document.getElementById('inputName'),
    email: document.getElementById('inputMail'),
    phone: document.getElementById('inputPhone')
};

const patterns = {
    name: /^[a-zA-ZäöüÄÖÜß\s-]{3,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[0-9]{8,15}$/
};

const messages = {
    name: 'Bitte mindestens 3 Buchstaben. Leerzeichen / Bindestriche sind möglich (Beispiel: "Max", "Anna Maria", "Müller-Schmidt")',
    email: 'Bitte eine gültige E-Mail-Adresse eingeben. (Beispiel: "name@domain.de")',
    phone: 'Bitte eine gültige Telefonnummer (min. 8 Zahlen) eingeben. (Beispiel: "+49123456789")'
};

/**
 * 
 * @param {Object} inputSet 
 */
function createErrorMessages(inputSet) {
    Object.keys(inputSet).forEach(field => {
        const input = inputSet[field];
        if (!document.getElementById(`${input.id}-error`)) {
            const errorMessage = document.createElement('div');
            errorMessage.id = `${input.id}-error`;
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.style.marginTop = '5px';
            errorMessage.style.textAlign = 'center'; 
            input.parentNode.appendChild(errorMessage);
        }
    });
}

/**
 * 
 * @param {string} field 
 * @param {Object} inputSet 
 * @returns {boolean}
 */
function validateField(field, inputSet) {
    const input = inputSet[field];
    const isValid = patterns[field].test(input.value.trim());
    const errorMessage = document.getElementById(`${input.id}-error`);

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
 * @param {Object} inputSet 
 * @returns {boolean}
 */
function validateForm(inputSet) {
    let isFormValid = true;
    Object.keys(inputSet).forEach(field => {
        if (!validateField(field, inputSet)) {
            isFormValid = false;
        }
    });
    return isFormValid;
}

/**
 * 
 * @param {Event} event 
 * @param {Object} inputSet 
 */
function handleSubmit(event, inputSet) {
    event.preventDefault();
    const errorContainer = document.querySelector('.error-container');
    if (validateForm(inputSet)) {
        errorContainer.style.display = 'none';
    } else {
        errorContainer.style.display = 'block';
        errorContainer.textContent = 'Bitte korrigiere die markierten Felder.';
    }
}

/**
 * 
 * @param {Object} inputSet 
 */
function initializeBlurValidation(inputSet) {
    Object.keys(inputSet).forEach(field => {
        inputSet[field].addEventListener('blur', () => validateField(field, inputSet));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    
    createErrorMessages(inputs);
    createErrorMessages(editInputs);

    
    initializeBlurValidation(inputs);
    initializeBlurValidation(editInputs);

    
    document.getElementById('contactForm').addEventListener('submit', (event) => handleSubmit(event, inputs));
    document.getElementById('editContactForm').addEventListener('submit', (event) => handleSubmit(event, editInputs));
});


function resetFormErrors(inputSet) {
    Object.keys(inputSet).forEach(field => {
        const input = inputSet[field];
        const errorMessage = document.getElementById(`${input.id}-error`);
        
        input.style.border = '1px solid #ccc';  

        if (errorMessage) {
            errorMessage.textContent = '';
        }
    });
}