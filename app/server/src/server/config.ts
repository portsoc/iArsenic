export default {
    port: process.env.PORT || 3005,
    apiKey: process.env.API_KEY,
    serverless: process.env.SERVERLESS === 'true',
}