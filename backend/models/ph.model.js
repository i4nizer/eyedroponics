const mongoose = require('mongoose')


const phSchema = new mongoose.Schema(
    {
        ph: {
            type: Number,
            required: true
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


module.exports = mongoose.model('PH', phSchema)