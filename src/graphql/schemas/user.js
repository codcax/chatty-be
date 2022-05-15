const {gql} = require('apollo-server-express');

module.exports = gql`
    type User {
        username: String
        email: String
        status: Status
        avatar: String
        description: String
    }

    type Status{
        mode: String
        duration: Int
        setTime: String
    }

    type GetUserResponse {
        ok: Boolean
        data: User
        errors: [Error]
    }

    input userId {
        userId: String
    }
    
    extend type Query {
        getUser: GetUserResponse!
    }
`