const mongoose = require('mongoose')


const preferenceSchema = new mongoose.Schema(
    {
        emailAlerts: {
            type: Boolean,
            default: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('Preference', preferenceSchema)