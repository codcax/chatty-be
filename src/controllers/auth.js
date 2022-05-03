//Node imports
const bcrypt = require('bcryptjs');
const validator = require('validator');

//Custom imports
const User = require('../models/user');

exports.postSignUp = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = [];

    if (!username || validator.isEmpty(username) || !validator.isLength(username, ({min: 6}, {max: 18}))) {
        errors.push({
            type: 'username',
            message: 'Invalid username.'
        });
    }

    if (!email || validator.isEmpty(email) || !validator.isEmail(email)) {
        errors.push({
            type: 'email',
            message: 'Invalid email.'
        });
    }

    if (!password || validator.isEmpty(password) || !validator.isLength(username, ({min: 8}, {max: 32})) || !validator.matches(password, '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,32}$')) {
        errors.push({
            type: 'password',
            message: 'Invalid password.'
        });
    }

    if (!confirmPassword || validator.isEmpty(confirmPassword) || confirmPassword !== password) {
        errors.push({
            type: 'confirmPassword',
            message: 'Password does not match.'
        });
    }

    if (errors.length > 0) {
        return res.status(422).json({
            message: 'Invalid inputs.',
            error: errors
        })
    }

    User.findOne({email: email})
        .then(user => {
            if (user) {
                return res.status(402).json({
                    type: 'user',
                    message: 'User already exists.'
                })
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        username: username,
                        email: email,
                        password: hashedPassword,
                    });
                    return user.save();
                })
                .then(result => {
                    res.status(201).json({
                        message: 'User account created successfully.',
                        result: result
                    });
                })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        });
};