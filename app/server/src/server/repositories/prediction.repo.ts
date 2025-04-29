import { Repository } from './repo.interface';
import { Prediction, PredictionSchema } from 'iarsenic-types';
import db from '../db';
import { Timestamp } from 'firebase-admin/firestore';

export interface IPredictionRepo extends Repository<Prediction> {
    update: (prediction: Prediction) => Promise<void>;
    getByQuery: (queries: QueryTuple[]) => Promise<Prediction[]>;
    findAll: () => Promise<Prediction[]>;
}

type QueryTuple = [string, FirebaseFirestore.WhereFilterOp, any];

export const PredictionRepo: IPredictionRepo = {
    async findById(id: string): Promise<Prediction | null> {
        const snapshot = await db.collection('prediction').where('id', '==', id).get();

        if (snapshot.empty) return null;
        const docData = snapshot.docs[0]?.data();
        if (!docData) return null;

        const doc = {
            ...docData,
            createdAt: docData.createdAt instanceof Timestamp
                ? docData.createdAt.toDate()
                : docData.createdAt,
        };

        const prediction = PredictionSchema.parse(doc);
        return prediction;
    },

    async findAll(): Promise<Prediction[]> {
        const snapshot = await db.collection('prediction').get();
        const predictions: Prediction[] = [];

        for (const prediction of snapshot.docs) {
            const docData = prediction.data();

            const predictionData = {
                ...docData,
                createdAt: docData.createdAt instanceof Timestamp
                    ? docData.createdAt.toDate()
                    : docData.createdAt,
            };

            const validatedPrediction = PredictionSchema.parse(predictionData);
            predictions.push(validatedPrediction);
        }

        return predictions;
    },

    async create(prediction: Prediction): Promise<Prediction> {
        const docRef = await db.collection('prediction').add(prediction);
        const docSnapshot = await docRef.get();
        const doc = docSnapshot.data();

        if (!doc) throw new Error('Failed to create prediction');

        const createdPrediction = {
            ...doc,
            createdAt: doc.createdAt.toDate(),
        };

        const validatedPrediction = PredictionSchema.parse(createdPrediction);
        return validatedPrediction;
    },

    async update(prediction: Prediction): Promise<void> {
        const predictionRef = db.collection('prediction');
        const querySnapshot = await predictionRef.where('id', '==', prediction.id).get();

        if (querySnapshot.empty) {
            throw new Error('Prediction not found');
        }

        const doc = querySnapshot.docs[0];
        if (!doc) throw new Error('Prediction not found');

        await doc.ref.set(prediction, { merge: true });
    },

    async del(id: string): Promise<void> {
        const snapshot = await db.collection('prediction').where('id', '==', id).get();

        if (snapshot.empty) {
            throw new Error(`Prediction with id ${id} not found`);
        }

        const doc = snapshot.docs[0];
        if (!doc) throw new Error(`Prediction with id ${id} not found`);

        await doc.ref.delete();
    },

    async getByQuery(queries: QueryTuple[]): Promise<Prediction[]> {
        let dbQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db.collection('prediction');

        for (const [key, operator, value] of queries) {
            dbQuery = dbQuery.where(key, operator, value);
        }

        const snapshot = await dbQuery.get();
        const predictions: Prediction[] = [];

        for (const prediction of snapshot.docs) {
            const docData = prediction.data();

            const predictionData = {
                ...docData,
                createdAt: docData.createdAt instanceof Timestamp
                    ? docData.createdAt.toDate()
                    : docData.createdAt,
            };

            const validatedPrediction = PredictionSchema.parse(predictionData);
            predictions.push(validatedPrediction);
        }

        return predictions;
    }
}
