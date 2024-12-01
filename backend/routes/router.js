const express = require('express')
const router = express.Router()

const apiRoutes = require('./api.route')
const userRoutes = require('./user.route')

const { checkApiKey } = require('../middlewares/token.middleware')


router.use(express.json())
router.use((req, res, next) => { console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`); next() })

router.use('/', checkApiKey, apiRoutes)
router.use('/user', userRoutes)

    

module.exports = router