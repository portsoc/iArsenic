// 4.js - Migration to flatten regionKey into top-level fields

import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { IMigration } from "./IMigration.js";

const db = getFirestore();
const wellsCollection = db.collection("well");

async function up(): Promise<boolean> {
    const snapshot = await wellsCollection.get();

    if (snapshot.empty) {
        console.log("No wells to migrate.");
        return true;
    }

    let failed = false;

    for (const doc of snapshot.docs) {
        const data = doc.data();
        const region = data.regionKey;

        if (!region) continue;

        try {
            await doc.ref.update({
                division: region.division,
                district: region.district,
                upazila: region.upazila,
                union: region.union,
                mouza: region.mouza,
                regionKey: FieldValue.delete(),
            });
            console.log(`Flattened regionKey for well ${doc.id}`);
        } catch (err) {
            failed = true;
            console.error(`Error updating well ${doc.id}:`, err);
        }
    }

    return !failed;
}

async function down(): Promise<boolean> {
    const snapshot = await wellsCollection.get();

    if (snapshot.empty) {
        console.log("No wells to roll back.");
        return true;
    }

    let failed = false;

    for (const doc of snapshot.docs) {
        const data = doc.data();

        try {
            await doc.ref.update({
                regionKey: {
                    division: data.division,
                    district: data.district,
                    upazila: data.upazila,
                    union: data.union,
                    mouza: data.mouza,
                },
                division: FieldValue.delete(),
                district: FieldValue.delete(),
                upazila: FieldValue.delete(),
                union: FieldValue.delete(),
                mouza: FieldValue.delete(),
            });
            console.log(`Re-nested regionKey for well ${doc.id}`);
        } catch (err) {
            failed = true;
            console.error(`Error rolling back well ${doc.id}:`, err);
        }
    }

    return !failed;
}

const migration: IMigration = { up, down };
export default migration;
