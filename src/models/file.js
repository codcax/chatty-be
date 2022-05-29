//Node imports
const mongoose = require('mongoose');

//Custom Imports
const User = require('./user');

//Define constants
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    category:{
        type: String,
        enum: ['User', 'Room', 'Channel'],
        default: 'User'
    },
    permission:{
        type: String,
        enum: ['Data', 'Public'],
        default: 'Public'
    },
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true,
    },
    createdBy:{
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    createdDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('File', fileSchema);