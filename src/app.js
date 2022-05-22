//Node imports
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const {ApolloServer} = require('apollo-server-express')

const typeDefs = require('./graphql/schemas/schemas');
const resolvers = require('./graphql/resolvers/resolvers');
const {graphQLError} = require('./utils/response');
const {ApolloServerPluginLandingPageDisabled} = require('apollo-server-core');
const jwt = require("jsonwebtoken");

const app = express();
const startApolloServer = async function startApolloServer(typeDefs, resolvers) {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        cors: false,
        graphiql: true,
        csrfPrevention: false,
        context: ({req}) => {
            const token = req.headers.authorization || '';
            if (token) {
                verifiedToken = jwt.verify(token.split(' ')[1], 'random');
                userId = verifiedToken.userId;
                return {userId};
            }
        },
        plugins: [
            ApolloServerPluginLandingPageDisabled(),
        ],
        formatError: (err) => {
            return graphQLError(err);
        }
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({app, path: '/graphql'});
}

//.env constants
const mongodb_uri = process.env.MONGODB_URI;
const port = process.env.PORT;

//Middlewares
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.APIURL);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Method', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

startApolloServer(typeDefs, resolvers);
app.use(express.static(path.join(__dirname + '/public')));

mongoose.connect(mongodb_uri)
    .then(() => {
        console.log('connected')
        app.listen(port);
    })
    .catch(error => {
        console.log(error)
    });