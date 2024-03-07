const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'docs' directory
app.use(express.static(path.join(__dirname, 'docs')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// Export your Express server as a Cloud Function
exports.app = functions.https.onRequest(app);
