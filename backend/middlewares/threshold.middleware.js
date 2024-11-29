const validate = require("@i4nizer/obj-validator")



const thresholdMiddleware = {

    /**
     * Required one but optional nitrogen, phosphorus, potassium, ph, and activated in body
     */
    validatePatchThreshold: (req, res, next) => {
        const fields = [
            { name: 'nitrogen', required: false },
            { name: 'phosphorus', required: false },
            { name: 'potassium', required: false },
            { name: 'ph', required: false },
        ]
        
        const { error } = validate(fields, req.body)
        if (error) return res.status(400).send(error)
        
        next()
    },

}


module.exports = thresholdMiddleware