const mongoose = require('mongoose')


const imageSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true
        },
        pestDetected: {
            type: String,
            default: 'None'
        },
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Device'
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        },
        expireAt: {     // Field for TTL
            type: Date,
            default: () => Date.now() + 30 * 24 * 60 * 60 * 1000, // Default: 30 days from now
        },
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('Image', imageSchema)