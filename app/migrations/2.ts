import { getFirestore } from "firebase-admin/firestore";
import { IMigration } from "./IMigration.js";

const db = getFirestore();
const wellsCollection = db.collection("well");

async function up(): Promise<boolean> {
    const wellsSnapshot = await wellsCollection.get();

    if (wellsSnapshot.empty) {
        console.log("No wells found, skipping migration.");
        return true;
    }

    let failed = false;

    for (const doc of wellsSnapshot.docs) {
        const data = doc.data();

        try {
            await wellsCollection.doc(doc.id).update({
                wellInUse: data.drinkingWaterSource ?? false,
                drinkingWaterSource: deleteField(),
            });

            console.log(`Renamed drinkingWaterSource → wellInUse on well ${doc.id}`);
        } catch (err) {
            failed = true;
            console.error(`Failed to update well ${doc.id}:`, err);
        }
    }

    if (failed) {
        console.error("Migration completed with errors.");
        return false;
    } else {
        console.log("Migration completed successfully.");
        return true;
    }
}

async function down(): Promise<boolean> {
    const wellsSnapshot = await wellsCollection.get();

    if (wellsSnapshot.empty) {
        console.log("No wells found, nothing to roll back.");
        return true;
    }

    let failed = false;

    for (const doc of wellsSnapshot.docs) {
        const data = doc.data();

        if (!('wellInUse' in data)) {
            continue;
        }

        try {
            await wellsCollection.doc(doc.id).update({
                drinkingWaterSource: data.wellInUse,
                wellInUse: deleteField(),
            });

            console.log(`Reverted wellInUse → drinkingWaterSource on well ${doc.id}`);
        } catch (err) {
            failed = true;
            console.error(`Failed to rollback well ${doc.id}:`, err);
        }
    }

    if (failed) {
        console.error("Rollback completed with errors.");
        return false;
    } else {
        console.log("Rollback completed successfully.");
        return true;
    }
}

import { FieldValue as FirestoreFieldValue } from "firebase-admin/firestore";
const deleteField = () => FirestoreFieldValue.delete();

const migration: IMigration = {
    up,
    down,
};

export default migration;
