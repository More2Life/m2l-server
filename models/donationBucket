var mongoose = require( 'mongoose' );

// create Donation Bucket schema

var donationBucketSchema = new mongoose.Schema({
    title: String,
    description: String,
    feedImageUrl: String,
    vendorId: Number,
    handle: String
});

// create model
exports.DonationBucket = mongoose.model('donationbuckets', donationBucketSchema);
