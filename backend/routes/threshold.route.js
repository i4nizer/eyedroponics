const express = require('express');
const router = express.Router({ mergeParams: true });

const { checkThresholdID } = require('../middlewares/req.middleware');
const { validatePatchThreshold } = require('../middlewares/threshold.middleware');

const { getThreshold, getThresholds, patchThreshold } = require('../controllers/threshold.controller');


router.route('/')
    .get(getThresholds)

router.route('/:thresholdId')
    .get(checkThresholdID, getThreshold)
    .patch(checkThresholdID, validatePatchThreshold, patchThreshold);


module.exports = router
