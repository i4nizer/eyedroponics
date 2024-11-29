const upload = require('../config/multer.config')


const imageController = {
    
    uploadImage: upload.single('image'),

    postImage: async (req, res) => {
        try {
            const { file } = req
            if (!file) return res.status(400).send('No file uploaded')

            res.send({ txt: 'File uploaded successfully' })
        } catch (error) { res.status(500).send(error.toString()) }
    },

}


module.exports = imageController
