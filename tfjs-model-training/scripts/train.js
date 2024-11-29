const { trainDir, valDir, batchSize, epochs, modelSavePath } = require('./config');
const { getClassLabels, getDatasetManifest, createDataset } = require('./helper');
const { createModel, trainModel } = require('./model');


// Step 1: Get class labels
const classLabels = getClassLabels(trainDir); // Mapping class names to labels

// Step 2: Get training and validation datasets
const trainManifest = getDatasetManifest(trainDir, classLabels);
const valManifest = getDatasetManifest(valDir, classLabels);

// Step 3: Create batched datasets
const trainDataset = createDataset(trainManifest, batchSize, classLabels);
const valDataset = createDataset(valManifest, batchSize, classLabels);

// Step 4: Create and compile the model
const model = createModel(Object.keys(classLabels).length);

// Step 5: Train the model
trainModel(model, trainDataset, valDataset, epochs)
    .then(() => {
        
        // Step 6: Save the trained model
        model.save(modelSavePath);
        console.log('Model saved to', modelSavePath);
    });
