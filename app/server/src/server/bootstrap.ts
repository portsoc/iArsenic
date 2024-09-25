// enable alias imports e.g. 'vendors/*' rather than '../../vendors/*'
import 'module-alias/register';
import * as functions from 'firebase-functions';

// load environment variables into `process.env`
import dotenv from 'dotenv';

import { initializeApp } from 'firebase-admin/app';
initializeApp();

// identify env and load appropriate env file
const envFile = (() => {
    const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';
    const activeProject = functions.config().project?.id;

    if (isEmulator) {
        console.log('Running in emulator mode, using .env.local');
        return '.env.local';
    } else if (activeProject === 'iarsenic-staging') {
        console.log('Using environment file for staging');
        return '.env.staging';
    } else if (activeProject === 'iarsenic') {
        console.log('Using environment file for production');
        return '.env.production';
    } else {
        console.log('Defaulting to .env.local');
        return '.env.local';
    }
})();

// Load the appropriate environment file
dotenv.config({ path: envFile });

// Rest of your code...
console.log(`Using environment file: ${envFile}`);
