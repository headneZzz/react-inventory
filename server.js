const express = require('express');
const favicon = require('express-favicon');
const busboy = require("connect-busboy");
const path = require('path');
const port = process.env.PORT || 8079;

const app = express();
app.use(favicon(__dirname + '/build/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.use(busboy());

app.post("/upload", function(req, res) {
    if(req.busboy) {
        req.busboy.on("file", function(fieldName, fileStream, fileName, encoding, mimeType) {
            //Handle file stream here
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