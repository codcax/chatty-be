//Node imports
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

//.env constants
const mongodb_uri = process.env.MONGODB_URI;
const port = process.env.PORT;

//Middlewares
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.APIURL);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Method', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
    next();
})
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname + '/public')));

// const server = app.listen(port);

mongoose.connect(mongodb_uri)
    .then(() => {
        console.log('connected')
        app.listen(port);
    })
    .catch(error => {
        console.log(error)
    });