const functions = require("firebase-functions");
const express = require("express");
const path = require("path");

const app = express();

const viteBuildOutput = path.join(__dirname, 'iarsenic-react', 'dist');

app.use(express.static(viteBuildOutput));

app.get('*', (_, res) => {
    res.sendFile(path.join(viteBuildOutput, 'index.html'));
});

exports.app = functions.https.onRequest(app);
