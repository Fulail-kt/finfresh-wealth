
const cron = require('node-cron');
const fs = require('fs');
const chokidar = require('chokidar');
const path = require('path');
const config = require('../config/default.json');
const TaskModel = require('../model/taskModel');
const ConfigModel = require('../model/configModel');

let task;
let watcher;

let directory;
let interval;
let magicString;

// Function to get and set configuration values from the database
const getConfig = async () => {
  try {
    const config = await ConfigModel.findOne();
    if (config) {
      directory = path.resolve(__dirname, '..', config.directory);
      interval = config.interval;
      magicString = config.magicString;

      console.log(config)
    } else {
      console.error('No configuration found in the database');
    }
  } catch (error) {
    console.error('Error fetching configuration:', error.message);
  }
};

// File tracking data
let existingFiles = [];
let initialFiles = [];


// count occurrences of the magic string in a file

function countMagicStringOccurrences(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const regex = new RegExp(magicString, 'g');
  return (fileContent.match(regex) || []).length;
}


console.log(existingFiles, "before run")

async function runTask() {
  try {
    const startTime = new Date();
    const filesAdded = [];
    const filesDeleted = [];

    console.log(existingFiles, initialFiles, "inif", filesAdded, "add", filesDeleted, "delet")

    // Calculate files added since last run

    const addedFiles = existingFiles.filter(file => !initialFiles.includes(file));
    filesAdded.push(...addedFiles);

    // Calculate files deleted since last run

    const deletedFiles = initialFiles.filter(file => !existingFiles.includes(file));
    filesDeleted.push(...deletedFiles);

    console.log(initialFiles, "inif", filesAdded, "add", filesDeleted, "delet")


    // Calculate magic string count

    let magicStringCount = 0;
    for (const file of existingFiles) {
      magicStringCount += countMagicStringOccurrences(file);
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    // Save task run details to the database
    const taskData = new TaskModel({
      startTime,
      endTime: new Date(),
      duration,
      filesAdded,
      filesDeleted,
      magicStringCount,
      status: 'success',
      directory,
      interval,
      magicString,
    });


    console.log(existingFiles, "after run")

    await taskData.save();

    console.log('Task completed successfully');
  } catch (err) {
    console.error('Error running task:', err);
  }
}


async function startWatcher() {
  console.log('start watcher')
  await getConfig()
  watcher = chokidar.watch(directory, { persistent: true });

  // Event listener for file addition

  watcher.on('add', (filePath) => {
    existingFiles.push(filePath);
    console.log('File added:', filePath);
  });

  // Event listener for file deletion

  watcher.on('unlink', (filePath) => {
    existingFiles = existingFiles.filter(file => file !== filePath);
    console.log('File deleted:', filePath);
  });

  console.log(existingFiles)

  // Start the background task when watcher is ready

  watcher.on('ready', () => {
    initialFiles = [...existingFiles];
    console.log(`Watcher initialized. Monitoring directory: ${directory}`);
    start();
  });

  // Handle watcher errors
  watcher.on('error', (error) => {
    console.error('Watcher error:', error);
  });
}

// Start the background task
function start() {
  task = cron.schedule(interval, runTask);
  console.log(`Background task started`);
  console.log(existingFiles, "start")
}

// Stop the background task
function stop() {
  if (watcher) {
    watcher.close();
  }
  if (task) {
    task.stop();
    console.log('Background task stopped');
  }
}

process.on('exit', () => {
  stop();
});

module.exports = { startWatcher, stop };
