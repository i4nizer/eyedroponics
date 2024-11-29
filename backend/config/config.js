require('dotenv').config()


const config = {

    port: process.env.PORT,
    dbPassword: process.env.DB_PASSWORD,

    apiKey: process.env.API_KEY,

    tokenLife: 900,
    accessKey: process.env.ACCESS_KEY,
    refreshKey: process.env.REFRESH_KEY,

}


module.exports = config