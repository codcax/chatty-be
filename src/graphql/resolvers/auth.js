//Node imports
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

//Custom imports
const User = require('../../models/user');
const {errorResponse, successResponse} = require('../../utils/response');

module.exports = {
    Query: {
        userLogin: async function (_,args) {
            try {
                const email = args.input.email;
                const password = args.input.password;
                const errors = [];

                if (!validator.isEmail(email) || validator.isEmpty(email)) {
                    errors.push({type: 'email', message: 'Email is invalid.', code: 422});
                }

                if (validator.isEmpty(password)) {
                    errors.push({type: 'password', message: 'Password is invalid.', code: 422});
                }

                if (errors.length > 0) {
                    return errorResponse(false, null, errors);
                }

                const user = await User.findOne({email: email});
                if (!user) {
                    return errorResponse(false, null, [{
                        type: 'authenticate',
                        message: 'Invalid credentials.',
                        code: 401
                    }]);
                }

                const matchPassword = await bcrypt.compare(password, user.password);

                if (!matchPassword) {
                    return errorResponse(false, null, [{
                        type: 'authenticate',
                        message: 'Invalid credentials.',
                        code: 401
                    }]);
                }

                const signedToken = await jwt.sign({email: user.email, userId: user._id}, 'random', {expiresIn: '1hr'});
                return successResponse(true, {token: signedToken, userId: user._id.toString()}, 200)

            } catch (error) {
                throw error;
            }
        }
    },
    Mutation: {
        userSignUp: async function (_,args) {
            try {
                const username = args.input.username;
                const email = args.input.email;
                const password = args.input.password;
                const confirmPassword = args.input.confirmPassword;
                const errors = [];

                if (validator.isEmpty(username) || !validator.isLength(username, {min: 6})) {
                    errors.push({type: 'username', message: 'Username is invalid.', code: 422});
                }

                if (!validator.isEmail(email) || validator.isEmpty(email)) {
                    errors.push({type: 'email', message: 'Email is invalid.', code: 422});
                }

                if (!validator.isLength(password, {min: 8, max: 32}) ||
                    !validator.matches(password, '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,32}$')) {
                    errors.push({type: 'password', message: 'Password is invalid.', code: 422});
                }

                if (password !== confirmPassword) {
                    errors.push({type: 'confirmPassword', message: 'Passwords does not match.', code: 422});
                }

                if (errors.length > 0) {
                    return errorResponse(false, null, errors);
                }

                const existingUser = await User.findOne({email: email});
                if (existingUser) {
                    return errorResponse(false, null, [{type: 'account', message: 'User already exists.', code: 422}]);
                }

                const hashedPassword = await bcrypt.hash(password, 12);
                const user = new User({
                    email: email,
                    username: username,
                    password: hashedPassword,
                    status: {
                        mode: 'Offline'
                    },

                });
                const userData = await user.save();
                if (!userData) {
                    return errorResponse(false, null, [{
                        type: 'account',
                        message: 'Account creation failed.',
                        code: 422
                    }]);
                }

                return successResponse(true, userData._doc, 201);
            } catch (error) {
                throw error;
            }
        }
    }
}