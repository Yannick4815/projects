"use strict";
document.querySelectorAll("span").forEach(el => {
    el.addEventListener("click", function () {
        toggleForm(el);
    });
});
document.getElementById("submit").addEventListener("click", function () {
    let error = document.getElementById("error");
    if (document.getElementById("vornameInput").style.display != "none") {
        if (!checkFor(document.getElementById("vornameInput"), [""])) {
            error.innerText = "Alle Felder ausfüllen";
            error.style.display = "block";
        }
        else if (!checkFor(document.getElementById("emailInput"), [""])) {
            error.innerText = "Alle Felder ausfüllen";
            error.style.display = "block";
        }
        else if (!checkFor(document.getElementById("emailInput"), ["contains", "@", "."])) {
            error.innerText = "Falsches Email-Format";
            error.style.display = "block";
        }
        else if (!checkFor(document.getElementById("passwordInput"), [""])) {
            error.innerText = "Alle Felder ausfüllen";
            error.style.display = "block";
        }
        else {
            sendData();
        }
    }
    else {
        if (!checkFor(document.getElementById("emailInput"), [""])) {
            error.innerText = "Alle Felder ausfüllen";
            error.style.display = "block";
        }
        else if (!checkFor(document.getElementById("emailInput"), ["contains", "@", "."])) {
            error.innerText = "Falsches Email-Format";
            error.style.display = "block";
        }
        else if (!checkFor(document.getElementById("passwordInput"), [""])) {
            error.innerText = "Alle Felder ausfüllen";
            error.style.display = "block";
        }
        else {
            sendData();
        }
    }
});
async function sendData() {
    let h3 = document.getElementById("error");
    let respJSON = await connectToServer("login");
    if (respJSON.status == "error") {
        h3.style.display = "block";
        h3.innerText = respJSON.message;
    }
    else {
        localStorage.owner = respJSON.message;
        console.log(localStorage.owner);
        window.location.href = "index.html";
    }
    //console.log(await response.text());
}
function toggleForm(_activeElement) {
    let vornameInput = document.getElementById("vornameInput");
    let requestInput = document.getElementById("requestInput");
    if (document.forms[0].style.display == "none") { //zum testen, ob form augeblenet wurde, zb nach registrierung
        document.forms[0].style.display = "block";
        let h3 = document.getElementById("serverResponse");
        h3.innerText = "";
    }
    if (_activeElement.id == "login") {
        _activeElement.classList.add("active");
        let reg = document.getElementById("registrieren");
        reg.classList.remove("active");
        vornameInput.style.display = "none";
        document.getElementById("nameLabel").style.display = "none";
        requestInput.setAttribute("value", "login");
    }
    else {
        _activeElement.classList.add("active");
        let reg = document.getElementById("login");
        reg.classList.remove("active");
        vornameInput.style.display = "initial";
        document.getElementById("nameLabel").style.display = "block";
        requestInput.setAttribute("value", "register");
    }
}
//# sourceMappingURL=login.js.map