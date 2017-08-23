var mongoose = require('mongoose');
var FeedItem = mongoose.model('feeditems');

// Create story schema. Inherit FeedItem
var storySchema = new mongoose.Schema({
    videoUrl: String,
    publishDate: Date,
    views: Number
});

// discriminator used for document inheritance within the same collection
// http://thecodebarbarian.com/2015/07/24/guide-to-mongoose-discriminators
// create model
exports.Story = FeedItem.discriminator('story', storySchema);
