const jwt = require('jsonwebtoken')
const config = require('../config/config')


const tokenMiddleware = {

    /** 
     * Requires authorization in req.headers 
     * Adds req.token
     */
    checkAccessToken: (req, res, next) => {
        try {
            const token = req.headers['authorization']?.split(' ')[1]
            if (!token) return res.status(403).send('No access token provided')
            
            const payload = jwt.verify(token, config.accessKey)
            req.token = payload
            next()
        } catch (error) { res.status(403).send(error.toString()) }
    },

    /** Requires token in req.body */
    checkRefreshToken: (req, res, next) => {
        try {
            const token = req?.body.token
            if (!token) return res.status(403).send('No refresh token provided')
            
            jwt.verify(token, config.refreshKey)
            next()
        } catch (error) { res.status(403).send(error.toString()) }
    },

    /**
     * Requires x-api-key in headers
     * Adds req.key
     */
    checkApiKey: (req, res, next) => {
        try {
            const apiKey = req.headers['x-api-key']
            if (!apiKey) return res.status(403).send('Api Key required')
            
            req.key = jwt.verify(apiKey, config.apiKey)
            next()
        } catch (error) { res.status(403).send(error.toString()) }
    },

}


module.exports = tokenMiddleware