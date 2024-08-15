import { Repository } from './repo.interface';
import { Well, WellSchema } from '../models/well.model';
import db from '../db';

export default class WellRepo implements Repository<Well> {
    async findById(id: string): Promise<Well | null> {
        const doc = await db.collection('well').doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const well = WellSchema.parse(doc.data());
        return well;
    }

    async findAll(): Promise<Well[]> {
        const snapshot = await db.collection('well').get();
        const wells: Well[] = [];

        snapshot.forEach((doc) => {
            const well = WellSchema.parse(doc.data());
            wells.push(well);
        });

        return wells;
    }

    async create(well: Well): Promise<Well> {
        const docRef = await db.collection('well').add(well);
        const createdDoc = await docRef.get();

        const createdWell = WellSchema.parse(createdDoc.data());
        return createdWell;
    }

    async update(well: Well): Promise<Well> {
        await db.collection('well').doc(well.id).set(well, { merge: true });
        return well;
    }

    async delete(id: string): Promise<void> {
        await db.collection('well').doc(id).delete();
    }
}