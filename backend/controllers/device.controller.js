const jwt = require('jsonwebtoken')
const config = require('../config/config')
const deviceModel = require('../models/device.model')


const deviceController = {

    getDevice: async (req, res) => {
        try {
            const { userId } = req.token
            const { projectId, deviceID } = req.params

            const device = await deviceModel.findOne({ _id: deviceID, projectId, userId, deleted: false })
            if (!device) return res.status(404).send('Device not found')
            
            res.send({ obj: device })
            
        } catch (error) { res.status(500).send(error.toString()) }
    },

    getDevices: async (req, res) => {
        try {
            const { userId } = req.token
            const { projectId } = req.params

            const filter = { userId, deleted: false }
            if (projectId) filter.projectId = projectId

            const devices = await deviceModel.find(filter)
            res.send({ obj: devices })

        } catch (error) { res.status(500).send(error.toString()) }
    },

    postDevice: async (req, res) => {
        try {
            // access
            const { userId } = req.token
            const { projectId } = req.params
            const { name, sensors = [] } = req.body
            
            // create device
            const deviceDoc = { name, sensors, projectId, userId }
            const device = new deviceModel(deviceDoc)
            
            // create api key
            const payload = { userId, projectId, deviceId: device._id }
            device.key = jwt.sign(payload, config.apiKey)
            await device.save()

            // send device
            res.send({ txt: 'Device added to project', obj: device   })

        } catch (error) { res.status(500).send(error.toString()) }
    },

    patchDevice: async (req, res) => {
        try {
            const { userId } = req.token
            const { name, sensors = [] } = req.body
            const { projectId, deviceId } = req.params
            
            const deviceDoc = { name, sensors }
            const device = await deviceModel.findOneAndUpdate({ _id: deviceId, userId, projectId, deleted: false }, deviceDoc, { new: true })
            if (!device) return res.status(404).send('Device not found')

            res.send({ txt: 'Device updated', obj: device })

        } catch (error) { res.status(500).send(error.toString()) }
    },

    deleteDevice: async (req, res) => {
        try {
            const { userId } = req.token
            const { projectId, deviceId } = req.params

            const device = await deviceModel.findOneAndUpdate({ _id: deviceId, userId, projectId, deleted: false }, { deleted: true }, { new: true })
            if (!device) return res.status(404).send('Device not found')
            
            res.send({ txt: 'Device deleted' })

        } catch (error) { res.status(500).send(error.toString()) }
    },

    

}


module.exports = deviceController