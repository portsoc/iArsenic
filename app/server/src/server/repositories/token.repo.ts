import { Repository } from './repo.interface';
import { Token, TokenSchema } from '../models/token.model';
import db from '../db';
import { Timestamp } from 'firebase-admin/firestore';

export const TokenRepo: Repository<Token> = {
    async findById(id: string): Promise<Token | null> {
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

        const jwtData = TokenSchema.parse(doc);

        return jwtData;
    },

    async create(jwtData: Token): Promise<Token> {
        const docRef = await db.collection('token').add(jwtData);
        const docSnapshot = await docRef.get();
        const doc = docSnapshot.data();

        if (!doc) throw new Error('Failed to create token');

        const jwt = {
            ...doc,
            createdAt: doc.createdAt.toDate() instanceof Timestamp ?
                doc.createdAt.toDate() : doc.createdAt,
            expiresAt: doc.expiresAt instanceof Timestamp ?
                doc.expiresAt.toDate() : doc.expiresAt,
            revokedAt: doc.revokedAt instanceof Timestamp ?
                doc.revokedAt.toDate() : doc.revokedAt,
        }

        const validatedJwt = TokenSchema.parse(jwt);
        return validatedJwt;
    }
}
