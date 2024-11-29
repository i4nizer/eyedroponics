const mongoose = require('mongoose')


const deviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        key: {
            type: String,
            required: true,
        },
        sensors: {
            type: [String],
            enum: ['NPK', 'pH', 'Camera'],
            default: [],
        },
        deleted: {
            type: Boolean,
            default: false
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


module.exports = mongoose.model('Device', deviceSchema)