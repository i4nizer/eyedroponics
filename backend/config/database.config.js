const mongoose = require('mongoose')
const { dbPassword } = require('./config')


const connectionString = `mongodb+srv://i4nizer:${dbPassword}@cluster-project.hnbf8.mongodb.net/eyedroponics?retryWrites=true&w=majority&appName=Cluster-Project`

const connectDatabase = async () => await mongoose.connect(connectionString)


module.exports = { connectDatabase, connection: mongoose.connection }
