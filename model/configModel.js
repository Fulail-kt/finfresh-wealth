const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
    directory:{type:String},
    interval:{type:String},
    magicString:{type:String}
});


module.exports = mongoose.model('Config',ConfigSchema);
