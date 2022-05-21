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

                return successResponse(true, updateUser, 200)
            } catch (error) {
                throw error;
            }

        },
        updateUserEmail: async function (_, args, context) {

        },
        updateUserPassword: async function (_, args, context) {

        }
    }
}