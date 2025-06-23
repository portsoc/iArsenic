import { Repository } from './repo.interface';
import { Well, WellSchema } from 'iarsenic-types';
import db from '../db';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export interface IWellRepo extends Repository<Well> {
    update: (well: Well) => Promise<void>;
    getByQuery: (queries: QueryTuple[]) => Promise<Well[]>;
    findAll: () => Promise<Well[]>;
}

type QueryTuple = [string, FirebaseFirestore.WhereFilterOp, any];

export const WellRepo: IWellRepo = {
    async findById(id: string): Promise<Well | null> {
        const snapshot = await db.collection('well').where('id', '==', id).get();

        if (snapshot.empty) return null;
        const docData = snapshot.docs[0]?.data();
        if (!docData) return null;

        const doc = {
            ...docData,
            createdAt: docData.createdAt instanceof Timestamp ?
                docData.createdAt.toDate() : docData,
        }

        const well = WellSchema.parse(doc);
        return well;
    },

    async findAll(): Promise<Well[]> {
        const snapshot = await db.collection('well').get();
        const wells: Well[] = [];

        for (const well of snapshot.docs) {
            const docData = well.data();

            const wellData = {
                ...docData,
                createdAt: docData.createdAt instanceof Timestamp ?
                    docData.createdAt.toDate() :
                    docData.createdAt,
            };

            const validatedWell = WellSchema.parse(wellData);
            wells.push(validatedWell);
        }

        return wells;
    },

    async create(well: Well): Promise<Well> {
        const docRef = await db.collection('well').add(well);
        const docSnapshot = await docRef.get();
        const doc = docSnapshot.data();

        if (!doc) throw new Error('Failed to create well');

        const createdWell = {
            ...doc,
            createdAt: doc.createdAt.toDate(),
        }

        const validatedWell = WellSchema.parse(createdWell);
        return validatedWell;
    },

    async update(well: Well): Promise<void> {
        console.log(well)
        const wellRef = db.collection('well');
    
        const querySnapshot = await wellRef.where('id', '==', well.id).get();
        if (querySnapshot.empty) {
            throw new Error('Well not found');
        }
    
        const doc = querySnapshot.docs[0];
        if (!doc) throw new Error('Well not found');
    
        const updateData: Well = {
            ...well,
        };

        if (well.staining !== 'not sure') {
            (updateData as any).utensilStaining = FieldValue.delete();
        }
    
        await doc.ref.set(updateData, { merge: true });
    },

    async del(id: string): Promise<void> {
        await db.collection('well').doc(id).delete();
    },

    async getByQuery(queries: QueryTuple[]): Promise<Well[]> {
        let dbQuery: FirebaseFirestore.Query<
            FirebaseFirestore.DocumentData
        > = db.collection('well');

        for (const [key, operator, value] of queries) {
            dbQuery = dbQuery.where(key, operator, value);
        }

        const snapshot = await dbQuery.get();
        const wells: Well[] = [];

        for (const well of snapshot.docs) {
            const docData = well.data();

            const wellData = {
                ...docData,
                createdAt: docData.createdAt instanceof Timestamp ?
                    docData.createdAt.toDate() :
                    docData.createdAt,
            };

            const validatedWell = WellSchema.parse(wellData);
            wells.push(validatedWell);
        }

        return wells;
    }
}