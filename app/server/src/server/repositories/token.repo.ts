import { Repository } from './repo.interface';
import { Token, TokenSchema } from '../models/token.model';
import db from '../db';
import { Timestamp } from 'firebase-admin/firestore';

export const TokenRepo: Repository<Token> = {
    async findById(id: string): Promise<Token | null> {
        const doc = await db.collection('token').doc(id).get();

        if (!doc.exists) return null;

        const jwtData = TokenSchema.parse(doc.data());
        return jwtData
    },

    async create(jwtData: Token): Promise<Token> {
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
        }

        const validatedJwt = TokenSchema.parse(jwt);
        return validatedJwt;
    }
}
