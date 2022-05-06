const {buildSchema} = require('graphql');

module.exports = buildSchema(`
type User {
  _id: ID!
  username: String!
  email: String!
  password: String
}
type userAuth {
  _id: ID!
  token: String!
  tokenExpiration: Int!
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
    userLogin(input: userLogin): userAuth
}
type RootMutation {
    userCreate(input: userCreate): User
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);