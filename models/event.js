var mongoose = require('mongoose');
var FeedItem = mongoose.model('feeditems');

// Create event schema. Inherit FeedItem
var eventSchema = new mongoose.Schema({
    coordinates: String,
    address: String,
    eventUrl: String
});

// discriminator used for document inheritance within the same collection
// http://thecodebarbarian.com/2015/07/24/guide-to-mongoose-discriminators
// create model
exports.Event = FeedItem.discriminator('event', eventSchema);