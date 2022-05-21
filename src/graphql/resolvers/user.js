//Node imports
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

//Custom imports
const User = require('../../models/user');
const {errorResponse, successResponse} = require('../../utils/response');

module.exports = {
    Query: {
        getUser: async function (_, args, context) {
            try {
                if (!context.userId) {
                    return errorResponse(false, null, [{
                        type: 'authenticate',
                        message: 'Not authorized.',
                        code: 403
                    }]);
                }
                ;

                const userId = context.userId;
                const user = await User.findById(userId).select({
                    'password': false,
                    '_id': false,
                    'isLoggedIn': false,
                    'isAccountDisabled': false
                });
                if (!user) {
                    return errorResponse(false, null, [{
                        type: 'authenticate',
                        message: 'User not found.',
                        code: 401
                    }]);
                }
                return successResponse(true, user, 200)
            } catch (error) {
                throw error;
            }
        }
    },
    Mutation: {
        updateUsername: async function (_, args, context) {
            try {
                if (!context.userId) {
                    return errorResponse(false, null, [{
                        type: 'authenticate',
                        message: 'Not authorized.',
                        code: 403
                    }]);
                }

                const userId = context.userId;
                const newUsername = args.input.newUsername;
                const password = args.input.password;
                const errors = [];

                if (validator.isEmpty(newUsername) || !validator.isLength(newUsername, {min: 6})) {
                    errors.push({
                        type: 'username',
                        message: 'Must be alphanumeric between 6 and 18 in length.',
                        code: 422
                    });
                }

                if (errors.length > 0) {
                    return errorResponse(false, null, errors);
                }

                const user = await User.findById(userId);
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

                const updateUser = await User.findByIdAndUpdate(userId, {username: newUsername}, {new: true});

                if (!updateUser) {
                    return errorResponse(false, null, [{
                        type: 'authenticate',
                        message: 'User not found.',
                        code: 401
                    }]);
                }

                return successResponse(true, null, 200)
            } catch (error) {
                throw error;
            }

        },
        updateEmail: async function (_, args, context) {
            try {
                if (!context.userId) {
                    return errorResponse(false, null, [{
                        type: 'authenticate',
                        message: 'Not authorized.',
                        code: 403
                    }]);
                }

                const userId = context.userId;
                const newEmail = args.input.newEmail;
                const password = args.input.password;
                const errors = [];

                if (validator.isEmpty(newEmail) || !validator.isEmail(newEmail)) {
                    errors.push({
                        type: 'email',
                        message: 'Please enter valid email address.',
                        code: 422
                    });
                }

                if (errors.length > 0) {
                    return errorResponse(false, null, errors);
                }

                const users = await User.find({email: newEmail});
                let user;
                if (users) {
                    users.forEach(fetchedUser => {
                        if (fetchedUser._id.toString() !== userId) {
                            return errorResponse(false, null, [{
                                type: 'email',
                                message: 'Email already exists.',
                                code: 422
                            }]);
                        }
                        user = fetchedUser;
                    })
                }

                const matchPassword = await bcrypt.compare(password, user.password);

                if (!matchPassword) {
                    return errorResponse(false, null, [{
                        type: 'authenticate',
                        message: 'Invalid credentials.',
                        code: 401
                    }]);
                }

                const updateUser = await User.findByIdAndUpdate(userId, {email: newEmail}, {new: true});

                if (!updateUser) {
                    return errorResponse(false, null, [{
                        type: 'authenticate',
                        message: 'User not found.',
                        code: 401
                    }]);
                }

                return successResponse(true, null, 200)
            } catch (error) {
                throw error;
            }

        },
        updatePassword: async function (_, args, context) {
            try {
                if (!context.userId) {
                    return errorResponse(false, null, [{
                        type: 'authenticate',
                        message: 'Not authorized.',
                        code: 403
                    }]);
                }

                const userId = context.userId;
                const newPassword = args.input.newPassword;
                const newConfirmPassword = args.input.newConfirmPassword;
                const password = args.input.password;
                const errors = [];

                if (!validator.isLength(newPassword, {min: 8, max: 32}) ||
                    !validator.matches(newPassword, '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,32}$')) {
                    errors.push({type: 'password', message: 'Password is invalid.', code: 422});
                }

                if (newPassword !== newConfirmPassword) {
                    errors.push({type: 'confirmPassword', message: 'Passwords does not match.', code: 422});
                }

                if (errors.length > 0) {
                    return errorResponse(false, null, errors);
                }

                const user = await User.findById(userId);

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

                const hashedPassword = await bcrypt.hash(newPassword, 12);
                const updateUser = await User.findByIdAndUpdate(userId, {password: hashedPassword}, {new: true});

                if (!updateUser) {
                    return errorResponse(false, null, [{
                        type: 'authenticate',
                        message: 'User not found.',
                        code: 401
                    }]);
                }

                return successResponse(true, null, 200)
            } catch (error) {
                throw error;
            }
        }
    }
}