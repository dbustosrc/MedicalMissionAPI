const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const express = require('express');
const routes = require('./routes/routes');
const errorHandler = require('errorhandler');
const cors = require('cors');

module.exports = app => {
    
    // Settings
    app.set('port', process.env.PORT || 3000);
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    
        next();
    })

    // Middlewares
    app.use(cors());
    app.use(morgan('dev'));
    app.use(multer({
        dest: path.join(__dirname, '../public/uploads/temp')
    }).single('ímage'));
    app.use(express.urlencoded({
        extended: false
    }));
    app.use(express.json());

    // Routes
    routes(app);

    // Static files
    app.use('public', express.static(path.join(__dirname, '../public')));

    // ErrorHandlers
    if ('development' === app.get('env')){
        app.use(errorHandler);
    }

    return app;
}