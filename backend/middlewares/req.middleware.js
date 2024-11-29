

const reqMiddleware = {

    checkUserID: (req, res, next) => {
        if (!req?.token.userId) return res.status(400).send('User ID is required.')
        next()
    },
    
    checkProjectID: (req, res, next) => {
        if (!req?.params.projectId) return res.status(400).send('Project ID is required.')
        next()
    },

    checkDeviceID: (req, res, next) => {
        if (!req?.params.deviceId) return res.status(400).send('Device ID is required.')
        next()
    },

    checkThresholdID: (req, res, next) => {
        if (!req?.params.thresholdId) return res.status(400).send('Threshold ID is required.')
        next()
    }



}


module.exports = reqMiddleware