"use strict";
document.getElementById("closePopUp1").addEventListener("click", function () {
    toggleClass(document.getElementById("editDiv"), "display");
});
document.getElementById("closePopUp2").addEventListener("click", function () {
    toggleClass(document.getElementById("addTabDiv"), "display");
});
function toggleClass(_el, _className) {
    if (_el.classList.contains(_className)) {
        _el.classList.remove(_className);
    }
    else {
        _el.classList.add(_className);
    }
}
async function deleteList(_id) {
    return await connectToServer("requestType=deleteList&list=" + _id);
}
async function deleteItem(_id) {
    return await connectToServer("requestType=delete&item=" + _id);
}
async function checkItem(_id) {
    return await connectToServer("requestType=check&item=" + _id);
}
async function editItem(_id) {
    return await connectToServer("edit");
}
document.getElementById("add").addEventListener("click", async function () {
    document.getElementById("name").style.borderBottomColor = "#333";
    document.getElementById("formDateInput").style.borderBottomColor = "#333";
    if (!checkFor(document.getElementById("name"), [""])) {
        document.getElementById("name").style.borderBottomColor = "var(--error-red)";
    }
    else if (!checkFor(document.getElementById("formDateInput"), ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."])) {
        document.getElementById("calendar1").shadowRoot.querySelector("input").style.borderBottomColor = "var(--error-red)";
    }
    else if (!checkFor(document.getElementById("formDateInput"), ["length", "8"])) {
        document.getElementById("calendar1").shadowRoot.querySelector("input").style.borderBottomColor = "var(--error-red)";
    }
    else {
        await connectToServer("insert");
        window.location.reload();
    }
});
let projectsArr = [];
let prDiv = document.getElementById("projects");
async function addList(_id) {
    //console.log("Projekt " + _id);
    let h2 = document.createElement("h2");
    let span = document.createElement("span");
    let resp = await connectToServer("requestType=getListName&id=" + _id);
    h2.innerText = resp.message;
    h2.setAttribute("id", _id);
    h2.setAttribute("class", "tab");
    span.setAttribute("class", "material-icons");
    span.classList.add("remove");
    span.innerText = "clear";
    h2.appendChild(span);
    prDiv.appendChild(h2);
    return true;
}
async function getAllLists() {
    let resp = await connectToServer("requestType=getAllLists&owner=" + owner._id);
    return JSON.parse(resp.message);
}
async function fillSite(_items) {
    let relationArr = []; /*["dateRe", "_id", "dateRe", "_id"]*/
    let dateArr = [];
    let dateArrSorted = [];
    _items.forEach(item => {
        let date = item.date;
        let start = date.slice(0, 2);
        let mid = date.slice(3, 5);
        let end = date.slice(6, 8);
        let dateReverse = end + mid + start;
        //console.log(start + " + " + mid + " + " + end);
        dateArr.push(Number(dateReverse));
        relationArr.push(dateReverse, item._id);
    });
    let span = document.createElement("span");
    span.innerText = "add";
    span.setAttribute("class", "material-icons");
    span.setAttribute("id", "addList");
    prDiv.appendChild(span);
    dateArrSorted = dateArr.sort(function (a, b) { return a - b; });
    //console.log(dateArr);
    dateArrSorted.forEach(date => {
        let id = relationArr[relationArr.indexOf((String(date))) + 1];
        let item;
        //console.log(id);
        console.log(relationArr.indexOf(String(date)));
        _items.forEach(el => {
            if (el._id == id) {
                item = el;
            }
        });
        //console.log(item);
        let h4 = document.createElement("h4");
        let spanDate = document.createElement("span");
        let spanEdit = document.createElement("span");
        let spanCheck = document.createElement("span");
        let spanDel = document.createElement("span");
        let spanText = document.createElement("span");
        spanDel.setAttribute("class", "delete");
        spanDel.classList.add("material-icons");
        spanEdit.setAttribute("class", "create");
        spanEdit.classList.add("material-icons");
        spanCheck.setAttribute("class", "check");
        spanCheck.classList.add("material-icons");
        spanDate.innerText = item.date;
        spanDel.innerText = "clear";
        spanEdit.innerText = "create";
        spanCheck.innerText = "done";
        spanText.innerText = item.name;
        h4.setAttribute("id", item._id);
        if (item.status == 1) {
            h4.appendChild(spanDate);
            h4.appendChild(spanText);
            h4.appendChild(spanDel);
            h4.appendChild(spanCheck);
            h4.appendChild(spanEdit);
            document.getElementById("list").appendChild(h4);
        }
        else if (item.status == 2) {
            h4.appendChild(spanDate);
            h4.appendChild(spanText);
            h4.appendChild(spanDel);
            document.getElementById("listDone").appendChild(h4);
        }
        else {
        }
        relationArr.splice(relationArr.indexOf((String(date))) + 1, 1);
        relationArr.splice(relationArr.indexOf((String(date))), 1);
    });
    calc();
}
function calc() {
    let list = document.getElementById("list");
    let listDone = document.getElementById("listDone");
    let statusBar = document.getElementById("status");
    let statusText = document.getElementById("statusText");
    let done = listDone.querySelectorAll("h4").length;
    let pending = list.querySelectorAll("h4").length;
    let donePercentage;
    if (done > 0 || pending > 0) {
        donePercentage = listDone.querySelectorAll("h4").length / (list.querySelectorAll("h4").length + listDone.querySelectorAll("h4").length) * 100;
    }
    else {
        donePercentage = 0;
    }
    statusBar.style.width = donePercentage.toFixed(0) + "%";
    statusText.innerHTML = donePercentage.toFixed(0) + "%";
    if (pending == 0) {
        let h4 = document.createElement("h4");
        h4.innerText = "-----";
        list.appendChild(h4);
    }
    if (done == 0) {
        let h4 = document.createElement("h4");
        h4.innerText = "-----";
        listDone.appendChild(h4);
    }
    if (done == 0 && pending == 0) {
        statusText.innerHTML = "";
    }
    //console.log(done);
}
async function getData() {
    let respJSON = await connectToServer("getAll");
    let itemList = JSON.parse(respJSON.message);
    return itemList;
}
let owner;
let id;
async function start() {
    if (localStorage.owner == "undefined" || localStorage.owner == undefined) {
        window.location.href = "login.html";
    }
    else {
        owner = JSON.parse(localStorage.owner);
        id = owner._id;
        let ownerInput = document.getElementById("ownerInput");
        ownerInput.value = id;
        let ownerInputListe = document.getElementById("addListOwner");
        ownerInputListe.value = id;
        document.getElementById("welcome").innerText = "Hallo " + owner.name;
        await addTabs();
        if (projectsArr.length == 0) {
            console.log("hier");
        }
        else {
            console.log("hier");
            await fillSite(await getData());
            addEL();
        }
    }
    //console.log(id);
}
async function addTabs() {
    projectsArr = await getAllLists();
    console.log(projectsArr.length);
    projectsArr.sort(function (a, b) {
        var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
        if (nameA < nameB) //sort string ascending
            return -1;
        if (nameA > nameB)
            return 1;
        return 0; //default return value (no sorting)
    });
    for (let index = 0; index < projectsArr.length; index++) {
        await addList(projectsArr[index]._id);
    }
    if (projectsArr.length == 0) {
        await setDefaultTab();
    }
    if (localStorage.activeTab == undefined || localStorage.activeTab == "undefined" || document.getElementById(localStorage.activeTab) == null) {
        localStorage.activeTab = document.querySelector(".tab").id;
    }
    setActiveTab(localStorage.activeTab);
}
start();
//window.setTimeout(addEL, 200);
function addEL() {
    //Kalender input im edit tab
    let cal = document.getElementById("calendar2").shadowRoot.querySelector("input");
    document.getElementById("logout").addEventListener("click", function () {
        localStorage.owner = undefined;
        window.location.reload();
    });
    //console.log(document.querySelectorAll("h2"));
    document.querySelectorAll(".tab").forEach(element => {
        element.addEventListener("click", function () {
            localStorage.activeTab = element.id;
            window.location.reload();
        });
    });
    document.querySelectorAll("span.remove").forEach(element => {
        element.addEventListener("click", async function () {
            if (confirm("Wirklich die ganze Liste löschen?")) {
                await deleteList(element.parentElement.id);
                window.location.reload();
            }
        });
    });
    document.querySelectorAll("span.delete").forEach(element => {
        element.addEventListener("click", async function () {
            await deleteItem(element.parentElement.id);
            window.location.reload();
        });
    });
    document.querySelectorAll("span.check").forEach(element => {
        element.addEventListener("click", async function () {
            await checkItem(element.parentElement.id);
            window.location.reload();
        });
    });
    document.querySelectorAll("span.create").forEach(element => {
        element.addEventListener("click", function () {
            toggleClass(document.getElementById("editDiv"), "display");
            let parent = element.parentElement;
            let input = document.getElementById("editDateValue");
            let inputText = document.getElementById("editTextValue");
            let inputId = document.getElementById("editIdPlaceholder");
            let date = parent.innerText.slice(0, 8);
            input.value = date;
            inputId.value = parent.id;
            let end = parent.innerText.slice(parent.innerText.length - 15, parent.innerText.length);
            inputText.value = parent.innerText.replace(date, "").replace(end, "");
            cal.value = date;
        });
    });
    document.querySelectorAll("#submitEdit").forEach(element => {
        element.addEventListener("click", async function () {
            document.getElementById("editTextValue").style.borderBottomColor = "#333";
            let formInput = document.getElementById("editDateValue");
            formInput.value = cal.value;
            cal.style.borderBottomColor = "#333";
            if (!checkFor(document.getElementById("editTextValue"), [""])) {
                cal.style.borderBottomColor = "var(--error-red)";
            }
            else if (!checkFor(formInput, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."])) {
                cal.style.borderBottomColor = "var(--error-red)";
            }
            else if (!checkFor(formInput, ["length", "8"])) {
                cal.style.borderBottomColor = "var(--error-red)";
            }
            else {
                await editItem(element.parentElement.id);
                window.location.reload();
            }
        });
    });
    document.querySelectorAll("#submitListe").forEach(element => {
        element.addEventListener("click", async function () {
            document.getElementById("addTabName").style.borderBottomColor = "#333";
            if (!checkFor(document.getElementById("addTabName"), [""])) {
                document.getElementById("addTabName").style.borderBottomColor = "var(--error-red)";
            }
            else {
                await connectToServer("addListe");
                window.location.reload();
            }
        });
    });
    document.getElementById("addList").addEventListener("click", addTab);
}
function setActiveTab(_tab) {
    console.log(_tab);
    document.querySelectorAll(".tab").forEach(el => {
        el.className = "tab";
    });
    localStorage.activeTab = _tab;
    if (document.getElementById(_tab) != null) {
        document.getElementById(_tab).classList.add("activePr");
    }
    let input = document.getElementById("listeInput");
    input.value = localStorage.activeTab;
}
async function setDefaultTab() {
    let res = await connectToServer("requestType=addListe&addTabName=Default&owner=" + owner._id);
    localStorage.activeTab = res.message;
    window.location.reload();
}
function addTab() {
    toggleClass(document.getElementById("addTabDiv"), "display");
}
//# sourceMappingURL=main.js.map