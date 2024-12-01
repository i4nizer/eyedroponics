const express = require('express');
const router = express.Router({ mergeParams: true });

const sensorRoutes = require('./sensor.route')
const deviceRoutes = require('./device.route')
const thresholdRoutes = require('./threshold.route')

const { checkProjectID } = require('../middlewares/req.middleware');
const { validatePostProject, validatePatchProject } = require('../middlewares/project.middleware');

const { getDevices } = require('../controllers/device.controller')
const { getThresholds } = require('../controllers/threshold.controller')
const { getProject, getProjects, postProject, patchProject, deleteProject } = require('../controllers/project.controller');


router.route('/')   
    .get(getProjects)
    .post(validatePostProject, postProject);

router.use('/sensor', sensorRoutes);

router.get('/device', getDevices)
router.get('/threshold', getThresholds)

router.route('/:projectId')
    .get(checkProjectID, getProject)
    .patch(checkProjectID, validatePatchProject, patchProject)
    .delete(checkProjectID, deleteProject);

router.use('/:projectId/device', checkProjectID, deviceRoutes)
router.use('/:projectId/threshold', checkProjectID, thresholdRoutes)


module.exports = router;
