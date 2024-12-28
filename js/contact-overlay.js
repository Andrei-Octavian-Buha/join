

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
                    <div class="open-overlay" class="edit-button-container hidden">
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


function displayContactOverlay(contactId, contactName, contactEmail, contactPhone) {
    const overlayContainer = document.getElementById('overlay-container');
    const overlayHTML = generateContactOverlayHTML(contactId, contactName, contactEmail, contactPhone);
    
    if (overlayContainer) {
        overlayContainer.innerHTML = overlayHTML;
    } else {
      
    }
}


async function handleCardClick(contactId) {
    try {
        const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`);
        if (!response.ok) {
          
        }
        const contact = await response.json();
        if (contact) {
            openContactOverlay(contactId, contact.name, contact.email, contact.phone);
        } else {
            
        }
    } catch (error) {
      
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


function getInitials(name) {
    const nameParts = name.split(" ");
    return (nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : '')).toUpperCase();
}