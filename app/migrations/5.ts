import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { IMigration } from "./IMigration.js";

const db = getFirestore();
const wellsCollection = db.collection("well");

function isComplete(well: any): boolean {
    return (
        well.wellInUse !== undefined &&
        well.division &&
        well.district &&
        well.upazila &&
        well.union &&
        well.mouza &&
        typeof well.depth === "number" &&
        typeof well.flooding === "boolean" &&
        well.staining
    );
}

function isGeolocated(well: any): boolean {
    return (
        Array.isArray(well.geolocation) &&
        well.geolocation.length === 2 &&
        typeof well.geolocation[0] === "number" &&
        typeof well.geolocation[1] === "number"
    );
}

function hasImages(well: any): boolean {
    return Array.isArray(well.imagePaths) && well.imagePaths.length > 0;
}

async function up(): Promise<boolean> {
    const snapshot = await wellsCollection.get();
    if (snapshot.empty) {
        console.log("No wells to migrate.");
        return true;
    }

    let failed = false;

    for (const doc of snapshot.docs) {
        const data = doc.data();

        const updateData = {
            geolocated: Boolean(isGeolocated(data)),
            hasImages: Boolean(hasImages(data)),
            complete: Boolean(isComplete(data)),
        };

        try {
            await doc.ref.update(updateData);
            console.log(`Updated flags for well ${doc.id}`);
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
        try {
            await doc.ref.update({
                geolocated: FieldValue.delete(),
                hasImages: FieldValue.delete(),
                complete: FieldValue.delete(),
            });
            console.log(`Removed flags from well ${doc.id}`);
        } catch (err) {
            failed = true;
            console.error(`Error rolling back well ${doc.id}:`, err);
        }
    }

    return !failed;
}

const migration: IMigration = { up, down };
export default migration;
