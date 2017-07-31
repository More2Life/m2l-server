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


