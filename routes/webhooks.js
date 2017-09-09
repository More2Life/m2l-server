var express = require('express');
var router = express.Router();

var listingController   = require ('../controllers/listingController').ListingController;
var eventController     = require ('../controllers/eventController').EventController;

router.post('/shopify/product', function (req, res) {
    console.log('POST from Shopify');
    console.log(req.body);

    listingController.handleWebhook(req.body);

    res.json({status:'success'});
});

router.post('/eventbrite/create', function (req, res, next) {
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

router.post('/eventbrite/update', function (req, res, next) {
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

// SHAME. SHAME BE UPON SQUARE.
// -----------------------------------------------------------------------------
router.post('/square', function (req, res) {
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


module.exports = router;
