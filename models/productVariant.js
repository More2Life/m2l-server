var mongoose = require('mongoose');

// Create listing schema. Inherit FeedItem
var productVariant = new mongoose.Schema({
    vendorId: Number,
    title: String,
    sku: String,
    option1: String,
    option2: String,
    option3: String,
    imageId: Number,
    inventoryQuantity: Number
});

// create model
exports.ProductVariant = mongoose.model('productvariant', productVariantSchema);
