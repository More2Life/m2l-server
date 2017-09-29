var mongoose = require( 'mongoose' );
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection(process.env.IS_PRODUCTION ? process.env.MONGODB_URI : process.env.MONGODB_URI_TEST);
autoIncrement.initialize(connection);


// create feedItem schema
var options = { discriminatorKey: 'type' };

var feedItemSchema = new mongoose.Schema({
    _id: {
        $oid: String
    },
    title: String,
    description: String,
    feedImageUrl: String,
    isActive: Boolean
}, options);


// auto increment index
feedItemSchema.plugin(autoIncrement.plugin, { model: 'FeedItem', field: 'index' });
var FeedItem = mongoose.model('feeditems', feedItemSchema);

// create model
exports.FeedItem = FeedItem;
