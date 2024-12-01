const mongoose = require('mongoose')


const preferenceSchema = new mongoose.Schema(
    {
        emailAlerts: {
            type: Boolean,
            default: true
        },
        emailAlertInterval: {
            type: Number,
            default: 60         // This was in minutes
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