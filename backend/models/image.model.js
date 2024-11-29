const mongoose = require('mongoose')


const imageSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true
        },
        pestDetected: {
            type: String,
            enum: [
                'None',
                'Aphids',
                'Cutworms',
                'Leafminers',
                'Armyworms',
                'Thrips',
                'Flea Beetles',
                'Slugs',
                'Snails',
                'Whiteflies',
            ],
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
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('Image', imageSchema)