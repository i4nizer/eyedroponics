const projectModel = require('../models/project.model')
const thresholdModel = require('../models/threshold.model')


const projectController = {

    getProject: async (req, res) => {
        try {
            const { userId } = req.token
            const { projectId } = req.params
            
            const project = await projectModel.find({ _id: projectId, userId, deleted: false })
            if (!project) return res.status(404).send('Project not found')
            
            res.send({ obj: project })
            
        } catch (error) { res.status(500).send(error.toString()) }
    },

    getProjects: async (req, res) => {
        try {
            const { userId } = req.token
            
            const projects = await projectModel.find({ userId, deleted: false })
            res.send({ obj: projects })
            
        } catch (error) { res.status(500).send(error.toString()) }
    },

    postProject: async (req, res) => {
        try {
            // access
            const { name } = req.body
            const { userId } = req.token
            
            // create project
            const project = new projectModel({ name, userId })
            await project.save()

            // create threshold for the project
            const threshold = new thresholdModel({ projectId: project._id, userId })
            await threshold.save()

            res.send({ txt: 'New project created', obj: { project, threshold } })

        } catch (error) { res.status(500).send(error.toString()) }
    },

    patchProject: async (req, res) => {
        try {
            const { name } = req.body
            const { userId } = req.token
            const { projectId } = req.params
            
            const project = await projectModel.findOneAndUpdate({ _id: projectId, userId, deleted: false }, { name }, { new: true })
            if (!project) return res.status(404).send('Project not found')
            
            res.send({ txt: 'Project updated', obj: project })

        } catch (error) { res.status(500).send(error.toString()) }
    },

    deleteProject: async (req, res) => {
        try {
            const { userId } = req.token
            const { projectId } = req.params

            // Mark as deleted
            const project = await projectModel.findOneAndUpdate({ _id: projectId, userId, deleted: false }, { deleted: true }, { new: true })
            if (!project) return res.status(404).send('Project not found')
            
            // As well as its threshold
            await thresholdModel.updateOne({ projectId: project._id }, { deleted: true })
            
            res.send({ txt: 'Project deleted' })
            
        } catch (error) { res.status(500).send(error.toString()) }
    },

}


module.exports = projectController