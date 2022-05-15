//Node imports
const {mergeResolvers} = require('@graphql-tools/merge');
//Custom imports
const indexResolver = require('./index');
const authResolver = require('./auth');
const userResolver = require('./user');
const rootResolver = [indexResolver,authResolver,userResolver];

module.exports = mergeResolvers(rootResolver);