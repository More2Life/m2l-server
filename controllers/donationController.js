var mongoose = require('mongoose');
var Donation = require('../models/donation').Donation;
var moment = require('moment');

var DonationController = {

    handleWebhook : async (item) => {
        try {
            var donation = await Donation.findOne({'vendorId' : item.id});
            if (donation) {
                console.log('DONATION FOUND');
                DonationController.updateDonation(donation, item);
            } else {
                DonationController.createDonation(item);
            }
        } catch (err) {
            console.log(err);
        }
    },

    createDonation : (item) => {
        console.log('CREATING DONATION');
        var donation = new Donation({
            title: item.title,
            description: item.body_html,
            index: 0,
            isActive: true,
            vendorId: item.id,
            handle: item.handle,
            feedImageUrl: item.images[0].src,
            lastUpdatedAt: item.updated_at,
            price: item.variants[0].price
        });

        DonationController.saveDonation(donation);
    },

    updateDonation : (donation, item) => {
        console.log('UPDATING DONATION');
        donation.title = item.title;
        donation.description = item.body_html;
        donation.feedImageUrl = item.images[0].src;
        donation.handle = item.handle;
        donation.lastUpdatedAt = item.updated_at;
        donation.price = item.variants[0].price;

        DonationController.saveDonation(donation);
    },

    saveDonation : (donation) => {
        console.log('SAVING DONATION');
        donation.save(function (err) {
            if (err) {
                console.log('ERROR SAVING DONATION:');
                console.log(donation)
                console.log(err);
            }
        });
    },

    deleteDonation : (item) => {
        console.log("DELETING DONATION");
        Donation.remove({'vendorId' : item.id}, function (err) {
            if (err) console.log("ERROR DELETING: " + err)
        });
    }
}

exports.DonationController = DonationController;