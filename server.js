const express = require('express');
const favicon = require('express-favicon');
const busboy = require("connect-busboy");
const path = require('path');
const csv = require('csv-parser');
const admin = require('firebase-admin');

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
        const itemsFromDb = [];
        const itemsFromFile = [];
        db.collection("items").get().then((querySnapshot) => {
            querySnapshot.forEach(doc => itemsFromDb.push({"id": doc.id, ...doc.data()}))
        });

        req.busboy.on("file", function (fieldName, fileStream, fileName, encoding, mimeType) {
            fileStream.pipe(csv())
                .on('data', (row) => itemsFromFile.push(row))
                .on('end', () => {
                    //Не найденные старые даннные, которые работают, делаем списанными
                    itemsFromDb.filter(itemFromDb => !itemsFromFile.map(value => value.id).includes(itemFromDb.id)).filter(value => value.working).forEach(item => {
                        db.collection("items").doc(item.id).update({
                            working: false
                        })
                    });
                    //Добавляем новые данные, которых не было
                    itemsFromFile.filter(itemFromStock => !itemsFromDb.map(value => value.id).includes(itemFromStock.id)).forEach(item => {
                        db.collection("items").doc(item.id).set({
                            history: [],
                            location: 0,
                            name: item.name,
                            purchaseDate: item.purchaseDate,
                            type: "ANOTHER",
                            working: true
                        })
                    });
                    //Если совпало, обновляем имена и даты ввода
                    itemsFromDb.filter(itemFromDb => itemsFromFile.map(value => value.id).includes(itemFromDb.id)).forEach((item) => {
                        db.collection("items").doc(item.id).update({
                            name: item.name,
                            purchaseDate: item.purchaseDate
                        })
                    });
                    res.send({status: 'done'})
                })
        });
        return req.pipe(req.busboy);
    }
});

app.get('/ping', function (req, res) {
    return res.send('pong');
});

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port);