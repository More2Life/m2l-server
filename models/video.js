// Create video schema. Inherit FeedItem
var videoSchema = new mongoose.Schema({
    previewImageUrl: String,
    videoUrl: String,
    publishDate: Date,
    views: Number
}, options);

var Video = FeedItem.discriminator('Video', videoSchema);

module.exports = Video;