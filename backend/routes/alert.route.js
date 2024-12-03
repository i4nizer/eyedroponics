const express = require('express')
const router = express.Router()

const { getAlerts, patchAlert } = require('../controllers/alert.controller')


router.route('/')
    .get(getAlerts)
    .patch(patchAlert)


module.exports = router