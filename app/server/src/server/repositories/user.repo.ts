import { Repository } from './repo.interface';
import { User, UserSchema } from '../models/user.model';
import db from '../db';
import { Timestamp } from 'firebase-admin/firestore';

export interface IUserRepo extends Repository<User> {
    findByEmail: (email: string) => Promise<User | null>;
    update: (user: User) => Promise<User>;
}

export const UserRepo: IUserRepo = {
    async findById(id: string): Promise<User | null> {
        console.log(id)
        const snapshot = await db.collection('user').where('id', '==', id).get();

        if (snapshot.empty) return null;
        const docData = snapshot.docs[0]?.data();
        if (!docData) return null;

        const doc = {
            ...docData,
            createdAt: docData.createdAt instanceof Timestamp ?
                docData.createdAt.toDate() : docData.createdAt,
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
            createdAt: docData.createdAt instanceof Timestamp ?
                docData.createdAt.toDate() : docData.createdAt,
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
            createdAt: doc.createdAt instanceof Timestamp ?
                doc.createdAt.toDate() : doc.createdAt,
        }

        const validatedUser = UserSchema.parse(createdUser);
        return validatedUser;
    },

    async update(user: User): Promise<User> {
        await db.collection('user').doc(user.id).set(user, { merge: true });
        return user;
    },

    async del(id: string): Promise<void> {
        await db.collection('user').doc(id).delete();
    },
};
