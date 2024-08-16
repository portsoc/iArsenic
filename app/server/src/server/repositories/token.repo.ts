import { Repository } from './repo.interface';
import { Token, TokenSchema } from '../models/token.model';
import db from '../db';

export const TokenRepo: Repository<Token> = {
    async findById(id: string): Promise<Token | null> {
        const snapshot = await db.collection('token').where('id', '==', id).get();

        if (snapshot.empty) return null;
        const docData = snapshot.docs[0]?.data();
        if (!docData) return null;

        const doc = {
            ...docData,
            createdAt: docData.createdAt.toDate(),
            expiresAt: docData.expiresAt.toDate(),
            revokedAt: docData.revokedAt.toDate(),
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
            createdAt: doc.createdAt.toDate(),
            expiresAt: doc.expiresAt.toDate(),
            revokedAt: doc.revokedAt.toDate(),
        }

        const validatedJwt = TokenSchema.parse(jwt);
        return validatedJwt;
    }
}
