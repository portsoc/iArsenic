import { getFirestore, FieldValue as FirestoreFieldValue } from "firebase-admin/firestore";
import { IMigration } from "./IMigration.js";
import { v4 as uuidv4 } from "uuid";

const db = getFirestore();
const wellsCollection = db.collection("well");
const predictionsCollection = db.collection("prediction");

async function up(): Promise<boolean> {
    const wellsSnapshot = await wellsCollection.get();

    if (wellsSnapshot.empty) {
        console.log("No wells found, skipping migration.");
        return true;
    }

    let failed = false;

    for (const doc of wellsSnapshot.docs) {
        const wellData = doc.data();

        if (!wellData.prediction) {
            continue;
        }

        try {
            const predictionData = {
                id: uuidv4(), 
                userId: wellData.userId,
                wellId: wellData.id,
                createdAt: new Date(),
                division: wellData.regionKey.division,
                district: wellData.regionKey.district,
                upazila: wellData.regionKey.upazila!,
                union: wellData.regionKey.union!,
                mouza: wellData.regionKey.mouza!,
                depth: wellData.depth!,
                flooding: wellData.flooding!,
                staining: wellData.staining!,
                utensilStaining: wellData.utensilStaining ?? null,
                model: wellData.prediction.model,
                modelOutput: wellData.prediction.modelOutput,
                riskAssesment: wellData.prediction.riskAssesment,
            };

            await predictionsCollection.doc().set(predictionData);

            await wellsCollection.doc(doc.id).update({
                prediction: FirestoreFieldValue.delete(),
            });

            console.log(`Migrated prediction from well ${doc.id}`);
        } catch (error) {
            failed = true;
            console.error(`Failed to migrate well ${doc.id}:`, error);
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
    const predictionsSnapshot = await predictionsCollection.get();

    if (predictionsSnapshot.empty) {
        console.log("No predictions found, nothing to roll back.");
        return true;
    }

    let failed = false;

    for (const doc of predictionsSnapshot.docs) {
        const predictionData = doc.data();

        try {
            if (predictionData.wellId) {
                // Restore the prediction data back into the Well document
                await wellsCollection.doc(predictionData.wellId).update({
                    prediction: {
                        model: predictionData.model,
                        modelOutput: predictionData.modelOutput,
                        riskAssesment: predictionData.riskAssesment,
                    }
                });

                console.log(`Reattributed prediction back to well ${predictionData.wellId}`);
            } else {
                console.log(`Prediction ${doc.id} has no wellId, deleting only.`);
            }

            // Always delete the prediction document, whether reattributed or not
            await predictionsCollection.doc(doc.id).delete();
        } catch (error) {
            failed = true;
            console.error(`Failed to rollback prediction ${doc.id}:`, error);
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

const migration: IMigration = {
    up,
    down,
};

export default migration;
