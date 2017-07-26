// create feedItem schema
var options = { discriminatorKey: 'type' };

var feedItemSchema = new Schema({
    identifier: String,
    title: String,
    description: String,
    index: Number
}, options);

// create model
var FeedItem = mongoose.model('FeedItem', feedItemSchema);

module.exports.feedItem = FeedItem;