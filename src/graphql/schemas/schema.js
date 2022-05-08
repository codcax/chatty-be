const {buildSchema} = require('graphql');

module.exports = buildSchema(`
type User {
  _id: ID!
  username: String!
  email: String!
  password: String
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

type RootQuery {
    userLogin(input: userLogin): LoginResponse!
}

type RootMutation {
    userSignUp(input: userCreate): SignUpResponse!
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);