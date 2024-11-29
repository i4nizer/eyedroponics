const tf = require('@tensorflow/tfjs-node');



// Function to define the CNN model
const createModel = (numClasses) => {
    const model = tf.sequential();
    
    model.add(tf.layers.conv2d({
        inputShape: [128, 128, 3],
        filters: 32,
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

    return model;
};

// Function to train the model using batched dataset
const trainModel = async (model, trainDataset, valDataset, epochs) => {
    await model.fitDataset(trainDataset, {
        epochs,
        validationData: valDataset,
        callbacks: {
        onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}, accuracy = ${logs.acc}`);
        },
        onBatchEnd: (batch, logs) => {
            console.log(`Batch ${batch}: loss = ${logs.loss}, accuracy = ${logs.acc}`);
        }
        }
    });
    console.log('Training complete');
};




module.exports = {
  createModel,
  trainModel,
};
