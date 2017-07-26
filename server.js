// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// DB Connection
mongoose.connect(process.env.MONGODB_URI);
var Schema = mongoose.Schema;
module.exports = Schema;

// var FeedItem = require('.models/feedItem.js');



// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the More2Life App API!' });
});

router.get('/feed', function (req, res) {

    // get all the feedItems
    // FeedItem.find({}, function(err, feedItems) {
    //     if (err) throw err;
    //
    //     // object of all the users
    //     console.log(feedItems);
    // });
})
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);