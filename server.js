// server.js

// IMPORTS
// =============================================================================
var express     = require('express');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var database    = require('./database/database');
var createError = require('http-errors');
var path        = require('path');

// MODELS
// =============================================================================
var FeedItem    = require('./models/feedItem').FeedItem;
var Story       = require('./models/story').Story;
var Listing     = require('./models/listing').Listing;
var Event       = require('./models/event').Event;

// CONTROLLERS
// =============================================================================
var feedItemController  = require ('./controllers/feedItemController').FeedItemController;
var listingController   = require ('./controllers/listingController').ListingController;
var eventController     = require ('./controllers/eventController').EventController;

// CONFIGURE APP
// =============================================================================
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// REGISTER OUR ROUTES
// =============================================================================
app.use(express.static(path.join(__dirname, 'web/build')));  // Serve static files from the React app

var router = express.Router();

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    console.log("called /api");
    res.json({ message: 'Welcome to the More2Life App API!' });
});

router.get('/feedItems', function (req, res) {
    console.log('GET Feed Items');

    feedItemController.getFeedItems(req, function(err, feedItems) {
        if(err) throw err;
        res.json(feedItems);
    });
});

// WEBHOOK ENDPOINTS
router.post('/webhooks/square', function (req, res) {
    console.log('POST from Square');
    console.log(req.body);
    var eventType = req.body.event_type;
    console.log('Event Type: ' + eventType);

    if (eventType == 'INVENTORY_UPDATED') {
        // TODO: handle notification
    } else if (eventType == 'TEST_NOTIFICATION') {
            console.log("TEST NOTIFICATION RECEIVED");
    }
    res.json({status:'success'});
});

router.post('/webhooks/shopify/product', function (req, res) {
    console.log('POST from Shopify');
    console.log(req.body);

    listingController.handleWebhook(req.body);

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
        res.json("That's not event.updated but thanks anyway.");
    }
});

app.use('/api', router);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'web/build', 'index.html'));
});

// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080;
app.listen(port);
console.log('Magic happens on port ' + port);
