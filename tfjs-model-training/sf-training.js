const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

// Define paths and constants
const TRAIN_DATA_DIR = './tfjs-model-training/data/train';
const VALIDATION_DATA_DIR = './tfjs-model-training/data/val';
const BATCH_SIZE = 64;
const EPOCHS = 100;
const IMAGE_SIZE = 128;
const MODEL_DIR = './tfjs-model-training/models/v4';

// Function to determine the number of classes
function getNumClasses(dataDir) {
    return fs.readdirSync(dataDir).length; // Count subdirectories (categories)
}

// Function to load image dataset
function loadImageDataset(dataDir, numClasses) {
    const classes = fs.readdirSync(dataDir);
    const imagePaths = [];
    const labels = [];

    classes.forEach((className, classIndex) => {
        const classDir = path.join(dataDir, className);
        const files = fs.readdirSync(classDir);

        files.forEach((file) => {
            const filePath = path.join(classDir, file);
            imagePaths.push(filePath);
            labels.push(classIndex); // Assign class index as the label
        });
    });

    const dataset = tf.data.generator(function* () {
        for (let i = 0; i < imagePaths.length; i++) {
            yield tf.tidy(() => {
                const imageBuffer = fs.readFileSync(imagePaths[i]);
                const imageTensor = tf.node.decodeImage(imageBuffer, 3)
                    .resizeNearestNeighbor([IMAGE_SIZE, IMAGE_SIZE])
                    .toFloat()
                    .div(255.0)
                    .reshape([IMAGE_SIZE, IMAGE_SIZE, 3]); // Explicitly reshape to ensure no batch dimension

                const label = tf.oneHot(tf.tensor1d([labels[i]], 'int32'), numClasses).squeeze();

                return { xs: imageTensor, ys: label };
            });
        }
    });


    return dataset.batch(BATCH_SIZE).shuffle(100).prefetch(1); // Improved
}



// Determine the number of classes
const numClasses = getNumClasses(TRAIN_DATA_DIR);

// Load and preprocess data
console.log("Loading training data...");
let trainDataset = loadImageDataset(TRAIN_DATA_DIR, numClasses);

console.log("Loading validation data...");
let validationDataset = loadImageDataset(VALIDATION_DATA_DIR, numClasses);

// Define the model
console.log("Building the model...");
const model = tf.sequential();

model.add(tf.layers.conv2d({
    inputShape: [IMAGE_SIZE, IMAGE_SIZE, 3],
    filters: 32,
    kernelSize: 3,
    activation: 'relu',
}));
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: 'relu',
}));
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
model.add(tf.layers.flatten());
model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));

model.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
});

// Train the model
console.log("Before training:", tf.memory());
(async () => {
    try {
        console.log("Starting training...");
        await model.fitDataset(trainDataset, {
            validationData: validationDataset,
            epochs: EPOCHS,
            callbacks: {
                onBatchEnd: (batch, logs) => console.log(`\nBatch ${batch + 1}: loss = ${logs.loss}, accuracy = ${logs.acc}`),
                onEpochEnd: (epoch, logs) => {
                    console.log(`\nEpoch ${epoch + 1}: loss = ${logs.loss}, accuracy = ${logs.acc}`);
                    console.log("Memory after epoch:", tf.memory());
                },
            },
        });

        console.log("Saving the model...");
        await model.save('file://' + MODEL_DIR);
        console.log("Model training and saving complete.");
        console.log("After training:", tf.memory());
    } catch (error) {
        console.error("Error during training or saving:", error);
    } finally {
        console.log("Disposing datasets...");
        trainDataset = null;
        validationDataset = null;

        // Dispose model
        model.dispose();
        tf.disposeVariables();

        if (global.gc) {
            global.gc();
        }
        console.log("Memory after cleanup:", tf.memory());
    }
})();
