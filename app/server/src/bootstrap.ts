// enable alias imports e.g. 'vendors/*' rather than '../../vendors/*'
import 'module-alias/register'

// load environment variables into `process.env`
import dotenv from 'dotenv'

// Determine the environment file based on the environment variable
const envFile = process.env.ENV_FILE || '.env'

// Load the appropriate environment file
dotenv.config({ path: envFile })

// Rest of your code...
console.log(`Using environment file: ${envFile}`)