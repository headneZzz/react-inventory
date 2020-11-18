const express = require('express');
const favicon = require('express-favicon');
const busboy = require("connect-busboy");
const path = require('path');
const csv = require('csv-parser');
const admin = require('firebase-admin');
const translit = require('./translit');
const utils = require("./utils");

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const port = process.env.PORT || 8079;
const app = express();
app.use(favicon(__dirname + '/build/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.use(busboy());


app.post("/upload", function (req, res) {
    if (req.busboy) {
        try {
            const itemsFromDb = [];
            const itemsFromFile = [];
            db.collection("items").get().then((querySnapshot) => {
                querySnapshot.forEach(doc => itemsFromDb.push({"id": doc.id, ...doc.data()}))
            })
                .then(() => {
                    req.busboy.on("file", function (fieldName, fileStream, fileName, encoding, mimeType) {
                        fileStream.pipe(csv())
                            .on('data', (row) => itemsFromFile.push(row))
                            .on('end', () => {
                                //Все id приводим в порядок
                                itemsFromFile.forEach(item => item.id = item.id.trim().translit().toUpperCase());
                                //Не найденные старые даннные, которые работают, делаем списанными
                                itemsFromDb
                                    .filter(itemFromDb => !itemsFromFile
                                        .map(value => value.id)
                                        .includes(itemFromDb.id))
                                    .filter(value => value.working)
                                    .forEach(item => {
                                        db.collection("items").doc(item.id).update({
                                            working: false
                                        })
                                    });
                                //Добавляем новые данные, которых не было
                                itemsFromFile
                                    .filter(itemFromFile => !itemsFromDb
                                        .map(value => value.id)
                                        .includes(itemFromFile.id))
                                    .forEach(item => {
                                        db.collection("items").doc(item.id).set({
                                            history: [],
                                            location: 0,
                                            name: item.name,
                                            purchaseDate: item.purchaseDate,
                                            type: utils.getTypeFromName(item.name),
                                            working: true
                                        })
                                    });
                                //Если совпало
                                itemsFromFile
                                    .filter(itemFromFile => itemsFromDb
                                        .map(value => value.id)
                                        .includes(itemFromFile.id))
                                    .forEach(item => {
                                        db.collection("items").doc(item.id).update({
                                            working: true,
                                            name: item.name,
                                            type: utils.getTypeFromName(item.name),
                                            purchaseDate: item.purchaseDate
                                        })
                                    });
                                res.send({status: 'done'})
                            })
                    });
                    return req.pipe(req.busboy);
                });
        } catch (e) {
            console.log(e)
            res.send({status: 'error'})
            return req.pipe(req.busboy);
        }
    }
});

app.get('/ping', function (req, res) {
    return res.send('pong');
});

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port);