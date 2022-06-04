//Node imports
const path = require('path');
const fs = require('fs');

//Custom imports
const User = require('../models/user');
const File = require('../models/file')

//Define constants

module.exports.createDataFolder = async (name, type, id) => {
    const dataFolderPath = `data/${type}s/`;
    const folderPath = path.join(__dirname, `../${dataFolderPath}/`);
    return fs.promises.mkdir(folderPath + name, {recursive: true})
        .then( () =>{
            return dataFolderPath + name;
        })
        .catch(error => {
            console.log(error);
        })
}

module.exports.createPublicFolder = async (name, type, id) => {
    const publicFolderPath = `public/${type}s/`;
    const folderPath = path.join(__dirname, `../${publicFolderPath}/`);
    return fs.promises.mkdir(folderPath + name, {recursive: true})
        .then( () =>{
            return publicFolderPath + name;
        })
        .catch(error => {
            console.log(error);
        })
}

