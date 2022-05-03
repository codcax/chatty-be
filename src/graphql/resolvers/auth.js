//Node imports
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

//Custom imports
const User = require('../../models/user');

module.exports = {
    userCreate: async function (args, req) {
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
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const existingUser = await User.findOne({email: email});
        if (existingUser) {
            const error = new Error('User exists already!')
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            username: username,
            password: hashedPassword
        });
        const userCreated = await user.save();
        return {...userCreated._doc, _id: userCreated._id.toString()};
    }
}
