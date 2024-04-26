const functions = require("firebase-functions");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

const viteBuildOutput = path.join(__dirname, 'iarsenic-react', 'dist');

console.log('viteBuildOutput', viteBuildOutput);
app.use(express.static(viteBuildOutput));

app.get('*', (_, res) => {
    res.sendFile(path.join(viteBuildOutput, 'index.html'));
});

exports.app = functions.https.onRequest(app);
