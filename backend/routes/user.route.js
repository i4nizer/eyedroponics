const express = require('express')
const router = express.Router()

const alertRoutes = require('./alert.route')
const projectRoutes = require('./project.route')
const preferenceRoutes = require('./preference.route')

const { checkUserID } = require('../middlewares/req.middleware')
const { checkAccessToken, checkRefreshToken } = require('../middlewares/token.middleware')
const { validateSignUp, validateSignIn, setRole } = require('../middlewares/user.middleware')

const { postSignUp, postSignIn, postRefreshToken } = require('../controllers/user.controller')


router.post('/sign-up', validateSignUp, setRole('User'), postSignUp)
router.post('/sign-in', validateSignIn, setRole('User'), postSignIn)
router.post('/token', checkRefreshToken, postRefreshToken)

router.use('/alert', checkAccessToken, checkUserID, alertRoutes)
router.use('/project', checkAccessToken, checkUserID, projectRoutes)
router.use('/preference', checkAccessToken, checkUserID, preferenceRoutes)


module.exports = router