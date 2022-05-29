//Node imports
const path = require('path');
const {createWriteStream} = require('fs');

//Custom imports
const User = require('../models/user');
const File = require('../models/file')
const {response} = require("express");

//Define constants
const allowedImageMimeTypes = ['image/jpg', 'image/png', 'image/jpeg'];

module.exports.createPublicFile = async (file, type, id, fileCategory) => {
    try {
        let {ext, name} = path.parse(file.filename);
        const stream = file.createReadStream();

        if (fileCategory === 'image') {
            if (!allowedImageMimeTypes.includes(file.mimetype)) {
                return {'ok': false, 'error': 'File type not allowed.'}
            }
        }

        name = name.replace(/([^a-z0-9 ]+)/gi, '-').replace(' ', '_');
        name = `${name}-${Date.now()}${ext}`;

        const publicFolderPath = `public/${type}s/${id}/`;
        let serverFile = path.join(__dirname, `../${publicFolderPath}${name}`);
        let writeStream = await createWriteStream(serverFile);
        return new Promise((resolve, reject) =>
            stream.pipe(writeStream)
                .on('finish', () => {
                    resolve({'filename': name, 'path': publicFolderPath, 'id': id, 'ok': true});
                })
                .on('error', (error) => {
                    resolve({'ok': false, 'error': error});
                })
        );
    } catch (error) {
        console.log(error);
    }
}