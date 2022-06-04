const {gql} = require('apollo-server-express');

module.exports = gql   `
    scalar Upload
    
    type File {
        url: String!
    }

    type FileResponse {
        ok: Boolean!
        data: File
        errors: [Error!]
    }
    
    extend type Mutation {
        uploadAvatar(file: Upload!): FileResponse!
    }
`