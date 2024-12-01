const mailer = require('../utils/mailer')
const userModel = require('../models/user.model')
const alertModel = require('../models/alert.model')
const preferenceModel = require('../models/preference.model')


const alertService = {

    /** Saves alert then mails the user if preferred */
    create: async (userId, title, body, dismissed = false) => {

        const alertDoc = { userId, title, body, dismissed }

        // Save the alert
        const alert = new alertModel(alertDoc)
        await alert.save()
        
        // Get user preference
        const pref = await preferenceModel.findOne({ userId })
        if (!pref) return false
        
        // Check if user prefers being emailed
        if (pref.emailAlerts) {
            
            // Get email of the user
            const user = await userModel.findOne({ _id: userId })
            if (!user) return false
            
            // Email the alert to user
            mailer.send(user.email, title, body)
        }

        return true
    },

    createPestAlert: async (userId) => {

        // Craft alert
        const title = "Eyedroponics Alert: Pest Detected"
        const body = `
            Our system detected that a device in your project have
            sent an image that we detected to have pest upon processing.
            To check the image, you may login to your account
            http://localhost:3000/sign-in.
        `
        
        // Alert
        return await alertService.create(userId, title, body)
    },
    
    createPHAlert: async (userId) => {

        // Craft alert
        const title = "Eyedroponics Alert: pH Level"
        const body = `
            Our system detected that a device in your project have
            sent pH level that is beyond your set pH threshold.
            To check the image, you may login to your account
            http://localhost:3000/sign-in.
        `
        
        // Alert
        return await alertService.create(userId, title, body)
    },
    
    createNPKAlert: async (userId) => {

        // Craft alert
        const title = "Eyedroponics Alert: NPK Level"
        const body = `
            Our system detected that a device in your project have
            sent NPK level that is beyond your set threshold.
            To check the image, you may login to your account
            http://localhost:3000/sign-in.
        `
        
        // Alert
        return await alertService.create(userId, title, body)
    },


}



module.exports = alertService