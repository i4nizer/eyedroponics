const express = require('express')
const router = express.Router({ mergeParams: true })

const { uploadImage, postImage, postPH, postNPK } = require('../controllers/api.controller')


router.post('/ph', postPH)
router.post('/npk', postNPK)
router.post('/image', uploadImage, postImage)


module.exports = router