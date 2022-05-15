//Node imports
const {mergeTypeDefs} = require('@graphql-tools/merge');

//Custom imports
const authSchema = require('./auth');
const indexSchema = require('./index');
const userSchema = require('./user');

const rootSchemas = [indexSchema, authSchema, userSchema];

module.exports = mergeTypeDefs(rootSchemas);