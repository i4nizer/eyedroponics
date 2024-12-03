require('dotenv').config()


const config = {

    backendProtocol: process.env.BACKEND_PROTOCOL,
    backendHost: process.env.BACKEND_HOST,
    backendPort: process.env.BACKEND_PORT,
    
    frontendProtocol: process.env.FRONTEND_PROTOCOL,
    frontendHost: process.env.FRONTEND_HOST,
    frontendPort: process.env.FRONTEND_PORT,

    dbPassword: process.env.DB_PASSWORD,

    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASS,

    apiKey: process.env.API_KEY,

    tokenLife: 900,
    accessKey: process.env.ACCESS_KEY,
    refreshKey: process.env.REFRESH_KEY,

}


module.exports = config