//Node imports
const {mergeResolvers} = require('@graphql-tools/merge');
//Custom imports
const indexResolver = require('./index');
const authResolver = require('./auth');
const userResolver = require('./user');
const fileResolver = require('./file');
const rootResolver = [indexResolver,authResolver,userResolver, fileResolver];

module.exports = mergeResolvers(rootResolver);