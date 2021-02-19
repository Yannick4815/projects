"use strict";
async function connectToServer(_requestType) {
    let url = "https://projects4815.herokuapp.com";
    //let url: string = "http://localhost:8100";
    if (_requestType == "getAll") {
        url = url + "?requestType=getAll&owner=" + id;
    }
    else if (_requestType == "insert") {
        let formData = new FormData(document.forms[1]);
        let query = new URLSearchParams(formData);
        url = url + "?" + query.toString();
    }
    else if (_requestType == "edit" || _requestType == "login") {
        let formData = new FormData(document.forms[0]);
        let query = new URLSearchParams(formData);
        url = url + "?" + query.toString();
    }
    else {
        url = url + "?" + _requestType;
    }
    let response = await fetch(url);
    return await response.json();
}
function checkFor(_el, _searchArray) {
    let pass = false;
    let inputElement = _el;
    let inputAsArray = inputElement.value.split("");
    if (_searchArray[0] == "contains") {
        for (let i = 1; i < _searchArray.length; i++) {
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
                for (let i = 0; i < inputAsArray.length; i++) {
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
//# sourceMappingURL=shared.js.map