const express = require('express');
const router = express.Router();
const { stopTask, startTask , getTaskDetails } = require('../controllers/controller');

router.get('/tasks', getTaskDetails);
// router.post('/update', updateConfig);
router.post('/start', startTask);
router.post('/stop', stopTask);

module.exports = router;
