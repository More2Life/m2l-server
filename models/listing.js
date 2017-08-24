var mongoose = require('mongoose');
var FeedItem = mongoose.model('feeditems');


// Create productVariant schema to be a subdocument array in listing
// http://mongoosejs.com/docs/subdocs.html
var productVariantSchema = new mongoose.Schema({
    vendorId: Number,
    title: String,
    sku: String,
    option1: String,
    option2: String,
    option3: String,
    imageId: Number,
    inventoryQuantity: Number
});

// Create listing schema. Inherit FeedItem
var listingSchema = new mongoose.Schema({
    vendorId: Number,
    lastUpdatedAt: String,
    price: Number,
    variants: [productVariantSchema]
});

// discriminator used for document inheritance within the same collection
// http://thecodebarbarian.com/2015/07/24/guide-to-mongoose-discriminators
// create model
exports.Listing = FeedItem.discriminator('listing', listingSchema);
