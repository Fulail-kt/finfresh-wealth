const taskModel = require('../model/taskModel');
const { startWatcher,stop } = require('../services/runTask');


// const getConfig = (req, res) => res.json(currentConfig);

const updateConfig = (req, res) => {
  const { directory, interval, magicString } = req.body;
  if (directory) currentConfig.directory = directory;
  if (interval) currentConfig.interval = interval;
  if (magicString) currentConfig.magicString = magicString;
  scheduleTask(currentConfig.directory, currentConfig.interval, currentConfig.magicString);
  res.json(currentConfig);
};


// function for get all task details

const getTaskDetails = async (req, res) => {
  try {
    const taskRuns = await taskModel.find().sort({ startTime: -1 });
    res.json(taskRuns);
  } catch (error) {
    console.error('Error fetching task details:', error);
    res.status(500).json({ error: 'Failed to fetch task details' });
  }
};


// function to start the task monitoring

const startTask = async (req, res) => {
  try {
    await startWatcher();
    res.json({ message: 'Task started' });
  } catch (error) {
    console.error('Error starting task:', error);
    res.status(500).json({ error: 'Failed to start task' });
  }
};

// function to Stop monitoring

const stopTask = async (req, res) => {
  try {
    stop();
    res.json({ message: 'Task stopped' });
  } catch (error) {
    console.error('Error stopping task:', error);
    res.status(500).json({ error: 'Failed to stop task' });
  }
};



module.exports = { startTask, stopTask ,getTaskDetails };
