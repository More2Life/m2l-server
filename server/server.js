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
var Donation    = require('./models/donation').Donation;

// CONFIGURE APP
// =============================================================================
var app         = express();
var api         = require ('./routes/api');
var webhooks    = require('./routes/webhooks');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// REGISTER OUR ROUTES
// =============================================================================
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

// SECRET VERIFICATION
// =============================================================================

const SHOPIFY_SHARED_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

app.use(bodyParser.json({
    verify: function(req, res, buf, encoding) {
        if (req.url.search('api/webhooks/shopify/') >= 0) {
            console.log("CHECKING SECRET");
            var calculated_signature = crypto.createHmac('sha256', SHOPIFY_SHARED_SECRET)
                .update(buf)
                .digest('base64');
            if (calculated_signature != req.headers['x-shopify-hmac-sha256']) {
                throw new Error('Invalid signature. Access denied');
            }
        }
    }
}));