import { Repository } from './repo.interface';
import { User, UserSchema } from 'shared';
import db from '../db';

export interface IUserRepo extends Repository<User> {
    findByEmail: (email: string) => Promise<User | null>;
    update: (user: User) => Promise<void>;
}

export const UserRepo: IUserRepo = {
    async findById(id: string): Promise<User | null> {
        const snapshot = await db.collection('user').where('id', '==', id).get();

        if (snapshot.empty) return null;
        const docData = snapshot.docs[0]?.data();
        if (!docData) return null;

        const doc = {
            ...docData,
            createdAt: docData.createdAt.toDate()
        }

        const user = UserSchema.parse(doc);
        return user;
    },

    async findByEmail(email: string): Promise<User | null> {
        const lcEmail = email.toLowerCase();
        const snapshot = await db.collection('user').where('email', '==', lcEmail).get();

        if (snapshot.empty) return null;
        const docData = snapshot.docs[0]?.data();
        if (!docData) return null;

        const doc = {
            ...snapshot.docs[0]?.data(),
            createdAt: docData.createdAt.toDate(),
        }

        const user = UserSchema.parse(doc);
        return user;
    },

    async findAll(): Promise<User[]> {
        const snapshot = await db.collection('user').get();
        const users: User[] = [];

        snapshot.forEach((doc) => {
            const user = UserSchema.parse(doc.data());
            users.push(user);
        });

        return users;
    },

    async create(user: User): Promise<User> {
        const docRef = await db.collection('user').add(user);
        const docSnapshot = await docRef.get();
        const doc = docSnapshot.data();

        if (!doc) throw new Error('Failed to create user');

        const createdUser = {
            ...doc,
            createdAt: doc.createdAt.toDate(),
        }


        const validatedUser = UserSchema.parse(createdUser);
        return validatedUser;
    },

    async update(user: User): Promise<void> {
        await db.collection('user').doc(user.id).set(user, { merge: true });
    },

    async del(id: string): Promise<void> {
        await db.collection('user').doc(id).delete();
    },
};
