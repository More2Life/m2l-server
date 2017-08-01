// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var database = require('./database/database');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port


// MODELS
// =============================================================================
var FeedItem = require('./models/feedItem').FeedItem;
var Video = require('./models/video').Video;
var Listing = require('./models/listing').Listing;
var Event = require('./models/event').Event;

// CONTROLLERS
// =============================================================================
var feedItemController = require ('./controllers/feedItemController').FeedItemController;


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the More2Life App API!' });
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

router.get('/feedItems', function (req, res) {
    console.log('GET Feed Items');

    feedItemController.getFeedItems(req, function(err, feedItems) {
        if(err) throw err;
        res.json(feedItems);
    });
});

router.post('/eventbrite', function (req, res) {
    console.log('POST from Eventbrite');
    console.log(req);
    res.json(req);
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
