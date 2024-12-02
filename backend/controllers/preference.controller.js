const preferenceModel = require('../models/preference.model')


const preferenceController = {

    getPreference: async (req, res) => {
        try {
            const { userId } = req.token

            const pref = await preferenceModel.findOne({ userId })
            if (!pref) return res.status(404).send('No preference found')
            
            res.send({ obj: pref })

        } catch (error) { res.status(500).send(error.toString()) }
    },

    patchPreference: async (req, res) => {
        try {
            const { userId } = req.token
            const { emailAlerts, emailAlertInterval } = req.body

            const pref = await preferenceModel.findOneAndUpdate({ userId }, { emailAlerts, emailAlertInterval }, { new: true })
            if (!pref) return res.status(404).send('No preference found')
            
            res.send({ txt: 'Preference udpated successfully', obj: pref })

        } catch (error) { res.status(500).send(error.toString()) }
    },

}


module.exports = preferenceController