const express = require('express')
const router = express.Router({ mergeParams: true }) // Merge params to access projectId

const { checkDeviceID } = require('../middlewares/req.middleware')
const { validatePostDevice, validatePatchDevice } = require('../middlewares/device.middleware')

const { getDevice, getDevices, postDevice, patchDevice, deleteDevice } = require('../controllers/device.controller')


router.route('/')
    .get(getDevices)
    .post(validatePostDevice, postDevice)

router.route('/:deviceId')
    .get(checkDeviceID, getDevice)
    .patch(checkDeviceID, validatePatchDevice, patchDevice)
    .delete(checkDeviceID, deleteDevice)


module.exports = router
