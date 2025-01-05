const BASE_URL = 'https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app';

function init() {
    fetchContactsData();
}


const overlayListeners = new Map();


function openOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    const overlaycontent = document.getElementById("overlay-content");
    overlay.style.display = "block"; // Sichtbar machen
    setTimeout(() => overlay.classList.add("show"), 0); // Animation starten
    
    const handleClickOutside = (event) => {
        if (!overlaycontent.contains(event.target)) {
            closeOverlay(overlayId);
            document.removeEventListener('click', overlayListeners.get(overlayId));
            overlayListeners.delete(overlayId);
        }
    };
    if (overlayListeners.has(overlayId)) {
        document.removeEventListener('click', overlayListeners.get(overlayId));
    }
    overlayListeners.set(overlayId, handleClickOutside);
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 0);
}



function resetForm() {
    document.getElementById('contactForm').reset();

    // Fehler-Container zurücksetzen
    const errorContainer = document.querySelector('.error-container');
    errorContainer.style.display = 'none';
    errorContainer.textContent = '';

    // Rote Rahmen entfernen
    const inputs = document.querySelectorAll('#contactForm input');
    inputs.forEach(input => input.style.border = '');
}

function closeOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    resetForm();
    resetFormErrors(inputs);
    resetFormErrors(editInputs);

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
            
        }
        const data = await response.json();
        const contactArray = Array.isArray(data) ? data : Object.keys(data).map(key => {
            return { ...data[key], id: key };
        });

        displayContacts(contactArray);
    } catch (error) {
       
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
        hideSecondOverlay();
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
    
    // Add the fly-in class to the overlay content
    overlayContent.classList.add('fly-in');

    contactOverlay.style.display = 'block'; 
    const rightContent = document.querySelector('.right-content');
    if (window.innerWidth <= 920) {
        rightContent.classList.add('show');
        rightContent.style.display = 'flex';  
    } else {
        rightContent.classList.remove('show');
        rightContent.style.display = '';  
    }
    overlayContent.addEventListener('animationend', () => {
        overlayContent.classList.remove('fly-in'); // Remove the class after animation
    });    
}

function createContactCardHTML(contact) {
    return `
    <div class="contact-details">
        <h3>${contact.name}</h3>
        <p>Email: ${contact.email}</p>
    </div>
    `;
}


function getColorForInitial(initial) {
    const colors = {
        A: '#FF5733', B: '#FFBD33', C: '#DBFF33', D: '#75FF33', E: '#33FF57', 
        F: '#33FFBD', G: '#3399FF', H: '#8A2BE2', I: '#5733FF', J: '#BD33FF', 
        K: '#FF33DB', L: '#FF3375', M: '#FF3333', N: '#FF6633', O: '#FF9933', 
        P: '#FFCC33', Q: '#FFFF33', R: '#99CC29', S: '#66CC99', T: '#66A3A3', 
        U: '#3399CC', V: '#33FF99', W: '#33FFCC', X: '#33FFFF', Y: '#33CCFF', 
        Z: '#3399FF'
    };
    return colors[initial] || '#333333'; 
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


function toggleDropdown() {
    const dropdown = document.getElementById("dropdown");
    dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}
    window.onclick = function (event) {
    if (
        !event.target.matches(".profilPic") &&
        !event.target.closest(".profilPic")
    ) {
    const dropdown = document.getElementById("dropdown");
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    }
    }
};


function createBadge(contactName) {
    const badge = createInitialsBadge(contactName, 'custom-badge');
    if (!badge) {
        return null;
    }
    return badge;
}


function prepareBadgeContainer() {
    const badgeContainer = document.getElementById('edit-badge-container');
    const imgContainer = document.getElementById('edit-img-container');

    if (!badgeContainer) {
        return null;
    }
    if (imgContainer) {
        imgContainer.style.display = 'none'; 
    }
    badgeContainer.style.backgroundColor = 'transparent'; 
    badgeContainer.innerHTML = ''; 
    return badgeContainer;
}


function insertBadgeIntoContainer(badge, badgeContainer) {
    try {
        badgeContainer.appendChild(badge); 
        badgeContainer.style.display = 'block'; 
    } catch (error) {
     
    }
}


function displayBadgeInContainer(contactName) {
    const badge = createBadge(contactName);
    if (!badge) return;

    const badgeContainer = prepareBadgeContainer();
    if (!badgeContainer) return;

    insertBadgeIntoContainer(badge, badgeContainer);
}


function generateInitials(name) {
    if (!name) return "??"; 
    const nameParts = name.trim().split(" "); 
    return nameParts.map(part => part.charAt(0).toUpperCase()).slice(0, 2).join(""); 
}


function loadUserDataFromSession() {
    const userData = sessionStorage.getItem("currentUser");
    if (!userData) {
        return null;
    }
    try {
        return JSON.parse(userData); 
    } catch (error) {
        return null;
    }
}


function insertInitialsIntoElement(initials, elementId) {
    const profileTextElement = document.getElementById(elementId);
    profileTextElement.innerHTML = initials; 
}


function setUserInitials() {
    const user = loadUserDataFromSession();
    if (!user || !user.name) return;

    const initials = generateInitials(user.name);
    insertInitialsIntoElement(initials, "profileText");
}


document.addEventListener("DOMContentLoaded", () => {
    const checkHeaderInterval = setInterval(() => {
        const profileTextElement = document.getElementById("profileText");
        if (profileTextElement) {
            clearInterval(checkHeaderInterval); 
            setUserInitials(); 
        }
    }, 100); 
});






