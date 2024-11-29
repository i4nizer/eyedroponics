const express = require('express')
const router = express.Router()

const { checkApiKey } = require('../middlewares/token.middleware')

const { uploadImage, postImage } = require('../controllers/image.controller')


router.post('/ph')
router.post('/npk')
router.post('/image', uploadImage, postImage)


module.exports = router