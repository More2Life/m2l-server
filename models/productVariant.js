var mongoose = require('mongoose');

// Create listing schema. Inherit FeedItem
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

// export schema
exports.ProductVariant = productVariantSchema;
