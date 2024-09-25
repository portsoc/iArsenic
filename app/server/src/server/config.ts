export default {
    apiKey: process.env.API_KEY,
    baseUrl: process.env.BASE_URL,
    emailFrom: process.env.EMAIL_FROM,
    emailHost: process.env.EMAIL_HOST,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailPort: process.env.EMAIL_PORT,
    emailUser: process.env.EMAIL_USER,
    port: process.env.PORT || 3005,
    serverless: process.env.SERVERLESS === 'true',
}