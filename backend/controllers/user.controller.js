const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const userModel = require('../models/user.model')
const preferenceModel = require('../models/preference.model')
const { accessKey, refreshKey, tokenLife } = require('../config/config')


const userController = {

    postSignUp: async (req, res) => {
        try {
            // access and hash
            const { name, email, password } = req.body
            const hashedPsk = crypto.createHash('sha256').update(password).digest('hex')
            
            // create user
            const userDoc = { name, email, password: hashedPsk, role: req?.role || 'User' }
            const user = new userModel(userDoc)
            await user.save()
            
            // create preference with userId
            const prefDoc = {
                emailAlerts: req.body?.emailAlerts || true,
                emailAlertInterval: req.body?.emailAlertInterval || 60,
                userId: user._id
            }
            const pref = new preferenceModel(prefDoc)
            await pref.save()
            
            // send user without password
            delete userDoc.password
            userDoc._id = user._id
            userDoc.emailAlerts = prefDoc.emailAlerts

            res.send({ txt: `User account created successfully`, obj: userDoc })

        } catch (error) { res.status(500).send(error.toString()) }
    },

    postSignIn: async (req, res) => {
        try {
            // access and hash
            const { name, password } = req.body
            const hashedPsk = crypto.createHash('sha256').update(password).digest('hex')

            // check db
            const user = await userModel.findOne({ name, password: hashedPsk })
            if (!user) return res.status(404).send('Incorrect name or password')

            // create tokens
            const payload = { userId: user._id, verified: user.verified, role: user.role }
            const access = jwt.sign(payload, accessKey, { expiresIn: tokenLife })
            const refresh = jwt.sign(payload, refreshKey, { expiresIn: '1d' })

            // save refresh token in db
            user.token = refresh
            await user.save()

            // get created user pref
            const pref = await preferenceModel.findOne({ userId: user._id })
            
            // send user and tokens
            const userDoc = {
                _id: user._id,
                name: user.name,
                email: user.email,
                verified: user.verified,
                role: user.role,
                access, refresh,
                emailAlerts: pref.emailAlerts,
                emailAlertInterval: pref.emailAlertInterval
            }

            res.send({ txt: 'User signed-in successfully', obj: userDoc })
            
        } catch (error) { res.status(500).send(error.toString()) }
    },

    postRefreshToken: async (req, res) => {
        try {
            // access
            const userId = req.params.userId
            const token = req.body.token

            // check in jwt and db
            jwt.verify(token, refreshKey)
            const user = await userModel.findOne({ _id: userId, token })
            if (!user) return res.status(404).send('Token not found or invalid')
            
            // issue new token
            const payload = { userId: user._id, verified: user.verified, role: user.role }
            const access = jwt.sign(payload, accessKey, { expiresIn: tokenLife })
            const refresh = jwt.sign(payload, refreshKey, { expiresIn: '1d' })

            // save refresh token in db
            user.token = refresh
            await user.save()

            res.send({ txt: 'New tokens issued', obj: { access, refresh } })
            
        } catch (error) { res.status(500).send(error.toString()) }
    },

}


module.exports = userController