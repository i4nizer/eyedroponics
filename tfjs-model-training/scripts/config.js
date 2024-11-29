




module.exports = {
    trainDir: 'data/train',
    valDir: 'data/val',
    imageSize: [256, 256],  // Resize images to 256x256
    batchSize: 32,         // Set batch size
    epochs: 10,            // Number of epochs
    modelSavePath: 'file://./models/v2', // Where to save the trained model
};
