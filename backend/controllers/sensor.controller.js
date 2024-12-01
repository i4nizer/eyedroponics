const phModel = require('../models/ph.model')
const npkModel = require('../models/npk.model')
const projectModel = require('../models/project.model')


const sensorController = {

    getUserPH: async (req, res) => {
        try {
            const { userId } = req.token

            // Get all projects of the user
            const projects = await projectModel.find({ userId })
            const projectIds = projects.map(project => project._id)

            // Query pH data for all the project IDs
            const phs = await phModel.find({ projectId: { $in: projectIds } })
            
            res.send({ obj: phs })

        } catch (error) { res.status(500).send(error.toString()) }
    },

    getUserNPK: async (req, res) => {
        try {
            const { userId } = req.token

            // Get all projects of the user
            const projects = await projectModel.find({ userId })
            const projectIds = projects.map(project => project._id)

            // Query NPK data for all the project IDs
            const npks = await npkModel.find({ projectId: { $in: projectIds } })
            
            res.send({ obj: npks })

        } catch (error) { res.status(500).send(error.toString()) }
    }

}


module.exports = sensorController