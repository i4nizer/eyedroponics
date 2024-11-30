const mongoose = require('mongoose')
const { dbPassword } = require('./config')


const connectionString = `mongodb://localhost:27017/eyedroponics`

const connectDatabase = async () => await mongoose.connect(connectionString)


module.exports = { connectDatabase, connection: mongoose.connection }
