const fs = require('fs')
const upload = require('../config/multer.config');

const phModel = require('../models/ph.model')
const npkModel = require('../models/npk.model')
const imageModel = require('../models/image.model')
const thresholdModel = require('../models/threshold.model')

const PDModel = require('../utils/pest-detection-model');
const { emitOnApiKey } = require('../utils/socket.io');

const alertService = require('../services/alert.service')


/**
 * Api Key payload accessible at req.key
 * if checkApiKey() middleware is used.
 * req.key = { userId, projectId, deviceId }.
 * 
 * Early response to avoid the sender (IoT device)
 * from waiting with saving data to database and
 * creating alerts as well as detecting pests
 * which are beyond their task to post data.
 */
const apiController = {

    uploadImage: upload.single('image'),

    postImage: async (req, res) => {
        let resSent = false;
        
        try {
            // Access
            const { file } = req;
            const { userId, projectId, deviceId } = req.key
            const apiKey = req.headers['x-api-key'];    // raw
            if (!file) return res.status(400).send('No file uploaded');

            // Respond to the client early
            res.send({ message: 'File uploaded successfully.' });
            resSent = true;

            // Detect presence of pest in the image
            const prediction = await PDModel.predict(file.path);

            // prediction = { predictedIndex, predictedClass, probabilities, imageBuffer }
            emitOnApiKey(apiKey, prediction);

            // No Pest: remove the image file
            if (prediction.predictedClass == 'None') return fs.unlinkSync(file.path)
            
            // Save the image if pest is detected
            const image = new imageModel({ imageUrl: file.path, pestDetected: prediction.predictedClass, deviceId, projectId })
            await image.save()

            // Alert
            await alertService.createPestAlert(userId)

        } catch (error) {

            console.error(error);
            if (!resSent) res.status(500).send(error.toString());
        }
    },


    postPH: async (req, res) => {
        let resSent = false;
        
        try {
            // Access
            const { ph } = req.body
            const { userId, projectId, deviceId } = req.key

            // Respond early
            res.send({ message: 'pH data received successfully.' });
            resSent = true;

            // Save the pH Level
            const PH = new phModel({ ph, deviceId, projectId })
            await PH.save()

            // Check if within threshold (threshold is on creation of project)
            const threshold = await thresholdModel.findOne({ projectId })
            const { min, max } = threshold.ph;

            // Within range: no need to alert or email
            if (ph >= min && ph <= max) return;
                
            // On Threshold Overlap: Email the Owner, and Save an Alert
            await alertService.createPHAlert(userId)

        } catch (error) {
            console.error(error);
            if (!resSent) res.status(500).send(error.toString());
        }
    },
    
    postNPK: async (req, res) => {
        let resSent = false;
        
        try {
            // Access
            const { nitrogen, phosphorus, potassium } = req.body
            const { userId, projectId, deviceId } = req.key

            // Respond early
            res.send({ message: 'NPK data received successfully.' });
            resSent = true;

            // Save the NPK Level
            const NPK = new npkModel({ nitrogen, phosphorus, potassium, deviceId, projectId })
            await NPK.save()

            // Check if within threshold (one threshold is made on creation of project)
            const threshold = await thresholdModel.findOne({ projectId })
            const { min: ntmin, max: ntmax } = threshold.nitrogen;
            const { min: psmin, max: psmax } = threshold.phosphorus;
            const { min: ptmin, max: ptmax } = threshold.potassium;

            const state = {
                nts: nitrogen >= ntmin && nitrogen <= ntmax,
                pss: phosphorus >= psmin && phosphorus <= psmax,
                pts: potassium >= ptmin && potassium <= ptmax,
            }
            
            // Within range: no need to alert or email
            if (state.nts && state.pss && state.pts) return;
            
            // On Threshold Overlap: Email the Owner, and Save an Alert
            await alertService.createNPKAlert(userId)

        } catch (error) {
            console.error(error);
            if (!resSent) res.status(500).send(error.toString());
        }
    },


};



module.exports = apiController;