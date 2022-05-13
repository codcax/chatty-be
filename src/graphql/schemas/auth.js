const {gql} = require('apollo-server-express');

module.exports = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
    }

    type UserAuth {
        userId: ID!
        token: String!
    }

    type Error {
        message: String!
        code: Int!
        type: String!
    }

    type SignUpResponse {
        ok: Boolean!
        data: User
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

    type Query {
        userLogin(input: userLogin!): LoginResponse!
    }

    type Mutation {
        userSignUp(input: userCreate!): SignUpResponse!
    }
`