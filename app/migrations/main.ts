import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK using gcloud CLI credentials
initializeApp({
    credential: applicationDefault(),
});
const db = getFirestore();
const migrationsCollection = `migration`;
const progressDocRef = db.collection(migrationsCollection).doc('progress');
const lockDocRef = db.collection(migrationsCollection).doc('lock');

const migrations = [
    () => import("./0.js"),
    () => import("./1.js"),
    () => import("./2.js"),
    () => import("./3.js"),
    () => import("./4.js"),
    () => import("./5.js"),
    () => import("./6.js"),
];

async function fileExists(docRef: FirebaseFirestore.DocumentReference): Promise<boolean> {
    const doc = await docRef.get();
    return doc.exists;
}

async function readProgress(): Promise<number> {
    const doc = await progressDocRef.get();
    if (!doc.exists) {
        return -1;
    }
    const data = doc.data();
    return data?.lastMigration ?? -1;
}

async function writeProgress(version: number) {
    await progressDocRef.set(
        { lastMigration: version },
        { merge: true }
    );
    console.log(`Updated migration progress: version ${version}`);
}

async function writeLockFile(version: number) {
    await lockDocRef.set({
        lockedAt: new Date().toISOString(),
        version,
    });
    console.log("Migration locked.");
}

async function unlockMigrations() {
    await lockDocRef.delete();
    console.log("Migrations unlocked (lock document deleted).");
}

async function runMigrations() {
    if (await fileExists(lockDocRef)) {
        console.log("Migrations already locked");
        return;
    }

    await writeLockFile(migrations.length - 1);

    const lastMigration = await readProgress();

    for (let i = lastMigration + 1; i < migrations.length; i++) {
        const migration = await migrations[i]();

        console.log(`Running migration ${i}`);

        const success = await migration.default.up();

        if (!success) {
            console.log(`Migration ${i} failed, attempting rollback`);

            const rollbackSuccess = await migration.default.down();

            if (!rollbackSuccess) {
                console.log(`Failed to rollback migration ${i}`);
            }

            await unlockMigrations();
            throw new Error(`Migration ${i} failed`);
        }

        await writeProgress(i);
    }

    console.log("All migrations completed");
    await unlockMigrations();
}

runMigrations();
