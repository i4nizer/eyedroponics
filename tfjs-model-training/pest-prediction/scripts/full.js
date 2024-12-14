const tf = require('@tensorflow/tfjs-node');
const imageModel = require('../../../backend/models/image.model');
const { connectDatabase, connection } = require('../../../backend/config/database.config');



// Step 1: Retrieve Pest Data Efficiently
const getPestData = async () => {
    const cursor = imageModel.find({}, 'pestDetected').cursor();
    const pestCounts = {};

    for await (const doc of cursor) {
        const pestDetected = doc.pestDetected;
        if (pestCounts[pestDetected]) pestCounts[pestDetected]++;
        else pestCounts[pestDetected] = 1;
    }

    const pestTypes = Object.keys(pestCounts);
    const pestCountsArray = Object.values(pestCounts);

    return { pestTypes, pestCounts: pestCountsArray };
}

// Step 3: Preprocess Data
const preprocessData = (pestTypes, pestCounts, numClasses) => {
    return tf.tidy(() => {
        const inputs = [pestCounts];
        const labels = Array(numClasses).fill(0);

        // Create a one-hot encoding for pest types
        pestTypes.forEach((type, idx) => {
            if (idx < numClasses) labels[idx] = 1; // Limit to numClasses
        });

        const inputTensor = tf.tensor2d(inputs, [1, pestCounts.length]);
        const labelTensor = tf.tensor2d([labels], [1, numClasses]);

        return { inputTensor, labelTensor };
    });
}

// Create Model with Dynamic Input Shape
const createModel = (inputShape, outputShape) => {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [inputShape] }));
    model.add(tf.layers.dense({ units: outputShape, activation: 'softmax' }));
    model.compile({
        optimizer: tf.train.adam(),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });
    return model;
}

// Step 4: Train Model
const trainModel = async (model, inputs, labels, epochs, batchSize) => {
    return await model.fit(inputs, labels, {
        epochs,
        batchSize,
        validationSplit: 0.2,
        callbacks: {
            onEpochEnd: async (epoch, logs) => console.log(`Epoch ${epoch + 1}: Loss = ${logs.loss}, Accuracy = ${logs.acc}`),
            onBatchEnd: async (batch, logs) => console.log(`Batch ${batch + 1}: Loss = ${logs.loss}, Accuracy = ${logs.acc}`),
        },
    });
}

// Step 5: Main Flow
(async () => {
    try {
        await connectDatabase();
        connection.once('open', () => console.log('Connected to MongoDB database.'));

        const { pestTypes, pestCounts } = await getPestData();
        console.log('Pest Types:', pestTypes);
        console.log('Pest Counts:', pestCounts);

        const inputShape = pestCounts.length;
        const numClasses = 10; // Ensure the output shape is fixed to 10

        const { inputTensor, labelTensor } = preprocessData(pestTypes, pestCounts, numClasses);

        const model = createModel(inputShape, numClasses);
        await trainModel(model, inputTensor, labelTensor, 50, 32);

        const savePath = './tfjs-model-training/pest-prediction/models/v0';
        await model.save(`file://${savePath}`);
        console.log('Model saved to:', savePath);

        inputTensor.dispose();
        labelTensor.dispose();

    } catch (error) {
        console.error('Error:', error);

    } finally {
        await connection.close();
        console.log('MongoDB connection closed.');
    }
})();
