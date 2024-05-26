const taskModel = require('../model/taskModel');
const configModel = require('../model/configModel');
const { startWatcher, stop } = require('../services/runTask');
const { validationResult } = require('express-validator');


// function for get all task details

const getTaskDetails = async (req, res) => {
  try {
    const taskRuns = await taskModel.find().sort({ startTime: -1 });
    if(taskRuns.length<1){
      return res.json({message:'not have any history'})
    }
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

// function to Update configuration Data

const configData = async (req, res) => {
  const { directory, interval, magicString } = req.body;

  if (!directory || typeof directory !== 'string' || !directory.trim()) {
    return res.status(400).json({ error: 'Directory is required' });
  }
  if (!interval || typeof interval !== 'string' || !interval.trim()) {
    return res.status(400).json({ error: 'Interval is required' });
  }
  if (!magicString || typeof magicString !== 'string' || !magicString.trim()) {
    return res.status(400).json({ error: 'Magic String is required' });
  }


  const trimmedDirectory = directory.trim();
  const trimmedInterval = interval.trim();
  const trimmedMagicString = magicString.trim();

  try {
    const config = await configModel.findOneAndUpdate(
      {},
      { directory: `./${trimmedDirectory}`, interval: `*/${trimmedInterval} * * * *`, magicString: trimmedMagicString },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(config)

    res.json({ message: 'Configuration updated successfully', config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { startTask, stopTask, getTaskDetails, configData };
