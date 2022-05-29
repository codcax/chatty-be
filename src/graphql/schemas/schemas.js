//Node imports
const {mergeTypeDefs} = require('@graphql-tools/merge');

//Custom imports
const authSchema = require('./auth');
const indexSchema = require('./index');
const userSchema = require('./user');
const fileSchema = require('./file');

const rootSchemas = [indexSchema, authSchema, userSchema, fileSchema];

module.exports = mergeTypeDefs(rootSchemas);