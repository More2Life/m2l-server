// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var database = require('./database/database');
var createError = require('http-errors');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port


// MODELS
// =============================================================================
var FeedItem = require('./models/feedItem').FeedItem;
var Story = require('./models/story').Story;
var Listing = require('./models/listing').Listing;
var Event = require('./models/event').Event;
var Donation = require('./models/donation').Donation;

// CONTROLLERS
// =============================================================================
var feedItemController = require ('./controllers/feedItemController').FeedItemController;
var listingController = require ('./controllers/listingController').ListingController;
var eventController = require ('./controllers/eventController').EventController;
var donationController = require ('./controllers/donationController').DonationController;
var donationBucketController = require ('./controllers/donationBucketController').DonationBucketController;


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

// WEBHOOK ENDPOINTS
// =============================================================================

router.post('/webhooks/shopify/product', function (req, res) {
    console.log('POST from Shopify');
    console.log(req.body);

    if (req.body.product_type == "Donation-Bucket") {
        donationBucketController.handleWebhook(req.body);
    } else if (req.body.product_type == "Donation") {
        donationController.handleWebhook(req.body);
    } else {
        listingController.handleWebhook(req.body);
    }

    res.json({status:'success'});
});

router.post('/webhooks/shopify/product/delete', function (req, res) {
    console.log('POST from Shopify');
    console.log(req.body);

    if (req.body.product_type == "Donation") {
        listingController.deleteDonation(req.body);
    } else {
        listingController.deleteListing(req.body);
    }

    res.json({status:'success'});
});

router.post('/webhooks/eventbrite/create', function (req, res, next) {
    console.log('POST on /eventbrite/create');
    console.log(req.body);

    if (req.body.config.action == 'test') {
        res.json("Test notification. Good job; it works.");
    } else if (req.body.config.action == 'event.created') {
        eventController.createFromEventbrite(req.body.api_url, function(err) {
            if (err) {
                return next(err);
            }
            res.json("Thanks, Eventbrite. We'll take care of it from here.");
        });
    } else {
        res.json("That's not event.created but thanks anyway.");
    }
});

router.post('/webhooks/eventbrite/update', function (req, res, next) {
    console.log("POST on /eventbrite/update");
    console.log(req.body);

    if (req.body.config.action == 'test') {
        res.json("Test notification. Good job; it works.");
    } else if (req.body.config.action == 'event.updated') {
        eventController.updateFromEventbrite(req.body.api_url, function(err) {
            if (err) {
                return next(err);
            }
            res.json("Thanks, Eventbrite. We'll take care of it from here.");
        });
    } else {
        res.json("That's not event.created but thanks anyway.");
    }
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
