var express     = require('express');
var router      = express.Router();
var crypto      = require('crypto');

var listingController           = require ('../controllers/listingController').ListingController;
var eventController             = require ('../controllers/eventController').EventController;
var donationController          = require ('../controllers/donationController').DonationController;
var donationBucketController    = require ('../controllers/donationBucketController').DonationBucketController;

router.use((req, res, next) => {
    // Validate shopify webhook token. If it doesn't match our secret, reject the request
    req.rawBody = '';
    req.on('data', function(chunk) {
        req.rawBody += chunk;
    });

    if (req.url.search('.*\/shopify\/.*') >= 0) {
        const SHOPIFY_SHARED_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
        var calculated_signature = crypto.createHmac('sha256', SHOPIFY_SHARED_SECRET)
            .update(new Buffer(req.rawBody))
            .digest('base64');
        if (calculated_signature != req.headers['x-shopify-hmac-sha256']) {
            res.status(403).json({error: "Access Denied"});
            throw new Error('Invalid signature. Access denied');
        }
    }

    next();
});

router.post('/shopify/product', function (req, res) {
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

router.post('/shopify/product/delete', function (req, res) {
    console.log('POST from Shopify');
    console.log(req.body);

    if (req.body.product_type == "Donation") {
        listingController.deleteDonation(req.body);
    } else {
        listingController.deleteListing(req.body);
    }

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

module.exports = router;
