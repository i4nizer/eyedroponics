const mailer = require('../utils/mailer');
const userModel = require('../models/user.model');
const alertModel = require('../models/alert.model');
const preferenceModel = require('../models/preference.model');


/**
 * In-memory cache for recent alerts
 * to avoid querying the database everytime
 * if the server can send an alert
 * when it detects anomalies especially
 * for every frame of the posted image. 
 */
const recentAlerts = new Map();



/**
 * Handles saving alerts and mailing them.
 * 
 * Also handles throttling too much of them.
 */
const alertService = {

    /**
     * Saves alert then mails the user if preferred.
     */
    create: async (userId, title, body, dismissed = false) => {
        // Save the alert
        const alertDoc = { userId, title, body, dismissed };
        const alert = new alertModel(alertDoc);
        await alert.save();

        // Get user preference
        const pref = await preferenceModel.findOne({ userId });
        if (!pref) return false;

        // Check if user prefers being emailed
        if (pref.emailAlerts) {
            // Get user email
            const user = await userModel.findOne({ _id: userId });
            if (!user) return false;

            // Email the alert to user
            mailer.send(user.email, title, body);
        }

        return true;
    },

    /**
     * Create specific alert types after throttling checks.
     */
    createPestAlert: async (userId, pest) => {
        const title = "Eyedroponics Alert: Pest Detected";
        const body = `
            Eyedroponics system detected that a device in your project sent
            an image with detected pest (${pest}).
            To check the image, login at http://localhost:3000/sign-in.
        `;

        // Check throttling
        const throttled = await alertService.isThrottled(userId, title);
        if (throttled) return false;

        // Save and send alert
        return await alertService.create(userId, title, body);
    },

    createPHAlert: async (userId) => {
        const title = "Eyedroponics Alert: pH Level";
        const body = `
            Eyedroponics system detected a pH level beyond your set threshold.
            To check the details, login at http://localhost:3000/sign-in.
        `;

        // Check throttling
        const throttled = await alertService.isThrottled(userId, title);
        if (throttled) return false;

        return await alertService.create(userId, title, body);
    },

    createNPKAlert: async (userId) => {
        const title = "Eyedroponics Alert: NPK Level";
        const body = `
            Eyedroponics system detected NPK levels beyond your set threshold.
            To check the details, login at http://localhost:3000/sign-in.
        `;

        // Check throttling
        const throttled = await alertService.isThrottled(userId, title);
        if (throttled) return false;

        return await alertService.create(userId, title, body);
    },

    /**
     * Checks if a user can be alerted again based on the interval preference.
     */
    isThrottled: async (userId, title) => {
        
        const key = `${userId}-${title}`;
        const now = Date.now();

        // Check in-memory cache
        if (recentAlerts.has(key)) {
            const lastAlertTime = recentAlerts.get(key);
            const preference = await preferenceModel.findOne({ userId });
            const interval = (preference?.emailAlertInterval || 0) * 60000; // Convert to ms

            if (now - lastAlertTime < interval) return true; // Throttled
        }

        // Fetch from database if not in cache
        const lastAlert = await alertModel.findOne({ userId, title }).sort({ createdAt: -1 });
        if (lastAlert) {
            const msGap = now - new Date(lastAlert.createdAt).getTime();
            const preference = await preferenceModel.findOne({ userId });
            const interval = (preference?.emailAlertInterval || 0) * 60000;

            if (msGap < interval) {
                recentAlerts.set(key, now); // Update cache
                return true; // Throttled
            }
        }

        recentAlerts.set(key, now); // Cache current alert timestamp
        return false;
    },

    // Cleanup function to clear alerts for a user
    clearUserAlerts: (userId) => {
        
        for (const key of recentAlerts.keys())
            if (key.startsWith(`${userId}-`))
                recentAlerts.delete(key);
    }
};



module.exports = alertService;
