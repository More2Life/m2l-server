var mongoose = require('mongoose');
var FeedItem = mongoose.model('feeditems');


// Create donation schema. Inherit FeedItem
var donationSchema = new mongoose.Schema({
    vendorId: Number,
    handle: String,
    lastUpdatedAt: String,
    price: Number
});

// discriminator used for document inheritance within the same collection
// http://thecodebarbarian.com/2015/07/24/guide-to-mongoose-discriminators
// create model
exports.Donation = FeedItem.discriminator('donation', donationSchema);
