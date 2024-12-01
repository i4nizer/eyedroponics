const express = require('express')
const router = express.Router()

// req.key = { userId, projectId, deviceId: device._id }
const { checkApiKey } = require('../middlewares/token.middleware')

const { uploadImage, postImage } = require('../controllers/image.controller')


router.post('/ph')
router.post('/npk')
router.post('/image', checkApiKey, uploadImage, postImage)


module.exports = router