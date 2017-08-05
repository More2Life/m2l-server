var mongoose = require('mongoose');
var FeedItem = mongoose.model('feeditems');

// Create listing schema. Inherit FeedItem
var listingSchema = new mongoose.Schema({
    previewImageUrl: String,
    Product: {
        squareId: String,
        previewImageUrl: String,
        lastUpdatedAt: String
    }
});

// discriminator used for document inheritance within the same collection
// http://thecodebarbarian.com/2015/07/24/guide-to-mongoose-discriminators
// create model
exports.Listing = FeedItem.discriminator('listing', listingSchema);