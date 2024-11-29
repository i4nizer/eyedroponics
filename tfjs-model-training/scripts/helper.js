const fs = require('fs')
const path = require('path')
const tf = require('@tensorflow/tfjs-node')



// Function to get class labels (mapping class name to a numeric label)
const getClassLabels = (directory) => {
    const classDirs = fs.readdirSync(directory) // Read all class folders
    const classToLabel = {}
    classDirs.forEach((className, index) => classToLabel[className] = index)
    
    return classToLabel
}


// Function to get dataset manifest (image paths and labels)
const getDatasetManifest = (directory, classToLabel) => {
    const manifest = []
    const classDirs = fs.readdirSync(directory)
    
    classDirs.forEach((className) => {
        const classDirPath = path.join(directory, className)
        const files = fs.readdirSync(classDirPath)

        files.forEach((fileName) => {
            
        manifest.push({ path: path.join(classDirPath, fileName), label: classToLabel[className], })
        })
    })

    return manifest
}

// Function to preprocess and create dataset from the manifest
const createDataset = (manifest, batchSize, classLabels) => {
    const numClasses = Object.keys(classLabels).length

    return tf.data.generator(function* () {
        for (const { path: imagePath, label } of manifest) {
        const imageBuffer = fs.readFileSync(imagePath) // Load image buffer
        const image = tf.node.decodeImage(imageBuffer, 3) // Decode image
            .resizeBilinear([128, 128]) // Resize
            .toFloat()
            .div(255.0) // Normalize

        const labelTensor = tf.oneHot(label, numClasses) // One-hot encoding
        yield { xs: image, ys: labelTensor }
        }
    })
    .batch(batchSize)
    .prefetch(1) // Optimize prefetching
}



module.exports = {
    getClassLabels,
    getDatasetManifest,
    createDataset,
}
