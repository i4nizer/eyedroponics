const express = require('express')
const router = express.Router({ mergeParams: true })


const { getUserPH, getUserNPK } = require('../controllers/sensor.controller')

router.get('/ph', getUserPH)
router.get('/npk', getUserNPK)


module.exports = router