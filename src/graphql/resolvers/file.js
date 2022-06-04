//Node imports
const validator = require('validator');
const GraphQLUpload = require('graphql-upload/GraphQLUpload.js');

//Custom imports
const User = require('../../models/user');
const File = require('../../models/file');
const {createPublicFile} = require('../../utils/file');
const {errorResponse, successResponse} = require('../../utils/response');
const path = require("path");

module.exports = {
    Upload: GraphQLUpload,
    Mutation: {
        uploadAvatar: async function (parent, args, context) {
            try {
                if (!context.userId) {
                    return errorResponse(false, null, [{
                        type: 'authenticate',
                        message: 'Not authorized.',
                        code: 403
                    }]);
                }

                const file = await args.file
                const userId = context.userId;
                let fileData;

                const uploadFile = await createPublicFile(file, 'user', userId, 'image');
                if (uploadFile.ok === false) {
                    return errorResponse(false, null, [{
                        type: 'file-upload',
                        message: uploadFile.error,
                        code: 400
                    }]);
                }

                if (uploadFile.ok === true) {
                    const file = new File({
                        category: 'User',
                        permission: 'Public',
                        name: uploadFile.filename,
                        path: uploadFile.path + uploadFile.filename,
                        createdBy: uploadFile.id,
                        createdDate: Date.now()
                    })

                    fileData = await file.save();

                    if (fileData) {
                        await User.findByIdAndUpdate(userId, {
                                avatar: uploadFile.path + uploadFile.filename,
                                files: [
                                    fileData._id
                                ]
                            }
                        );
                    }
                }

                return successResponse(true, {url: fileData.path}, 200);
            } catch (error) {
                throw error;
            }
        }
    }
}