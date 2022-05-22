const {gql} = require('apollo-server-express');

module.exports = gql`
    type Error {
        message: String!
        code: Int!
        type: String!
    }
    
    type Query

    type Mutation
`