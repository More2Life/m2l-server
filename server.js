// server.js

// BASE SETUP
// =============================================================================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');

var mongoose    = require('mongoose');
var database    = require('./database/database');
var createError = require('http-errors');
var path = require('path');
var generatePassword = require('password-generator');

// MODELS
// =============================================================================
var FeedItem = require('./models/feedItem').FeedItem;
var Story = require('./models/story').Story;
var Listing = require('./models/listing').Listing;
var Event = require('./models/event').Event;

// CONTROLLERS
// =============================================================================
var feedItemController = require ('./controllers/feedItemController').FeedItemController;
var listingController = require ('./controllers/listingController').ListingController;
var eventController = require ('./controllers/eventController').EventController;

// CONFIGURE APP
// =============================================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// REGISTER OUR ROUTES
// =============================================================================
app.use(express.static(path.join(__dirname, 'web/build')));  // Serve static files from the React app

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
app.get('/api', function(req, res) {
    res.json({ message: 'Welcome to the More2Life App API!' });
});

//web demo
app.get('/api/passwords', (req, res) => {
  const count = 5;
  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  )
  // Return them as json
  res.json(passwords);
  console.log(`Sent ${count} passwords`);
});

app.get('/api/feedItems', function (req, res) {
    console.log('GET Feed Items');

    feedItemController.getFeedItems(req, function(err, feedItems) {
        if(err) throw err;
        res.json(feedItems);
    });
});

// WEBHOOK ENDPOINTS
app.post('/api/webhooks/square', function (req, res) {
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

app.post('/api/webhooks/shopify/product', function (req, res) {
    console.log('POST from Shopify');
    console.log(req.body);

    listingController.handleWebhook(req.body);

    res.json({status:'success'});
});

app.post('/api/webhooks/eventbrite/create', function (req, res, next) {
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

app.post('/api/webhooks/eventbrite/update', function (req, res, next) {
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
