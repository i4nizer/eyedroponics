const validate = require("@i4nizer/obj-validator")


const projectMiddleware = {
    
    /** 
     * Requires userId from req.token
     * Requires name from req.body
     */
    validatePostProject: (req, res, next) => {
        const fields = [{ name: 'name', max: 100 }]
        const { error } = validate(fields, req.body)
        
        if (error) return res.status(400).send(error)
        next()
    },
    
    /**
     * Requires userId from req.token
     * Requires projectId from req.params
     * Requires name from req.body
     */
    validatePatchProject: (req, res, next) => {
        const fields = [ { name: 'name', max: 100 } ]
        const { error } = validate(fields, req.body)
        
        if (error) return res.status(400).send(error)
        next()
    },

    
}


module.exports = projectMiddleware