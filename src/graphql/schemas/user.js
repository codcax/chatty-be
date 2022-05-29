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
    
    input UpdateUsername{
        newUsername: String!
        password: String!
    }

    input UpdateEmail{
        newEmail: String!
        password: String!
    }
    
    input UpdatePassword{
        newPassword: String!
        newConfirmPassword: String!
        password: String!
    }

    type GetUserResponse {
        ok: Boolean!
        data: User
        errors: [Error!]
    }
    
    type UpdateUserResponse {
        ok: Boolean!
        errors: [Error!]
    }
    
    extend type Query {
        getUser: GetUserResponse!
    }
    
    extend type Mutation {
        updateUsername(input: UpdateUsername!): UpdateUserResponse!
        updateEmail(input: UpdateEmail!): UpdateUserResponse!
        updatePassword(input: UpdatePassword!): UpdateUserResponse!
    }
`