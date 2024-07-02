import functions from 'firebase-functions';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import fs from 'fs';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

initializeApp();
const db = getFirestore();

const app = express();
app.use(cors());

const staticPath = path.resolve('static');
app.use(express.static(staticPath));

app.use(express.json());

app.get('/api/healthcheck', (_, res) => {
    res.json({
        status: 'ok',
        message: `Server is running. Timestamp: ${new Date().toISOString()}`,
    });
});

app.get('/api/gps-region', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        res.status(400).json({ error: 'Missing required query parameters' });
        return;
    }

    let div = JSON.parse(fs.readFileSync('./geodata/div-c005-s010-vw-pr.geojson', 'utf8'));

    const division = div.features
        .find((feature) => booleanPointInPolygon([lon, lat], feature.geometry));

    if (!division) {
        res.status(404).json({ error: 'Area not inside Bangladesh' });
        return;
    }

    div = null
    let dis = JSON.parse(fs.readFileSync('./geodata/dis-c005-s010-vw-pr.geojson', 'utf8'));

    const district = dis.features
        .filter((feature) => feature.properties.div === division.properties.div)
        .find((feature) => booleanPointInPolygon([lon, lat], feature.geometry));

    dis = null
    let upa = JSON.parse(fs.readFileSync('./geodata/upa-c005-s010-vw-pr.geojson', 'utf8'));

    const upazila = upa.features
        .filter((feature) => feature.properties.dis === district.properties.dis)
        .find((feature) => booleanPointInPolygon([lon, lat], feature.geometry));

    upa = null
    let uni = JSON.parse(fs.readFileSync('./geodata/uni-c005-s010-vw-pr.geojson', 'utf8'));

    const union = uni.features
        .filter((feature) => feature.properties.upa === upazila.properties.upa)
        .find((feature) => booleanPointInPolygon([lon, lat], feature.geometry));

    uni = null
    let mou = JSON.parse(fs.readFileSync('./geodata/mou-c005-s010-vw-pr.geojson', 'utf8'));

    const mouza = mou.features
        .filter((feature) => feature.properties.union === union.properties.union)
        .find((feature) => booleanPointInPolygon([lon, lat], feature.geometry));

    const regionKey = {
        division: division.properties.div,
        district: district.properties.dis,
        upazila: upazila.properties.upa,
        union: union.properties.uni,
        mouza: mouza.properties.mou,
    }

    res.status(200).json({
        regionKey,
    });
});

app.post('/api/save-prediction', async (req, res) => {
    const data = req.body;

    try {
        const predictionsRef = db.collection('default');

        predictionsRef.add({
            id: data.id || 'N/A',
            predictors: {
                regionKey: {
                    division: (data.regionKey && data.regionKey.division) || 'N/A',
                    district: (data.regionKey && data.regionKey.district) || 'N/A',
                    upazila: (data.regionKey && data.regionKey.upazila) || 'N/A',
                    union: (data.regionKey && data.regionKey.union) || 'N/A',
                    mouza: (data.regionKey && data.regionKey.mouza) || 'N/A',
                },
                depth: {
                    unit: (data.depth && data.depth.unit) || 'N/A',
                    value: (data.depth && data.depth.value) || 'N/A',
                },
                flooding: data.flooding || 'N/A',
                wellStaining: data.wellStaining || 'N/A',
                utensilStaining: data.utensilStaining || 'N/A',
            },
            createdAt: Timestamp.now(),
            model: data.model || 'N/A',
            prediction: data.prediction || 'N/A',
            modelPrediction: data.modelPrediction || 'N/A',
            language: data.language || 'N/A',
            geolocation: data.geolocation || 'N/A',
        })

        res.status(200).json({ status: 'User data saved successfully' });
    } catch (error) {
        console.error('Error saving prediction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/interactive-map', (_, res) => {
    const map = fs.readFileSync('./interactive-map/interactive-map.geojson', 'utf8');
    console.log('got map')

    res.status(200).json(JSON.parse(map));
});

app.get('/api/predictions', async (req, res) => {
    const predictions = db.collection('default');
    const snapshot = await predictions.get();
    const data = snapshot.docs.map((doc) => doc.data());

    res.status(200).json({ data });

});

app.get('*', (_, res) => {
    res.sendFile(path.resolve(staticPath, 'index.html'));
});

export default functions.runWith({ memory: '512MB' }).https.onRequest(app);
