var mongoose = require('mongoose');

// DB Connection
const connectionURI = process.env.IS_PRODUCTION ? process.env.MONGODB_URI : process.env.MONGODB_URI_TEST;
console.log(connectionURI);
mongoose.connect(connectionURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to db');
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
// process.on('SIGINT', function() {
//     mongoose.connection.close(function () {
//         console.log('Mongoose default connection disconnected through app termination');
//         process.exit(0);
//     });
// });

// SCHEMAS & MODELS
require('./../models/feedItem');


