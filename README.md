# File Watcher Service

This project is a file watcher service that monitors a specified directory for file additions and deletions, 
counts the occurrences of a specified magic string within the files, and saves task run details to a database. 
It uses Express for handling API requests, Chokidar for watching the directory, and Node-Cron for scheduling tasks.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Models](#models)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/fulail-kt/finfresh-wealth.git
   cd finfresh-wealth
 
2. Install the dependencies:

   ```sh
   npm install
   ```

3. Setup Envoirment variables:

   ```sh
   PORT : "Server Port Number"
   MONGO_URI = "Your Db Connection URI"

## Usage

1. Start Server:

   ```sh
   npm start

## API Endpoints

1. Start Task
   - URL: `/start`
   - Method: `POST`
   - exp: `http://localhost:PORT/api/start`

2. Stop Task
   - URL: `/stop`
   - Method: `POST`

3. Update Configuration
   - URL: `/config`
   - Req.body: `{ "directory": "Directory path name to monitor", "interval": "Intervals", "magicString": "String name" }`


## Models

1. **TaskModel**
   - `startTime`: Date
   - `endTime`: Date
   - `duration`: Number
   - `filesAdded`: Array of Strings
   - `filesDeleted`: Array of Strings
   - `magicStringCount`: Number
   - `status`: String
   - `directory`: String
   - `interval`: String
   - `magicString`: String

2. **ConfigModel**
   - `directory`: String
   - `interval`: String
   - `magicString`: String


