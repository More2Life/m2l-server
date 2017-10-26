// server.js

// IMPORTS
// =============================================================================
var express     = require('express');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var database    = require('./database/database');
var createError = require('http-errors');
var path        = require('path');
var crypto      = require('crypto');

// MODELS
// =============================================================================
var FeedItem    = require('./models/feedItem').FeedItem;
var Story       = require('./models/story').Story;
var Listing     = require('./models/listing').Listing;
var Event       = require('./models/event').Event;
var Donation    = require('./models/donation').Donation;

// CONFIGURE APP
// =============================================================================
var app         = express();

app.use((req, res, next) => {

    req.rawBody = '';
    req.on('data', function(chunk) {
        req.rawBody += chunk;
    });

    req.on('end', function() {
        // Validate shopify webhook token. If the hashes don't match, reject the request
        if (/.*\/shopify\/.*/.test(req.url)) {
            const SHOPIFY_SHARED_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
            var calculated_signature = crypto.createHmac('sha256', SHOPIFY_SHARED_SECRET)
                .update(req.rawBody)
                .digest('base64');
            if (calculated_signature != req.headers['x-shopify-hmac-sha256']) {
                res.status(403).json({error: "Access Denied"});
                throw new Error('Invalid signature. Access denied');
            }
        }
    });

    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// REGISTER OUR ROUTES
// =============================================================================
var api         = require ('./routes/api');
var webhooks    = require('./routes/webhooks');
app.use(express.static(path.join(__dirname, '../web/build')));  // Serve static files from the React app

app.use('/api', api);
app.use('/api/webhooks', webhooks);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../web/build', 'index.html'));
});

// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080;
app.listen(port);
console.log('Magic happens on port ' + port);
