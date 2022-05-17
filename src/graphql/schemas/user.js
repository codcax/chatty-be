const {gql} = require('apollo-server-express');

module.exports = gql`
    type User {
        username: String!
        email: String!
        status: Status!
        avatar: String
        description: String
        phoneNumber: String
    }

    type Status{
        mode: String!
        tagline: String!
        duration: Int
        setTime: String
    }

    type GetUserResponse {
        ok: Boolean!
        data: User
        errors: [Error!]
    }
    
    extend type Query {
        getUser: GetUserResponse!
    }
`