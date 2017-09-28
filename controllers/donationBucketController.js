var mongoose = require('mongoose');
var DonationBucket = require('../models/donationBucket').DonationBucket;
var moment = require('moment');

var DonationBucketController = {

    handleWebhook : async (item) => {
        try {
            var donationBucket = await DonationBucket.findOne({'vendorId' : item.id});
            if (donationBucket) {
                console.log('DONATION BUCKET FOUND');
                DonationBucketController.updateDonationBucket(donationBucket, item);
            } else {
                DonationBucketController.createDonationBucket(item);
            }
        } catch (err) {
            console.log(err);
        }
    },

    createDonationBucket : (item) => {
        console.log('CREATING DONATION BUCKET');
        var donationBucket = new DonationBucket({
            title: item.title,
            description: item.body_html,
            feedImageUrl: item.images[0].src,
            vendorId: item.id,
            handle: item.handle
        });

        DonationBucketController.saveDonationBucket(donationBucket);
    },

    updateDonationBucket : (donationBucket, item) => {
        console.log('UPDATING DONATION BUCKET');
        donationBucket.title = item.title;
        donationBucket.description = item.body_html;
        donationBucket.feedImageUrl = item.images[0].src;
        donationBucket.handle = item.handle;

        DonationBucketController.saveDonationBucket(donationBucket);
    },

    saveDonationBucket : (donationBucket) => {
        console.log('SAVING DONATION BUCKET');
        donationBucket.save(function (err) {
            if (err) {
                console.log('ERROR SAVING DONATION BUCKET:');
                console.log(donationBucket)
                console.log(err);
            }
        });
    },

    deleteDonationBucket : (item) => {
        console.log("DELETING DONATION BUCKET");
        DonationBucket.remove({'vendorId' : item.id}, function (err) {
            if (err) console.log("ERROR DELETING DONATION BUCKET: " + err)
        });
    },

    getDonationBuckets: function(req, callback) {
        DonationBucket.find({}, callback);
    }
}

exports.DonationBucketController = DonationBucketController;