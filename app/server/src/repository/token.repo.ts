import { Repository } from './repo.interface';
import { Token, TokenSchema } from '../models/token.model';
import db from '../db';

export default class TokenRepo implements Repository<Token> {
    async findById(id: string): Promise<Token | null> {
        const doc = await db.collection('token').doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const jwtData = TokenSchema.parse(doc.data());
        return jwtData
    }

    async create(jwtData: Token): Promise<Token> {
        const docRef = await db.collection('token').add(jwtData);
        const createdDoc = await docRef.get();

        const createdJwt = TokenSchema.parse(createdDoc.data());
        return createdJwt;
    }
}
