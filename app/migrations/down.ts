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

// --- List your migrations here in order ---
const migrations = [
    () => import("./0.js"),
    () => import("./1.js"),
    () => import("./2.js"),
    () => import("./3.js"),
    // add new migrations as you add them
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

async function unlockMigrations() {
    const exists = await fileExists(lockDocRef);
    if (exists) {
        await lockDocRef.delete();
        console.log("Migrations unlocked (lock document deleted).");
    }
}

async function migrateDown() {
    console.log("Starting migrate down...");

    await unlockMigrations();

    const currentVersion = await readProgress();

    if (currentVersion < 0) {
        console.error("No migrations have been applied yet.");
        return;
    }

    const migration = await migrations[currentVersion]();

    console.log(`Rolling back migration ${currentVersion}`);

    const success = await migration.default.down();

    if (!success) {
        console.error(`Migration ${currentVersion} rollback failed.`);
        throw new Error(`Migration ${currentVersion} rollback failed.`);
    }

    const newVersion = currentVersion - 1;
    await writeProgress(newVersion);

    console.log(`Successfully rolled back to version ${newVersion}`);
}

migrateDown();
