// enable alias imports e.g. 'vendors/*' rather than '../../vendors/*'
import 'module-alias/register';

// load environment variables into `process.env`
import dotenv from 'dotenv';

import { initializeApp } from 'firebase-admin/app';
initializeApp();

// identify env and load appropriate env file
const envFile = '.env'

// Load the appropriate environment file
dotenv.config({ path: envFile });

// Rest of your code...
console.log(`Using environment file: ${envFile}`);
