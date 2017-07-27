var mongoose = require( 'mongoose' );

// create feedItem schema
var options = { discriminatorKey: 'type' };

var feedItemSchema = new mongoose.Schema({
    _id: {
        $oid: String
    },
    title: String,
    description: String,
    index: Number
}, options);

// create model
var FeedItem = mongoose.model('feeditems', feedItemSchema);