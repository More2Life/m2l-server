var mongoose = require('mongoose');
var FeedItem = mongoose.model('feeditems');
var ProductVariant = require('./productVariant').ProductVariant;

// Create listing schema. Inherit FeedItem
var listingSchema = new mongoose.Schema({
    vendorId: Number,
    lastUpdatedAt: String,
    price: Number,
    variants: [ProductVariant]
});

// discriminator used for document inheritance within the same collection
// http://thecodebarbarian.com/2015/07/24/guide-to-mongoose-discriminators
// create model
exports.Listing = FeedItem.discriminator('listing', listingSchema);
