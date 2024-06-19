import functions from 'firebase-functions';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();

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

app.post('/api/save-prediction', async (req, res) => {
    const { data } = req.body;

    try {
        const predictionsRef = db.collection('default');

        await predictionsRef.add({
            predictors: {
                regionKey: {
                    division: data.predictors.regionKey.division,
                    district: data.predictors.regionKey.district,
                    upazila: data.predictors.regionKey.upazila,
                    union: data.predictors.regionKey.union,
                    mouza: data.predictors.regionKey.mouza,
                },
                depth: {
                    unit: data.predictors.depth.unit,
                    value: data.predictors.depth.value,
                },
                flooding: data.predictors.flooding,
                wellStaining: data.predictors.wellStaining,
                utensilStaining: data.predictors.utensilStaining,
            },
            createdAt: Timestamp.now(),
            model: data.model,
            prediction: data.prediction,
            requesterIp: req.ip,
            language: data.language,
            location: {
                latitude: data.location.latitude,
                longitude: data.location.longitude,
            },
        });

        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Error saving prediction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('*', (_, res) => {
    res.sendFile(path.resolve(staticPath, 'index.html'));
});

export default functions.https.onRequest(app);
