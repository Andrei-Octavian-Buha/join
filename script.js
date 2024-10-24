async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
      const element = includeElements[i];
      file = element.getAttribute("w3-include-html"); // "includes/header.html"
      let resp = await fetch(file);
      if (resp.ok) {
        element.innerHTML = await resp.text();
      } else {
        element.innerHTML = "Page not found";
      }
    }
  }

  function test(){
    let ov = document.getElementById('overlayId');
    let logo = document.getElementById('imgHeader1');
    logo.classList.add('logo2sec');
    setTimeout(() => {
      logo.classList.remove('logo2sec');
      ov.classList.add('dNone');
    }, 2000);
  }