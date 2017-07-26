var database = require('./controllers/database');
var mongoose = require('mongoose');
var FeedItemModel = require('./feedItem').model;

// Create video schema. Inherit FeedItem
var videoSchema = database.Schema({
    previewImageUrl: String,
    videoUrl: String,
    publishDate: Date,
    views: Number
}, options);

// discriminator used for document inheritance within the same collection
// http://thecodebarbarian.com/2015/07/24/guide-to-mongoose-discriminators
var Video = FeedItemModel.discriminator('Video', videoSchema);

module.exports = Video;