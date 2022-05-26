const {gql} = require('apollo-server-express');

module.exports = gql`
    type UserAuth {
        userId: ID!
        token: String!
        expiresIn: Int!
    }

    type SignUpResponse {
        ok: Boolean!
        data: String
        errors: [Error!]
    }

    type LoginResponse {
        ok: Boolean!
        data: UserAuth
        errors: [Error!]
    }

    input userCreate {
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }

    input userLogin {
        email: String!
        password: String!
    }

    extend type Query {
        userLogin(input: userLogin!): LoginResponse!
    }

    extend type Mutation {
        userSignUp(input: userCreate!): SignUpResponse!
    }
`