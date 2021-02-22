"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klausur = void 0;
const Http = require("http");
const Mongo = require("mongodb");
const Url = require("url");
var Klausur;
(function (Klausur) {
    let items;
    let user;
    let lists;
    main();
    async function main() {
        console.log("Starting server");
        let port = Number(process.env.PORT);
        if (!port)
            port = 8100;
        items = await connectDB("Items");
        user = await connectDB("User");
        lists = await connectDB("Lists");
        let server = Http.createServer();
        server.addListener("request", handleRequest);
        server.addListener("listening", handleListen);
        server.listen(port);
    }
    function handleListen() {
        console.log("Listening");
    }
    async function handleRequest(_request, _response) {
        console.log("I hear voices!");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        if (_request.method == "POST") { /*Für Ausbau mit POST-Anfragen*/
            /*let body = "";
            _request.on("formData", data => {
                body += data;
            });
            _request.on("end", async () => {
                let post: any = JSON.parse(body);
                _response.write(JSON.stringify(post));
            });*/
        }
        else {
            let adresse = _request.url;
            let q = Url.parse(adresse, true);
            let qdata = q.query;
            console.log("Request: " + qdata.requestType);
            console.log(qdata);
            let result;
            let resArr;
            let responseBody = { status: "error", message: "" };
            if (qdata.requestType == "getAll") {
                result = items.find({ owner: new Mongo.ObjectId(String(qdata.owner)), projekt: new Mongo.ObjectId(String(qdata.list)) });
                resArr = await result.toArray();
                console.log("Owner: " + qdata.owner);
                responseBody.status = "success";
                responseBody.message = JSON.stringify(resArr);
            }
            else if (qdata.requestType == "login" || qdata.requestType == "register") {
                console.log("Reading");
                result = user.find({ email: qdata.email });
                let foundUser = await result.toArray();
                let userExists;
                if (foundUser.length > 0) {
                    userExists = true;
                    console.log("FOUND USER");
                }
                else {
                    userExists = false;
                    console.log("CANNOT FOUND USER");
                }
                if (qdata.requestType == "login") {
                    if (userExists) {
                        if (qdata.pwd == foundUser[0].pwd) {
                            responseBody.message = JSON.stringify(foundUser[0]);
                            responseBody.status = "success";
                        }
                        else {
                            responseBody.message = "Falsches Passwort";
                        }
                    }
                    else {
                        responseBody.message = "Kein Konto mit dieser E-Mail gefunden";
                    }
                }
                else {
                    if (!userExists) {
                        let res = await user.insertOne({ name: qdata.vorname, email: qdata.email, pwd: qdata.pwd });
                        result = user.find({ email: qdata.email });
                        let foundUser = await result.toArray();
                        responseBody.message = JSON.stringify(foundUser[0]);
                        responseBody.status = "success";
                    }
                    else {
                        responseBody.message = "E-Mail wird bereits verwendet!";
                    }
                }
            }
            else if (qdata.requestType == "check") {
                changeItemState(String(qdata.item), items);
            }
            else if (qdata.requestType == "getListName") {
                result = lists.find({ _id: new Mongo.ObjectId(String(qdata.id)) });
                let foundList = await result.toArray();
                if (JSON.stringify(foundList) != "[]") {
                    responseBody.message = foundList[0].name;
                    responseBody.status = "success";
                }
                else {
                    console.log("cant find List " + qdata.id);
                }
            }
            else if (qdata.requestType == "add") {
                items.insertOne({
                    owner: new Mongo.ObjectId(String(qdata.owner)),
                    name: qdata.name,
                    date: qdata.date,
                    status: 1,
                    projekt: new Mongo.ObjectId(String(qdata.liste))
                });
                responseBody.status = "success";
            }
            else if (qdata.requestType == "addListe") {
                let res = await lists.insertOne({
                    name: qdata.addTabName,
                    owner: new Mongo.ObjectId(String(qdata.owner))
                });
                responseBody.message = res.insertedId;
                console.log(res.insertedId);
                responseBody.status = "success";
            }
            else if (qdata.requestType == "edit") {
                editItem(String(qdata.editIdPlaceholder), String(qdata.editDateValue), String(qdata.editTextValue), items);
                responseBody.status = "success";
            }
            else if (qdata.requestType == "delete") {
                console.log("delete " + qdata.item);
                result = items.find({ _id: new Mongo.ObjectId(String(qdata.item)) });
                let foundItem = await result.toArray();
                if (foundItem.length > 0) {
                    items.deleteOne({ _id: new Mongo.ObjectId(String(foundItem[0]._id)) });
                    responseBody.message = "success";
                    responseBody.message = "Löschen erfolgreich";
                }
                else {
                    responseBody.message = "Element nicht gefunden";
                    console.log("can't find item");
                }
            }
            else if (qdata.requestType == "deleteList") {
                console.log("delete " + qdata.list);
                result = lists.find({ _id: new Mongo.ObjectId(String(qdata.list)) });
                let foundItem = await result.toArray();
                if (foundItem.length > 0) {
                    lists.deleteOne({ _id: new Mongo.ObjectId(String(foundItem[0]._id)) });
                    responseBody.message = "success";
                    responseBody.message = "Löschen erfolgreich";
                }
                else {
                    responseBody.message = "Element nicht gefunden";
                    console.log("can't find item");
                }
                //Items löschen
                result = items.find({ projekt: new Mongo.ObjectId(String(qdata.list)) });
                foundItem = await result.toArray();
                foundItem.forEach(item => {
                    console.log("Lösche " + item.name);
                    items.deleteOne({ _id: new Mongo.ObjectId(String(item._id)) });
                });
            }
            else if (qdata.requestType == "getAllLists") {
                result = lists.find({ owner: new Mongo.ObjectId(String(qdata.owner)) }).sort({ age: -1 });
                let foundLists = await result.toArray();
                responseBody.message = JSON.stringify(foundLists);
                responseBody.status = "success";
            }
            /*
            else if (qdata.requestType == "loginIndex") {
                result = user.find({ email: qdata.email });
    
                let foundUser: Benutzer[] = await result.toArray();
    
                let id: string;
                let userExists: boolean;
    
    
                if (foundUser.length > 0) {
                    userExists = true;
                    console.log("FOUND USER");
                }
                else {
                    userExists = false;
                    console.log("CANNOT FOUND USER");
                }
    
    
                if (userExists) {
                    if (qdata.pwd == foundUser[0].passwort) {
                        id = foundUser[0]._id;
                        responseBody.status = "success";
                        responseBody.message = id;
                    }
                    else {
                        responseBody.message = "Falsches Passwort";
                    }
                }
                else {
                    responseBody.message = "Kein Konto mit dieser E-Mail gefunden";
                }
    
            }
            else if (qdata.requestType == "getUserInfo") {
    
                try {
                    result = user.find({ _id: new Mongo.ObjectId(String(qdata.user)) });
                    let foundUser: Benutzer[] = await result.toArray();
                    console.log("GET Info of: " + foundUser[0]);
                    responseBody.status = "success";
                    if (foundUser.length > 0) {
                        responseBody.message = JSON.stringify(foundUser[0]);
                    }
                    else {
                        console.log("Error");
                    }
                } catch (error) {
                    console.log("CACTHED: Benutzer nicht gefunden");
                }
    
    
            }
            else if (qdata.requestType == "getAllUserItems") {
                try {
                    result = items.find({ user: new Mongo.ObjectId(String(qdata.user)) });
                    let foundItems: Item[] = await result.toArray();
                    console.log("founditems: " + foundItems);
                    responseBody.status = "success";
                    if (foundItems.length > 0) {
                        
                        responseBody.message = JSON.stringify(foundItems);
                    }
                    else {
                        responseBody.message = "empty";
                        console.log("Keine Items ausgeliehen");
                    }
                } catch (error) {
                    console.log("CACTHED: Benutzer nicht gefunden");
                }
            }*/
            else {
                _response.write("error");
            }
            _response.write(JSON.stringify(responseBody));
        }
        _response.end();
    }
})(Klausur = exports.Klausur || (exports.Klausur = {}));
async function connectDB(_collection) {
    let _url = "mongodb+srv://myDBUser:XIZffDgGfc18HjwX@todo.idpk6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    let mongoClient = new Mongo.MongoClient(_url);
    await mongoClient.connect();
    console.log("Success");
    return mongoClient.db("ToDo").collection(_collection);
}
async function findAndSetUser(_element, _userId, _items) {
    await _items.updateOne({ _id: new Mongo.ObjectId(String(_element)) }, {
        $set: {
            user: _userId,
            status: "2"
        }
    });
}
async function changeItemState(_element, _items) {
    await _items.updateOne({ _id: new Mongo.ObjectId(String(_element)) }, {
        $set: {
            status: 2
        }
    });
}
async function editItem(_element, _date, _name, _items) {
    await _items.updateOne({ _id: new Mongo.ObjectId(String(_element)) }, {
        $set: {
            name: _name,
            date: _date
        }
    });
}
//# sourceMappingURL=server.js.map