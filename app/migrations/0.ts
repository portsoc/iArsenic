import { getFirestore } from "firebase-admin/firestore";
import { IMigration } from "./IMigration.js";
import { Timestamp } from "firebase-admin/firestore";

function isValidDateLike(value: unknown): boolean {
    return (
        value instanceof Date ||
        value instanceof Timestamp ||
        typeof value === "string"
    );
}

const db = getFirestore();

async function getDocuments(collectionName: string) {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
}

// --- Light validators based on your Zod models ---

function validateApiKey(data: any): string[] {
    const errors: string[] = [];

    if (typeof data.id !== "string") errors.push("Missing or invalid id");
    if (typeof data.owner !== "string") errors.push("Missing or invalid owner");
    if (typeof data.purpose !== "string") errors.push("Missing or invalid purpose");
    if (!isValidDateLike(data.createdAt)) errors.push("Missing or invalid createdAt");
    if (data.revokedAt && !(data.revokedAt instanceof Date || typeof data.revokedAt === "string")) errors.push("Invalid revokedAt");

    return errors;
}

function validateToken(data: any): string[] {
    const errors: string[] = [];

    if (typeof data.id !== "string") errors.push("Missing or invalid id");
    if (typeof data.userId !== "string") errors.push("Missing or invalid userId");
    if (!isValidDateLike(data.createdAt)) errors.push("Missing or invalid createdAt");
    if (!isValidDateLike(data.expiresAt)) errors.push("Missing or invalid expiresAt");
    if (data.type !== "access" && data.type !== "reset-password" && data.type !== 'verify-email') {
        errors.push(`Invalid type, expected 'access', got '${data.type}'`);
    }

    if (data.revokedAt !== undefined && !isValidDateLike(data.revokedAt)) {
        errors.push("Invalid revokedAt");
    }

    return errors;
}


function validateUser(data: any): string[] {
    const errors: string[] = [];

    if (typeof data.id !== "string") errors.push("Missing or invalid id");
    if (typeof data.email !== "string") errors.push("Missing or invalid email");
    if (typeof data.emailVerified !== "boolean") errors.push("Missing or invalid emailVerified");
    if (typeof data.name !== "string") errors.push("Missing or invalid name");
    if (!["admin", "user"].includes(data.type)) errors.push(`Invalid user type: ${data.type}`);
    if (!isValidDateLike(data.createdAt)) errors.push("Missing or invalid createdAt");
    if (!["english", "bengali"].includes(data.language)) errors.push(`Invalid language: ${data.language}`);
    if (!["meters", "feet"].includes(data.units)) errors.push(`Invalid units: ${data.units}`);

    return errors;
}

function validateWell(data: any): string[] {
    const errors: string[] = [];

    if (typeof data.id !== "string") errors.push("Missing or invalid id");
    if (!isValidDateLike(data.createdAt)) errors.push("Missing or invalid createdAt");
    if (typeof data.userId !== "string") errors.push("Missing or invalid userId");

    if (data.geolocation) {
        if (!Array.isArray(data.geolocation) || data.geolocation.length !== 2) {
            errors.push("Invalid geolocation format");
        } else if (typeof data.geolocation[0] !== "number" || typeof data.geolocation[1] !== "number") {
            errors.push("Geolocation must be [number, number]");
        }
    }

    return errors;
}

// --- Migration runner ---

async function up(): Promise<boolean> {
    let failed = false;

    const collections = [
        { name: "apiKey", validator: validateApiKey },
        { name: "token", validator: validateToken },
        { name: "user", validator: validateUser },
        { name: "well", validator: validateWell },
    ];

    for (const { name, validator } of collections) {
        console.log(`Validating collection '${name}'...`);

        const documents = await getDocuments(name);

        if (documents.length === 0) {
            console.log(`Collection '${name}' is empty, skipping.`);
            continue;
        }

        for (const doc of documents) {
            const errors = validator(doc.data);

            if (errors.length > 0) {
                failed = true;
                console.warn(`Document ${doc.id} in '${name}' is invalid:`);
                console.log(doc)
                for (const error of errors) {
                    console.warn(`   - ${error}`);
                }
            }
        }
    }

    if (failed) {
        console.error("Validation errors found, unable to proceed to next stage.");
        return false;
    } else {
        console.log("All documents passed validation.");
        return true;
    }
}

async function down(): Promise<boolean> {
    console.log("No down operation for validation.");
    return true;
}

const migration: IMigration = {
    up,
    down,
};

export default migration;
