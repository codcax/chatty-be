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
                };

                const userId = context.userId;
                const user = await User.findById(userId).select({'password': false, '_id': false, 'isLoggedIn': false, 'isAccountDisabled': false});
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
}