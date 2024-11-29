const mongoose = require('mongoose')


const thresholdSchema = new mongoose.Schema(
    {
        nitrogen: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 0 },
        },
        phosphorus: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 0 },
        },
        potassium: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 0 },
        },
        ph: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 0 },
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
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


module.exports = mongoose.model('Threshold', thresholdSchema)