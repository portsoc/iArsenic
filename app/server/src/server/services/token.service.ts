import uuid4 from 'uuid4';
import { AbstractToken, User } from 'iarsenic-types';
import { TokenRepo } from '../repositories';
import { KnownError } from '../errors';

// 365 days
const API_TOKEN_TTL = 1000 * 60 * 60 * 24 * 365

export const TokenService = {
    async createApiKey(
        auth: { user: User, token: AbstractToken },
    ): Promise<AbstractToken> {
        if (auth.user.type !== 'admin') {
            throw new KnownError({
                message: 'Well not found',
                code: 404,
                name: 'WellNotFoundError',
            });
        }

        const now = new Date()

        const expiresAt = new Date(
            now.getTime() + API_TOKEN_TTL
        )

        const newApiKey: AbstractToken = {
            id: uuid4(),
            userId: auth.user.id,
            createdAt: new Date(),
            expiresAt,
            type: 'api-key',
        }

        return await TokenRepo.create(newApiKey);
    },
}