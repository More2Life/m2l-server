var mongoose = require('mongoose');
var FeedItem = mongoose.model('feeditems');
var uniqueValidator = require('mongoose-unique-validator');

// Create event schema. Inherit FeedItem
var eventSchema = new mongoose.Schema({
    address: String,
    area: String,
    multiLineAddress: [{type: String}],
    latitude: String,
    longitude: String,
    venueName: String,
    eventUrl: String,
    resourceUri: { type: String, required: true, unique: true },
    imageUrl: String,
    startTime: String,
    endTime: String
});
eventSchema.plugin(uniqueValidator);

// discriminator used for document inheritance within the same collection
// http://thecodebarbarian.com/2015/07/24/guide-to-mongoose-discriminators
// create model
exports.Event = FeedItem.discriminator('event', eventSchema);
