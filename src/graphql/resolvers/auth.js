//Node imports
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

//Custom imports
const User = require('../../models/user');
const {customError} = require('../../utils/errors');

module.exports = {
    userCreate: async function (args) {
        try {
            const username = args.input.username;
            const email = args.input.email;
            const password = args.input.password;
            const confirmPassword = args.input.confirmPassword;
            const errors = [];

            if (validator.isEmpty(username) || !validator.isLength(username, {min: 6})) {
                errors.push({type: 'username', message: 'Username is invalid.'});
            }

            if (!validator.isEmail(email) || validator.isEmpty(email)) {
                errors.push({type: 'email', message: 'Email is invalid.'});
            }

            if (!validator.isLength(password, {min: 8, max: 32}) ||
                !validator.matches(password, '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,32}$')) {
                errors.push({type: 'password', message: 'Password is invalid.'});
            }

            if (password !== confirmPassword) {
                errors.push({type: 'confirm-password', message: 'Password does not match.'});
            }

            if (errors.length > 0) {
                customError('Invalid inputs.', errors, 422);
            }

            const existingUser = await User.findOne({email: email});
            if (existingUser) {
                customError('User exists already.', null, 422);
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                email: email,
                username: username,
                password: hashedPassword
            });
            const userCreated = await user.save();
            if (!userCreated) {
                customError('User account creation failed.', null, 500);
            }
            return {message: 'User account created successfully.'};
        } catch (error) {
            throw error;
        }
    },
    userLogin: async function (args) {
        try {
            const email = args.input.email;
            const password = args.input.password;
            const errors = [];

            if (!validator.isEmail(email) || validator.isEmpty(email)) {
                errors.push({type: 'email', message: 'Email is invalid.'});
            }

            if (validator.isEmpty(password)) {
                errors.push({type: 'password', message: 'Password is invalid.'});
            }

            if (errors.length > 0) {
                customError('Invalid inputs.', errors, 422);
            }

            const user = await User.findOne({email: email});
            if (!user) {
                customError('User does not exist.', null, 401);
            }

            const matchPassword = await bcrypt.compare(password, user.password);

            if (!matchPassword) {
                customError('Invalid credentials.', null, 422);
            }

            const token = await jwt.sign({email: user.email, userId: user._id}, 'random', {expiresIn: '1hr'});
            return {message: 'Logged in successfully.', token: token};
        } catch (error) {
            throw error;
        }
    }
}