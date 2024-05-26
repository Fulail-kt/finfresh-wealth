const express = require('express');
const connectDB = require('./utils/db');
const routes = require('./routes/route');
require('dotenv').config();
const app = express();


app.use(express.json());
app.use('/api', routes);

const port = process.env.PORT || 3000
app.listen(port, () => {
    connectDB()
    console.log(`Server running on port ${port}`);
});
