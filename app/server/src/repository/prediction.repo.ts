import { Repository } from './repo.interface';
import { Prediction, PredictionSchema } from '../models/prediction.model';
import db from '../db';

export default class PredictionRepo implements Repository<Prediction> {
    async findById(id: string): Promise<Prediction | null> {
        const doc = await db.collection('prediction').doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const prediction = PredictionSchema.parse(doc.data());
        return prediction;
    }

    async findAll(): Promise<Prediction[]> {
        const snapshot = await db.collection('prediction').get();
        const predictions: Prediction[] = [];

        snapshot.forEach((doc) => {
            const prediction = PredictionSchema.parse(doc.data());
            predictions.push(prediction);
        });

        return predictions;
    }

    async create(prediction: Prediction): Promise<Prediction> {
        const docRef = await db.collection('prediction').add(prediction);
        const createdDoc = await docRef.get();

        const createdPrediction = PredictionSchema.parse(createdDoc.data());
        return createdPrediction;
    }

    async update(prediction: Prediction): Promise<Prediction> {
        await db.collection('prediction').doc(prediction.id).set(prediction, { merge: true });
        return prediction;
    }

    async delete(id: string): Promise<void> {
        await db.collection('prediction').doc(id).delete();
    }
}