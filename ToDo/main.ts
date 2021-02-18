





document.getElementById("closePopUp1").addEventListener("click", function (): void {
    toggleClass(document.getElementById("editDiv"), "display");
});





function toggleClass(_el: HTMLElement, _className: string): void {

    if (_el.classList.contains(_className)) {
        _el.classList.remove(_className);

    }
    else {
        _el.classList.add(_className);
    }
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
    document.getElementById("date").style.borderBottomColor = "#333";
    if (!checkFor(document.getElementById("name"), [""])) {
        document.getElementById("name").style.borderBottomColor = "var(--error-red)";
    }
    else if (!checkFor(document.getElementById("date"), ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."])) {
        document.getElementById("date").style.borderBottomColor = "var(--error-red)";
    }
    else if (!checkFor(document.getElementById("date"), ["length", "8"])) {
        document.getElementById("date").style.borderBottomColor = "var(--error-red)";
    }
    else {
        await connectToServer("insert");
        window.location.reload();
    }
});


function checkFor(_el: HTMLElement, _searchArray: string[]): boolean {
    let pass: boolean = false;

    let inputElement: HTMLInputElement = <HTMLInputElement>_el;
    let inputAsArray: string[] = inputElement.value.split("");

    if (_searchArray[0] == "contains") {

        for (let i: number = 1; i < _searchArray.length; i++) {
            if (!inputAsArray.includes(_searchArray[i])) {
                pass = false;
                break;
            }
            else {
                pass = true;
            }
        }
    }
    else if (_searchArray[0] == "length") {
        if (inputAsArray.length == Number(_searchArray[1])) {
            pass = true;
        }
    }
    else {
        _searchArray.forEach(query => {
            if (query == "") {
                if (inputElement.value != "") {
                    pass = true;
                }
            }
            else {
                for (let i: number = 0; i < inputAsArray.length; i++) {

                    if (!_searchArray.includes(inputAsArray[i])) {
                        pass = false;
                        break;

                    }
                    else {
                        pass = true;
                    }
                }
            }
        });
    }
    return pass;
}


async function connectToServer(_requestType: string): Promise<ResponseBody> {

    //let url: string = "https://projects4815.herokuapp.com";
    let url: string = "http://localhost:8100";
    if (_requestType == "getAll") {
        url = url + "?requestType=getAll&owner=602d854bec305e9419d392e4";
    }
    else if (_requestType == "insert") {
        let formData: FormData = new FormData(document.forms[1]);
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        url = url + "?" + query.toString();
    }
    else if (_requestType == "edit") {
        let formData: FormData = new FormData(document.forms[0]);
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        url = url + "?" + query.toString();
    }
    else {
        url = url + "?" + _requestType;
    }

    let response: Response = await fetch(url);

    return await response.json();
}

function fillSite(_items: Item[]): void {
    let relationArr: string[] = [];  /*["dateRe", "_id", "dateRe", "_id"]*/
    let dateArr: number[] = [];
    let dateArrSorted: number[] = [];

    console.log(_items);
    _items.forEach(item => {
        let date: string = item.date;
        let start: string = date.slice(0, 2);
        let mid: string = date.slice(3, 5);
        let end: string = date.slice(6, 8);
        let dateReverse: string = end + mid + start;
        console.log(start + " + " + mid + " + " + end);
        dateArr.push(Number(dateReverse));
        relationArr.push(dateReverse, item._id);
    });
    dateArrSorted = dateArr.sort(function (a: number, b: number) { return a - b; });
    console.log(dateArr);

    
    dateArrSorted.forEach(date => {
        let id: string = relationArr[relationArr.indexOf((String(date))) + 1];
        let item: Item;
        
        console.log(id);
        console.log(relationArr.indexOf(String(date)));
        _items.forEach(el => {
            if (el._id == id) {
                item = el;
            }
        });
        console.log(item);

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

    });

    calc();
}

function calc(): void {
    let list: HTMLElement = document.getElementById("list");
    let listDone: HTMLElement = document.getElementById("listDone");
    let statusBar: HTMLElement = document.getElementById("status");
    let statusText: HTMLElement = document.getElementById("statusText");
    let done: number = listDone.querySelectorAll("h4").length;
    let pending: number = list.querySelectorAll("h4").length
    let donePercentage: number;

    if ( done > 0 || pending > 0) {
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
    if(done == 0 && pending == 0) {
        statusText.innerHTML = "";
    }
    console.log(done);
}
async function getData(): Promise<Item[]> {
    let respJSON: ResponseBody = await connectToServer("getAll");
    let itemList: Item[] = JSON.parse(respJSON.message);
    return itemList;
}
async function start(): Promise<void> {
    fillSite(await getData());


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
        });
    });

    document.querySelectorAll("#submitEdit").forEach(element => {

        element.addEventListener("click", async function (): Promise<void> {
            document.getElementById("editTextValue").style.borderBottomColor = "#333";
            document.getElementById("editDateValue").style.borderBottomColor = "#333";
            if (!checkFor(document.getElementById("editTextValue"), [""])) {
                document.getElementById("editTextValue").style.borderBottomColor = "var(--error-red)";
            }
            else if (!checkFor(document.getElementById("editDateValue"), ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."])) {
                document.getElementById("editDateValue").style.borderBottomColor = "var(--error-red)";
            }
            else if (!checkFor(document.getElementById("editDateValue"), ["length", "8"])) {
                document.getElementById("editDateValue").style.borderBottomColor = "var(--error-red)";
            }
            else {
                await editItem(element.parentElement.id);
                window.location.reload();
            }

        });
    });
}

start();