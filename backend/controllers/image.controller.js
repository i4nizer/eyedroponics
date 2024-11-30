const upload = require('../config/multer.config')
const { io } = require('../services/socket.io')
const fs = require('fs')


const imageController = {
    
    uploadImage: upload.single('image'),

    postImage: async (req, res) => {
        try {
            const { file } = req
            if (!file) return res.status(400).send('No file uploaded')
            
            // respond earlier
            res.send({ txt: 'File uploaded successfully' })
            
            // Read the uploaded file as a buffer
            const imageBuffer = fs.readFileSync(file.path);

            // Detect pest in image
            

            // Emit the image buffer to WebSocket clients
            io.emit('image', imageBuffer);

            

        } catch (error) { res.status(500).send(error.toString()) }
    },

}


module.exports = imageController
