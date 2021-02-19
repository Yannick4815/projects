async function connectToServer(_requestType: string): Promise<ResponseBody> {

    let url: string = "https://projects4815.herokuapp.com";
    //let url: string = "http://localhost:8100";
    if (_requestType == "getAll") {
        url = url + "?requestType=getAll&owner=" + id;
    }
    else if (_requestType == "insert") {
        let formData: FormData = new FormData(document.forms[1]);
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        url = url + "?" + query.toString();
    }
    else if (_requestType == "edit" || _requestType == "login") {
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