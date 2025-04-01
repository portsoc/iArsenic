import uuid4 from 'uuid4';
import { KnownError } from '../errors';
import { AccessToken, User, UserSchema, validateModel, Language, Units, VerifyEmailTokenSchema, AccessTokenSchema, ResetPasswordTokenSchema } from 'iarsenic-types';
import { UserRepo, TokenRepo } from '../repositories'
import bcrypt from 'bcrypt'
import sendMail from '../emails/sendMail';
import verifyEmailTemplate from '../emails/templates/verifyEmail';
import resetPasswordTemplate from '../emails/templates/resetPassword';

// 7 days
const ACCESS_TOKEN_TTL = 1000 * 60 * 60 * 24 * 7

export const UserService = {
    async login(email: string, password: string): Promise<AccessToken> {
        const user = await UserRepo.findByEmail(email)

        if (user == null || user.password == null) {
            throw new KnownError({
                message: 'Invalid email or password',
                code: 401,
                name: 'Unauthorized',
            });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            throw new KnownError({
                message: 'Invalid email or password',
                code: 401,
                name: 'Unauthorized',
            });
        }

        const result = validateModel(user, UserSchema)

        if (!result.ok) throw new Error(
            `Invalid user data: ${result.error.message} for user ID: ${user.id}`
        );

        const now = new Date()
        const expiresAt = new Date(now.getTime() + ACCESS_TOKEN_TTL)

        const jwt = await TokenRepo.create({
            id: uuid4(),
            userId: user.id,
            createdAt: new Date,
            expiresAt: expiresAt,
            type: "access",
        })

        return AccessTokenSchema.parse(jwt)
    },

    async getById(userId: string): Promise<User> {
        const userRes = await UserRepo.findById(userId)

        if (userRes == null) {
            throw new KnownError({
                message: 'User not found',
                code: 404,
                name: 'UserNotFoundError',
            });
        }

        const { password, ...user } = userRes

        return user
    },

    async updateUser(userId: string, userUpdates: Partial<User>): Promise<User> {
        const user = await UserRepo.findById(userId)

        if (user == null) {
            throw new KnownError({
                message: 'User not found',
                code: 404,
                name: 'UserNotFoundError',
            });
        }

        const newUser = {
            ...user,
            ...userUpdates,
        }

        const validatedNewUser = UserSchema.parse(newUser)

        await UserRepo.update(validatedNewUser)
        return validatedNewUser
    },

    async register(
        email: string,
        password: string,
        name: string,
        language: Language,
        units: Units,
    ): Promise<void> {
        const existingUser = await UserRepo.findByEmail(email)

        if (existingUser != null) {
            throw new KnownError({
                message: 'User with this email already exists',
                code: 400,
                name: 'ValidationError',
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10)

        const newUser = UserSchema.parse({
            id: uuid4(),
            email: email,
            emailVerified: false,
            password: hashedPassword,
            name: name,
            type: 'user',
            createdAt: new Date(),
            language: language,
            units: units,
        })

        const user = await UserRepo.create({ ...newUser })

        const result = validateModel(user, UserSchema)

        if (!result.ok) throw new Error(
            `Invalid user data: ${result.error.message} for user ID: ${user.id}`
        );

        const verifyEmailToken = await TokenRepo.create({
            id: uuid4(),
            userId: user.id,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            type: 'verify-email',
        })

        const validatedToken = VerifyEmailTokenSchema.parse(
            verifyEmailToken,
        )

        await sendMail(
            user.email,
            'Verify your email',
            verifyEmailTemplate(validatedToken, user.name),
        )
    },

    async verifyEmail(tokenId: string): Promise<void> {
        const token = await TokenRepo.findById(tokenId)
        const validatedTokenRes = VerifyEmailTokenSchema.safeParse(token)

        if (!validatedTokenRes.success) {
            throw new KnownError({
                message: 'Invalid token',
                code: 400,
                name: 'ValidationError',
            });
        }

        const validatedToken = validatedTokenRes.data

        if (validatedToken.expiresAt < new Date()) {
            throw new KnownError({
                message: 'Token expired',
                code: 400,
                name: 'ValidationError',
            });
        }

        if (validatedToken.revokedAt != null) {
            throw new KnownError({
                message: 'Token already used',
                code: 400,
                name: 'ValidationError',
            });
        }

        const user = await UserRepo.findById(validatedToken.userId)

        if (user == null) {
            throw new KnownError({
                message: 'User not found',
                code: 404,
                name: 'UserNotFoundError',
            });
        }

        const newUser = UserSchema.parse({
            ...user,
            emailVerified: true,
        })

        await UserRepo.update(newUser)

        const newToken = VerifyEmailTokenSchema.parse({
            ...validatedToken,
            revokedAt: new Date(),
        })

        await TokenRepo.update(newToken)
    },

    async forgotPassword(email: string): Promise<void> {
        const user = await UserRepo.findByEmail(email)

        if (user == null) {
            console.error(`Attempting to reset password for non-existing user ${email}`);
            return
        }

        const resetPasswordToken = await TokenRepo.create({
            id: uuid4(),
            userId: user.id,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            type: 'reset-password',
        })

        const validatedTokenRes = ResetPasswordTokenSchema.safeParse(
            resetPasswordToken,
        )

        if (!validatedTokenRes.success) {
            throw new Error(
                'invalid reset password token returned from TokenRepo'
            )
        }

        const validatedToken = validatedTokenRes.data

        await sendMail(
            user.email,
            'Reset your password',
            resetPasswordTemplate(validatedToken, user.name),
        )
    },

    async resetPassword(
        tokenId: string,
        newPassword: string,
    ): Promise<void> {
        const token = await TokenRepo.findById(tokenId)
        const validatedToken = ResetPasswordTokenSchema.parse(token)

        if (validatedToken.expiresAt < new Date()) {
            throw new KnownError({
                message: 'Token expired',
                code: 400,
                name: 'ValidationError',
            });
        }

        if (validatedToken.revokedAt != null) {
            throw new KnownError({
                message: 'Token already used',
                code: 400,
                name: 'ValidationError',
            });
        }

        const user = await UserRepo.findById(validatedToken.userId)

        if (user == null) {
            throw new Error(`
                User not found for reset password token: ${tokenId}
            `)
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10)

        const newUser = UserSchema.parse({
            ...user,
            password: hashedPassword,
        })

        await UserRepo.update(newUser)

        const newToken = ResetPasswordTokenSchema.parse({
            ...validatedToken,
            revokedAt: new Date(),
        })

        await TokenRepo.update(newToken)
    }
}