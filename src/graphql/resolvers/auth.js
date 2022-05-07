//Node imports
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

//Custom imports
const User = require('../../models/user');
const {errorResponse, successResponse} = require('../../utils/response');

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
                errorResponse('Invalid inputs.', errors, 422);
            }

            const existingUser = await User.findOne({email: email});
            if (existingUser) {
                errorResponse('User exists already.', null, 422);
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                email: email,
                username: username,
                password: hashedPassword
            });
            const userData = await user.save();
            if (!userData) {
                errorResponse('User account creation failed.', null, 500);
            }

            return successResponse('User account created successfully.', userData._doc, 201);
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
                errorResponse('Invalid inputs.', errors, 422);
            }

            const user = await User.findOne({email: email});
            if (!user) {
                errorResponse('User does not exist.', null, 401);
            }

            const matchPassword = await bcrypt.compare(password, user.password);

            if (!matchPassword) {
                errorResponse('Invalid credentials.', null, 422);
            }

            const jwtToken = await jwt.sign({email: user.email, userId: user._id}, 'random', {expiresIn: '1hr'});
            const data = successResponse('Logged in successfully.', {token: jwtToken, _id: user._id.toString()}, 201)
            console.log(data)
            return data;
        } catch (error) {
            throw error;
        }
    }
}