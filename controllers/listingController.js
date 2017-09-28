var mongoose = require('mongoose');
var Listing = require('../models/listing').Listing;
var moment = require('moment');

var ListingController = {

    handleWebhook : async (item) => {
        try {
            var listing = await Listing.findOne({'vendorId' : item.id});
            if (listing) {
                console.log('LISTING FOUND');
                ListingController.updateListing(listing, item);
            } else {
                ListingController.createListing(item);
            }
        } catch (err) {
            console.log(err);
        }
    },

    createListing : (item) => {
        console.log('CREATING LISTING');
        var listing = new Listing({
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

        ListingController.saveListing(listing);
    },

    updateListing : (listing, item) => {
        console.log('UPDATING LISTING');
        listing.title = item.title;
        listing.description = item.body_html;
        listing.feedImageUrl = item.images[0].src;
        listing.handle = item.handle;
        listing.lastUpdatedAt = item.updated_at;
        listing.price = item.variants[0].price;

        ListingController.saveListing(listing);
    },

    saveListing : (listing) => {
        console.log('SAVING LISTING');
        listing.save(function (err) {
            if (err) {
                console.log('ERROR SAVING LISTING:');
                console.log(listing)
                console.log(err);
            }
        });
    },

    deleteListing : (item) => {
        console.log("DELETING LISTING");
        console.log(item);
        Listing.remove({'vendorId' : item.id}, function (err) {
            if (err) console.log("ERROR DELETING: " + err)
        });
    }
}

exports.ListingController = ListingController;