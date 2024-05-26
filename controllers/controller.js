const taskModel = require('../model/taskModel');
const configModel = require('../model/taskModel');
const { startWatcher, stop } = require('../services/runTask');


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

// 

const configData = async (req, res) => {
  try {
    let { directory, interval, magicString } = req.body;

    const config = await configModel.findOneAndUpdate(
      {},
      { directory: `./${directory}`, interval: `*/${interval} * * * *`, magicString },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ message: 'Configuration updated successfully', config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { startTask, stopTask, getTaskDetails, configData };
