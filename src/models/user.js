//Node imports
const mongoose = require('mongoose');

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
    status: {
        mode: {
            type: String,
            enum: ['Online', 'Offline', 'Idle', 'Do Not Disturb', 'Invisible'],
            default: 'Offline'
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
    }
});

module.exports = mongoose.model('User', userSchema);