const validate = require("@i4nizer/obj-validator")



const deviceMiddleware = {

    /** 
     * Requires userId in req.token
     * Requires projectId in req.params
     * Requires name in req.body
     */
    validatePostDevice: (req, res, next) => {
        const fields = [
            { name: 'name', min: 1, max: 30 },
            { name: 'sensors', min: 2, max: 6, required: false },
        ]
        
        const { error } = validate(fields, req.body)
        if (error) return res.status(400).send(error)
        
        next()
    },
    
    /**
     * Requires userId in req.token
     * Requires projectId and deviceId in req.params
     * Requires name in req.body
     */
    validatePatchDevice: (req, res, next) => {
        const fields = [
            { name: 'name', min: 1, max: 30 },
            { name: 'sensors', min: 2, max: 6, required: false },
        ]
        
        const { error } = validate(fields, req.body)
        if (error) return res.status(400).send(error)
        
        next()
    },

    

}


module.exports = deviceMiddleware