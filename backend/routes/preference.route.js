const express = require('express')
const router = express.Router()

const { patchPreference, getPreference } = require('../controllers/preference.controller')


router.route('/')
    .get(getPreference)
    .patch(patchPreference)


module.exports = router