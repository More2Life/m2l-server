var mongoose = require( 'mongoose' );

// create feedItem schema
// var options = { discriminatorKey: 'type' };

var feedItemSchema = new mongoose.Schema({
    _id: {
        $oid: String
    },
    title: String,
    description: String,
    index: Number
});

// create model
var FeedItem = mongoose.model('FeedItem', feedItemSchema);