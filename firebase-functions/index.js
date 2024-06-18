import functions from 'firebase-functions';
import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors());

const staticPath = path.resolve('static');
app.use(express.static(staticPath));

app.get('/api/healthcheck', (_, res) => {
    res.json({
        status: 'ok',
        message: `Server is running. Timestamp: ${new Date().toISOString()}`,
    });
});

app.get('*', (_, res) => {
    res.sendFile(path.resolve(staticPath, 'index.html'));
});

export default functions.https.onRequest(app);
