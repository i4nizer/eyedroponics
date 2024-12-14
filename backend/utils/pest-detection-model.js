const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');



// Object to manage the pest detection model
const PDModel = {

    // Directory where the TensorFlow.js model is stored
    modelDir: './tfjs-model-training/models/v7/model.json',
    
    // Image size to which all inputs will be resized
    imageSize: 256,

    // Class name as read from a directory
    classNames: [],

    // Placeholder for the loaded model
    model: null,
    loadingPromise: null,

    /**
     * Reads folder names from a specified directory.
     * @param {string} dirPath - The path to the directory.
     * @returns {string[]} An array of folder names.
     */
    getFolderNames: (dirPath) => {
        try {
            // Read all contents of the directory
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });

            // Filter for directories and map to their names
            const folderNames = entries
                .filter(entry => entry.isDirectory())
                .map(folder => folder.name);

            return folderNames;
        }
        catch (error) {
            console.error('Error reading directory:', error.message);
            return [];
        }
    },

    /**
     * Load the TensorFlow.js model.
     * Ensures the model is loaded only once.
     * Logs the time taken for loading the model.
     */
    load: async () => {
        if (PDModel.model) return PDModel.model; // Return the cached model if already loaded
        if (PDModel.loadingPromise) return await PDModel.loadingPromise;

        console.time('Model Loading');
        PDModel.loadingPromise = tf.loadLayersModel(`file://${PDModel.modelDir}`);
        PDModel.model = await PDModel.loadingPromise;
        PDModel.loadingPromise = null;
        console.timeEnd('Model Loading');

        // Add class names
        const classDir = "./tfjs-model-training/data/train"
        const classes = PDModel.getFolderNames(classDir)
        PDModel.classNames.push(...classes)
        console.log(`Found ${classes.length} classes from the model: [${classes.join(', ')}]`)

        return PDModel.model;
    },

    /**
     * Preprocess an image for prediction.
     * Resizes the image to the required dimensions, normalizes pixel values, and adds a batch dimension.
     * @param {string} imagePath Path to the input image.
     * @returns {Object} Preprocessed image tensor.
     */
    preprocessImage: (imagePath) => {
        const imageBuffer = fs.readFileSync(imagePath); // Read image as a buffer
        const imageTensor = tf.node.decodeImage(imageBuffer, 3) // Decode the image to a tensor
            .resizeNearestNeighbor([PDModel.imageSize, PDModel.imageSize]) // Resize to the target size
            .toFloat() // Convert to floating point
            .div(255.0) // Normalize pixel values to [0, 1]
            .expandDims(); // Add a batch dimension

        return imageTensor;
    },

    /**
     * Make a prediction on a single image.
     * Returns the predicted class, index, and probabilities for the input image.
     * @param {string} imagePath Path to the input image.
     * @returns {Object} { predictedIndex, predictedClass, probabilities }
     */
    predict: async (imagePath) => {
        if (!PDModel.model) PDModel.model = await PDModel.load(); // Ensure the model is loaded

        // Use tf.tidy to manage memory for tensors created inside this block
        const result = tf.tidy(() => {
            const imageTensor = PDModel.preprocessImage(imagePath); // Preprocess the input image
            const prediction = PDModel.model.predict(imageTensor); // Perform inference

            // Get the index of the highest probability and predicted class
            const predictedIndex = prediction.argMax(-1).dataSync()[0];
            const probabilities = Array.from(prediction.dataSync()); // Get all prediction probabilities

            return { predictedIndex, probabilities };
        });

        const predictedClass = PDModel.classNames[result.predictedIndex];
        return { ...result, predictedClass };
    },

};




module.exports = PDModel;
