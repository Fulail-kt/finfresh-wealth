const express = require('express');
const router = express.Router();
const { stopTask, startTask , getTaskDetails,configData } = require('../controllers/controller');

router.get('/tasks', getTaskDetails);
router.post('/start', startTask);
router.post('/stop', stopTask);
router.put('/config', configData );

module.exports = router;
