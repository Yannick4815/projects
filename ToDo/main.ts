

document.getElementById("closePopUp1").addEventListener("click", function (): void {
    toggleClass(document.getElementById("editDiv"), "display");
});
document.getElementById("closePopUp2").addEventListener("click", function (): void {
    toggleClass(document.getElementById("addTabDiv"), "display");
});





function toggleClass(_el: HTMLElement, _className: string): void {

    if (_el.classList.contains(_className)) {
        _el.classList.remove(_className);

    }
    else {
        _el.classList.add(_className);
    }
}

async function deleteList(_id: string): Promise<ResponseBody> {
    return await connectToServer("requestType=deleteList&list=" + _id);
}
async function deleteItem(_id: string): Promise<ResponseBody> {
    return await connectToServer("requestType=delete&item=" + _id);
}
async function checkItem(_id: string): Promise<ResponseBody> {
    return await connectToServer("requestType=check&item=" + _id);
}
async function editItem(_id: string): Promise<ResponseBody> {
    return await connectToServer("edit");
}

document.getElementById("add").addEventListener("click", async function (): Promise<void> {
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



let projectsArr: List[] = [];
let prDiv: HTMLElement = document.getElementById("projects");

async function addList(_id: string): Promise<boolean> {
    //console.log("Projekt " + _id);
    let h2: HTMLElement = document.createElement("h2");
    let span: HTMLElement = document.createElement("span");
    let resp: ResponseBody = await connectToServer("requestType=getListName&id=" + _id);
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

async function getAllLists(): Promise<List[]> {
    let resp: ResponseBody = await connectToServer("requestType=getAllLists&owner=" + owner._id);
    return JSON.parse(resp.message);
}
async function fillSite(_items: Item[]): Promise<void> {
    let relationArr: string[] = [];  /*["dateRe", "_id", "dateRe", "_id"]*/
    let dateArr: number[] = [];
    let dateArrSorted: number[] = [];





    _items.forEach(item => {
        let date: string = item.date;
        let start: string = date.slice(0, 2);
        let mid: string = date.slice(3, 5);
        let end: string = date.slice(6, 8);
        let dateReverse: string = end + mid + start;
        //console.log(start + " + " + mid + " + " + end);
        dateArr.push(Number(dateReverse));
        relationArr.push(dateReverse, item._id);






    });

    let span: HTMLElement = document.createElement("span");
    span.innerText = "add";
    span.setAttribute("class", "material-icons");
    span.setAttribute("id", "addList");
    prDiv.appendChild(span);
    dateArrSorted = dateArr.sort(function (a: number, b: number) { return a - b; });
    //console.log(dateArr);


    dateArrSorted.forEach(date => {
        let id: string = relationArr[relationArr.indexOf((String(date))) + 1];
        let item: Item;



        //console.log(id);
        console.log(relationArr.indexOf(String(date)));
        _items.forEach(el => {
            if (el._id == id) {
                item = el;
            }

        });
        //console.log(item);

        let h4: HTMLElement = document.createElement("h4");
        let spanDate: HTMLElement = document.createElement("span");
        let spanEdit: HTMLElement = document.createElement("span");
        let spanCheck: HTMLElement = document.createElement("span");
        let spanDel: HTMLElement = document.createElement("span");
        let spanText: HTMLElement = document.createElement("span");

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

function calc(): void {
    let list: HTMLElement = document.getElementById("list");
    let listDone: HTMLElement = document.getElementById("listDone");
    let statusBar: HTMLElement = document.getElementById("status");
    let statusText: HTMLElement = document.getElementById("statusText");
    let done: number = listDone.querySelectorAll("h4").length;
    let pending: number = list.querySelectorAll("h4").length;
    let donePercentage: number;

    if (done > 0 || pending > 0) {
        donePercentage = listDone.querySelectorAll("h4").length / (list.querySelectorAll("h4").length + listDone.querySelectorAll("h4").length) * 100;
    }
    else {
        donePercentage = 0;
    }
    statusBar.style.width = donePercentage.toFixed(0) + "%";
    statusText.innerHTML = donePercentage.toFixed(0) + "%";

    if (pending == 0) {
        let h4: HTMLElement = document.createElement("h4");
        h4.innerText = "-----";
        list.appendChild(h4);
    }
    if (done == 0) {
        let h4: HTMLElement = document.createElement("h4");
        h4.innerText = "-----";
        listDone.appendChild(h4);
    }
    if (done == 0 && pending == 0) {
        statusText.innerHTML = "";
    }
    //console.log(done);
}
async function getData(): Promise<Item[]> {
    let respJSON: ResponseBody = await connectToServer("getAll");
    let itemList: Item[] = JSON.parse(respJSON.message);
    return itemList;
}
let owner: User;
let id: string;

async function start(): Promise<void> {


    if (localStorage.owner == "undefined" || localStorage.owner == undefined) {
        window.location.href = "login.html";
    }
    else {
        owner = JSON.parse(localStorage.owner);
        id = owner._id;
        let ownerInput: HTMLInputElement = <HTMLInputElement>document.getElementById("ownerInput");
        ownerInput.value = id;
        let ownerInputListe: HTMLInputElement = <HTMLInputElement>document.getElementById("addListOwner");
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

async function addTabs(): Promise<void> {
    
    projectsArr = await getAllLists();
    console.log(projectsArr.length);
    projectsArr.sort(function (a, b) {
        var nameA: string = a.name.toLowerCase(), nameB: string = b.name.toLowerCase();
        if (nameA < nameB) //sort string ascending
            return -1;
        if (nameA > nameB)
            return 1;
        return 0; //default return value (no sorting)
    });

    for (let index: number = 0; index < projectsArr.length; index++) {
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

function addEL(): void {

    //Kalender input im edit tab
    let cal: HTMLInputElement = document.getElementById("calendar2").shadowRoot.querySelector("input");


    document.getElementById("logout").addEventListener("click", function (): void {
        localStorage.owner = undefined;
        window.location.reload();
    });
    //console.log(document.querySelectorAll("h2"));
    document.querySelectorAll(".tab").forEach(element => {

        element.addEventListener("click", function (): void {

            localStorage.activeTab = element.id;
            window.location.reload();
        });
    });

    document.querySelectorAll("span.remove").forEach(element => {

        element.addEventListener("click", async function (): Promise<void> {
            if (confirm("Wirklich die ganze Liste löschen?")) {
                await deleteList(element.parentElement.id);
                window.location.reload();
            }
            
        });
    });

    document.querySelectorAll("span.delete").forEach(element => {

        element.addEventListener("click", async function (): Promise<void> {
            await deleteItem(element.parentElement.id);
            window.location.reload();
        });
    });

    document.querySelectorAll("span.check").forEach(element => {

        element.addEventListener("click", async function (): Promise<void> {
            await checkItem(element.parentElement.id);
            window.location.reload();
        });
    });

    document.querySelectorAll("span.create").forEach(element => {
        element.addEventListener("click", function (): void {
            toggleClass(document.getElementById("editDiv"), "display");
            let parent: HTMLElement = element.parentElement;
            let input: HTMLInputElement = <HTMLInputElement>document.getElementById("editDateValue");
            let inputText: HTMLInputElement = <HTMLInputElement>document.getElementById("editTextValue");
            let inputId: HTMLInputElement = <HTMLInputElement>document.getElementById("editIdPlaceholder");
            let date: string = parent.innerText.slice(0, 8);
            input.value = date;
            inputId.value = parent.id;
            let end: string = parent.innerText.slice(parent.innerText.length - 15, parent.innerText.length);
            inputText.value = parent.innerText.replace(date, "").replace(end, "");

            cal.value = date;
        });
    });

    document.querySelectorAll("#submitEdit").forEach(element => {

        element.addEventListener("click", async function (): Promise<void> {
            document.getElementById("editTextValue").style.borderBottomColor = "#333";
            
            let formInput: HTMLInputElement = <HTMLInputElement>document.getElementById("editDateValue");
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

        element.addEventListener("click", async function (): Promise<void> {
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

function setActiveTab(_tab: string): void {
    console.log(_tab);
    document.querySelectorAll(".tab").forEach(el => {
        el.className = "tab";
    });
    localStorage.activeTab = _tab;
    if (document.getElementById(_tab) != null) {
        document.getElementById(_tab).classList.add("activePr");
    }

    let input: HTMLInputElement = <HTMLInputElement>document.getElementById("listeInput");
    input.value = localStorage.activeTab;
}
async function setDefaultTab(): Promise<void> {
    let res: ResponseBody = await connectToServer("requestType=addListe&addTabName=Default&owner=" + owner._id);
    localStorage.activeTab = res.message;


    window.location.reload();
}

function addTab(): void {
    toggleClass(document.getElementById("addTabDiv"), "display");
}