import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { IMigration } from "./IMigration.js";
import { v4 as uuidv4 } from "uuid";

const db = getFirestore();
const wellsCollection = db.collection("well");
const predictionsCollection = db.collection("prediction");

async function up(): Promise<boolean> {
    const predictionsSnapshot = await predictionsCollection.get();
    if (predictionsSnapshot.empty) {
        console.log("No predictions to migrate.");
        return true;
    }

    let failed = false;

    for (const doc of predictionsSnapshot.docs) {
        const prediction = doc.data();

        const predictionFields = {
            model: prediction.model,
            modelOutput: prediction.modelOutput,
            riskAssesment: prediction.riskAssesment,
        };

        try {
            if (prediction.wellId) {
                await wellsCollection.doc(prediction.wellId).update(predictionFields);
                console.log(`Updated well ${prediction.wellId} with prediction ${doc.id}`);
            } else {
                const newWellId = uuidv4();

                const newWell = {
                    id: newWellId,
                    createdAt: prediction.createdAt ?? new Date(),
                    userId: prediction.userId,
                    division: prediction.division,
                    district: prediction.district,
                    upazila: prediction.upazila,
                    union: prediction.union,
                    mouza: prediction.mouza,
                    depth: prediction.depth,
                    flooding: prediction.flooding,
                    staining: prediction.staining,
                    utensilStaining: prediction.utensilStaining ?? null,
                    geolocation: prediction.geolocation ?? prediction.mouzaGeolocation ?? null,
                    wellInUse: false,
                    model: prediction.model,
                    modelOutput: prediction.modelOutput,
                    riskAssesment: prediction.riskAssesment,
                };

                Object.keys(newWell).forEach(
                    key => newWell[key as keyof typeof newWell] == null && delete newWell[key as keyof typeof newWell]
                );

                await wellsCollection.doc(newWellId).set(newWell);
                console.log(`Created new well ${newWellId} from prediction ${doc.id}`);
            }

            await predictionsCollection.doc(doc.id).delete();
        } catch (err) {
            failed = true;
            console.error(`Failed to process prediction ${doc.id}:`, err);
        }
    }

    return !failed;
}

async function down(): Promise<boolean> {
    const wellsSnapshot = await wellsCollection.get();
    if (wellsSnapshot.empty) {
        console.log("No wells to process for rollback.");
        return true;
    }

    let failed = false;

    for (const doc of wellsSnapshot.docs) {
        const well = doc.data();

        if (well.model && well.modelOutput && well.riskAssesment) {
            try {
                const predictionId = uuidv4();

                const prediction = {
                    id: predictionId,
                    userId: well.userId,
                    wellId: well.id,
                    createdAt: well.createdAt ?? new Date(),
                    division: well.division,
                    district: well.district,
                    upazila: well.upazila,
                    union: well.union,
                    mouza: well.mouza,
                    depth: well.depth,
                    flooding: well.flooding,
                    staining: well.staining,
                    utensilStaining: well.utensilStaining ?? null,
                    geolocation: well.geolocation ?? null,
                    model: well.model,
                    modelOutput: well.modelOutput,
                    riskAssesment: well.riskAssesment,
                };

                Object.keys(prediction).forEach(
                    key => prediction[key as keyof typeof prediction] == null && delete prediction[key as keyof typeof prediction]
                );

                await predictionsCollection.doc(predictionId).set(prediction);

                await doc.ref.update({
                    model: FieldValue.delete(),
                    modelOutput: FieldValue.delete(),
                    riskAssesment: FieldValue.delete(),
                });

                console.log(`Extracted prediction from well ${doc.id} → prediction ${predictionId}`);
            } catch (err) {
                failed = true;
                console.error(`Failed to rollback well ${doc.id}:`, err);
            }
        }
    }

    return !failed;
}

const migration: IMigration = {
    up,
    down,
};

export default migration;
