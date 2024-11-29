const thresholdModel = require('../models/threshold.model')


const thresholdController = {

    getThreshold: async (req, res) => {
        try {
            const { userId } = req.token
            const { projectId } = req.params

            const threshold = await thresholdModel.findOne({ projectId, userId, deleted: false })
            if (!threshold) return res.status(404).send('Threshold not found')
            
            res.send({ obj: threshold })

        } catch (error) { res.status(500).send(error.toString()) }
    },

    getThresholds: async (req, res) => {
        try {
            const { userId } = req.token

            const thresholds = await thresholdModel.find({ userId, deleted: false })
            res.send({ obj: thresholds })

        } catch (error) { res.status(500).send(error.toString()) }
    },

    patchThreshold: async (req, res) => {
        try {
            const { userId } = req.token
            const { projectId, thresholdId } = req.params
            const { nitrogen, phosphorus, potassium, ph } = req.body

            const thresholdDoc = { nitrogen, phosphorus, potassium, ph }
            const threshold = await thresholdModel.findOneAndUpdate({ _id: thresholdId, projectId, userId }, thresholdDoc, { new: true })
            if (!threshold) return res.status(404).send('Threshold not found')
            
            res.send({ txt: 'Threshold udpated successfully', obj: threshold })
            
        } catch (error) { res.status(500).send(error.toString()) }
    },

}


module.exports = thresholdController