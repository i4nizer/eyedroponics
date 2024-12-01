const PDModel = require('../utils/pest-detection-model');
const upload = require('../config/multer.config');
const { emitOnApiKey } = require('../services/socket.io');



const imageController = {
    uploadImage: upload.single('image'),

    postImage: async (req, res) => {
        let resSent = false;
        
        try {
            const { file } = req;
            if (!file) return res.status(400).send('No file uploaded');

            // Respond to the client early
            res.send({ message: 'File uploaded successfully' });
            resSent = true;

            // Detect pest in the image
            const prediction = await PDModel.predict(file.path);

            // Emit { predictedIndex, predictedClass, probabilities, imageBuffer }
            const apiKey = req.headers['x-api-key'];
            emitOnApiKey(apiKey, prediction);

        } catch (error) {
            console.error(error);
            if (!resSent) res.status(500).send(error.toString());
        }
    },
};




module.exports = imageController;
