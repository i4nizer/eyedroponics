const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');



// Object to manage the pest detection model
const PDModel = {

    // Directory where the TensorFlow.js model is stored
    MODEL_DIR: './tfjs-model-training/models/v4/model.json',
    
    // Image size to which all inputs will be resized
    IMAGE_SIZE: 128,
    
    // Class names corresponding to the model's outputs
    CLASS_NAMES: ['aphids', 'armyworm', 'cutworm', 'leafminer', 'slugs', 'snails', 'whitefly'],
    
    // Placeholder for the loaded model
    MODEL: null,
    LOADING_PROMISE: null,

    /**
     * Load the TensorFlow.js model.
     * Ensures the model is loaded only once.
     * Logs the time taken for loading the model.
     */
    load: async () => {
        if (PDModel.MODEL) return PDModel.MODEL; // Return the cached model if already loaded
        if (PDModel.LOADING_PROMISE) return await PDModel.LOADING_PROMISE;

        console.time('Model Loading');
        PDModel.LOADING_PROMISE = tf.loadLayersModel(`file://${PDModel.MODEL_DIR}`);
        PDModel.MODEL = await PDModel.LOADING_PROMISE;
        PDModel.LOADING_PROMISE = null;
        console.timeEnd('Model Loading');

        return PDModel.MODEL;
    },

    /**
     * Preprocess an image for prediction.
     * Resizes the image to the required dimensions, normalizes pixel values, and adds a batch dimension.
     * @param {string} imagePath Path to the input image.
     * @returns {Object} { imageTensor, imageBuffer } Preprocessed image tensor.
     */
    preprocessImage: (imagePath) => {
        const imageBuffer = fs.readFileSync(imagePath); // Read image as a buffer
        const imageTensor = tf.node.decodeImage(imageBuffer, 3) // Decode the image to a tensor
            .resizeNearestNeighbor([PDModel.IMAGE_SIZE, PDModel.IMAGE_SIZE]) // Resize to the target size
            .toFloat() // Convert to floating point
            .div(255.0) // Normalize pixel values to [0, 1]
            .expandDims(); // Add a batch dimension

        return { imageTensor, imageBuffer };
    },

    /**
     * Make a prediction on a single image.
     * Returns the predicted class, index, and probabilities for the input image.
     * @param {string} imagePath Path to the input image.
     * @returns {Object} Prediction results.
     */
    predict: async (imagePath) => {
        if (!PDModel.MODEL) PDModel.MODEL = await PDModel.load(); // Ensure the model is loaded

        const { imageTensor, imageBuffer } = PDModel.preprocessImage(imagePath); // Preprocess the input image
        const prediction = PDModel.MODEL.predict(imageTensor); // Perform inference

        // Get the index of the highest probability
        const predictedIndex = prediction.argMax(-1).dataSync()[0];
        const predictedClass = PDModel.CLASS_NAMES[predictedIndex];
        const probabilities = prediction.dataSync(); // Get all prediction probabilities

        // Dispose tensors to free memory
        tf.dispose([imageTensor, prediction]);

        return { predictedIndex, predictedClass, probabilities, imageBuffer };
    },
};




module.exports = PDModel;
