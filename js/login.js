const BASE_URL =
  "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app";

function addEvent(){
    let signUp = document.getElementById("loginToSignUp");
    signUp.addEventListener("click", ()=>{
        window.location.href = "register.html";
    })
}

function test() {
    const overlay = document.getElementById('overlayId');
    const logo = document.getElementById('imgHeader1');
    const animatedLogo = setupAnimatedLogo(logo);

    applyOverlayColor(overlay);
    animateLogoToTarget(animatedLogo, logo.getBoundingClientRect());

    setTimeout(() => finalizeAnimation(animatedLogo, overlay), 2000);
}


function setupAnimatedLogo(logo) {
    const animatedLogo = logo.cloneNode(true);
    animatedLogo.classList.add('logoCentered'); 
    document.body.appendChild(animatedLogo);
    return animatedLogo;
}


function applyOverlayColor(overlay) {
    if (window.innerWidth < 770) {
        overlay.style.backgroundColor = '#2A3647'; 
    } else {
        overlay.style.backgroundColor = '#ffffff'; 
    }
    overlay.classList.remove('dNone');
}


function animateLogoToTarget(animatedLogo, target) {
    setTimeout(() => {
        animatedLogo.style.top = `${target.top}px`;
        animatedLogo.style.left = `${target.left}px`;
        animatedLogo.style.transform = 'translate(0, 0)';
        animatedLogo.style.width = `${target.width}px`;
        animatedLogo.classList.add('logoMoved'); 
    }, 100); 
}


function finalizeAnimation(animatedLogo, overlay) {
    animatedLogo.remove();
    overlay.classList.add('dNone');
}