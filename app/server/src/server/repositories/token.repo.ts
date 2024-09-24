import { Repository } from './repo.interface';
import { AccessToken, AccessTokenSchema } from 'shared';
import db from '../db';
import { Timestamp } from 'firebase-admin/firestore';

export const TokenRepo: Repository<AccessToken> = {
    async findById(id: string): Promise<AccessToken | null> {
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

        const jwtData = AccessTokenSchema.parse(doc);

        return jwtData;
    },

    async create(jwtData: AccessToken): Promise<AccessToken> {
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

        const validatedJwt = AccessTokenSchema.parse(jwt);
        return validatedJwt;
    }
}
