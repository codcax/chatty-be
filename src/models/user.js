//Node imports
const mongoose = require('mongoose');

//Custom imports
const File = require('./file');

//Define constants
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    isLoggedIn: Boolean,
    isAccountDisabled: Boolean,
    status: {
        mode: {
            type: String,
            enum: ['Online', 'Offline', 'Idle', 'Do Not Disturb', 'Invisible'],
            default: 'Offline'
        },
        tagline: {
            type: String
        },
        duration: {
            type: Number
        },
        setTime: {
            type: Date
        }
    },
    avatar: {
        type: String
    },
    description: {
        type: String
    },
    folder: {
        public: {
            type: String || null
        },
        data: {
            type: String || null
        }
    },
    files: [{
        type: Schema.Types.ObjectId, ref: 'File'
    }]
});

module.exports = mongoose.model('User', userSchema);