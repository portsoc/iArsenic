import { Repository } from './repo.interface';
import { AbstractTokenSchema, AbstractToken } from 'iarsenic-types';
import db from '../db';
import { Timestamp } from 'firebase-admin/firestore';

export const TokenRepo: Repository<AbstractToken> = {
    async findById(id: string): Promise<AbstractToken | null> {
        const snapshot = await db.collection('token').where('id', '==', id).get();

        if (snapshot.empty) return null;
        const docData = snapshot.docs[0]?.data();
        if (!docData) return null;

        const doc = {
            ...docData,
            createdAt: docData.createdAt instanceof Timestamp ?
                docData.createdAt.toDate() : docData.createdAt,
            expiresAt: docData.expiresAt instanceof Timestamp ?
                docData.expiresAt.toDate() : docData.expiresAt,
            revokedAt: docData.revokedAt instanceof Timestamp ?
                docData.revokedAt.toDate() : docData.revokedAt,
        }

        const jwtData = AbstractTokenSchema.parse(doc);

        return jwtData;
    },

    async create(jwtData: AbstractToken): Promise<AbstractToken> {
        const docRef = await db.collection('token').add(jwtData);
        const docSnapshot = await docRef.get();
        const doc = docSnapshot.data();

        if (!doc) throw new Error('Failed to create token');

        const jwt = {
            ...doc,
            createdAt: doc.createdAt instanceof Timestamp ?
                doc.createdAt.toDate() : doc.createdAt,
            expiresAt: doc.expiresAt instanceof Timestamp ?
                doc.expiresAt.toDate() : doc.expiresAt,
            revokedAt: doc.revokedAt instanceof Timestamp ?
                doc.revokedAt.toDate() : doc.revokedAt,
        }

        const validatedJwt = AbstractTokenSchema.parse(jwt);
        return validatedJwt;
    },

    async update(token: AbstractToken): Promise<void> {
        const snapshot = await db.collection('token').where('id', '==', token.id).get();

        if (snapshot.empty) throw new Error(`Token with id ${token.id} not found`);
        const docRef = snapshot.docs[0]?.ref;
        if (!docRef) throw new Error(`Token with id ${token.id} not found`);

        await docRef.set(token, { merge: true });
    }
}
