const alertModel = require('../models/alert.model')


const alertController = {

    getAlerts: async (req, res) => {
        try {
            const { userId } = req.token

            const alerts = await alertModel.find({ userId })
            res.send({ obj: alerts })

        } catch (error) { res.status(500).send(error.toString()) }
    },

    patchAlert: async (req, res) => {
        try {
            const { userId } = req.token
            const { _id, dismissed } = req.body

            const alert = await alertModel.findOneAndUpdate({ _id }, { dismissed }, { new: true })
            if (!alert) return res.status(404).send("Alert not found")
            
            res.send({ obj: alert })

        } catch (error) { res.status(500).send(error.toString()) }
    },

}


module.exports = alertController