import uuid4 from 'uuid4';
import { AbstractToken } from 'iarsenic-types';
import { TokenRepo } from '../repositories';

// 365 days
const API_TOKEN_TTL = 1000 * 60 * 60 * 24 * 365

export const TokenService = {
    async createApiKey(token: AbstractToken): Promise<AbstractToken> {
        const now = new Date()

        const expiresAt = new Date(
            now.getTime() + API_TOKEN_TTL
        )

        const newApiKey: AbstractToken = {
            id: uuid4(),
            userId: token.userId,
            createdAt: new Date(),
            expiresAt,
            type: 'api-key',
        }

        return await TokenRepo.create(newApiKey);
    },
}