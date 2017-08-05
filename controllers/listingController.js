var mongoose = require('mongoose');
var Listing = require('../models/listing').Listing;
var request = require('request');

const TOKEN = process.env.SQUARE_PERSONAL_ACCESS_TOKEN;
console.log('TOKEN: ' +TOKEN);
var baseUrl = 'https://connect.squareup.com/v2/';
var minute = 60000;


var baseRequest = request.defaults({
    headers: {
        'Authorization': TOKEN,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

var ListingController = {

    getItemList: () => {
        var url = baseUrl + 'catalog/list?types=ITEM';
        baseRequest(url, function (error, response, body) {
            console.log("Error: ", error);
            console.log("Response: ", response);
            console.log("Response Body: ", JSON.parse(body));
            if (error) throw error;
            var items = JSON.parse(body).objects;
            console.log("FETCHED ITEMS LIST:");
            console.log(items);
            if (items) {
                items.forEach(function (item, index) {
                    ListingController.checkAndUpdateListing(item);
                });
            }
        });
    },

    checkAndUpdateListing: async (item) => {
        try {
            console.log('ITEM TO SEARCH:');
            console.log(item);

            var listing = await Listing.findOne({'squareId' : item.id});
            if (listing) {
                console.log('LISTING FOUND:');
                console.log(listing);

                // If the item has been updated after last DB put, update the listing document
                var date1 = Date.parse(listing.lastUpdatedAt);
                var date2 = Date.parse(item.updated_at);
                if (date1 < date2) {
                    ListingController.updateListing(listing, item);
                }
            } else {
                ListingController.createListing(item);
            }
        } catch (err) {
            console.log(err);
        }
    },
    createListing : (item) => {
        console.log('CREATING LISTING WITH ITEM:');
        console.log(item);
        var listing = new Listing({
            title: item.item_data.name,
            description: item.item_data.description,
            index: 0,
            isActive: !item.isDeleted,
            squareId: item.id,
            previewImageUrl: item.item_data.image_url,
            lastUpdatedAt: item.updated_at
        });

        ListingController.saveListing(listing);
    },
    updateListing : (listing, item) => {
        listing.title = item.title;
        listing.description = item.item_data.description;
        listing.isActive = !item.isDeleted;
        listing.previewImageUrl = item.item_data.image_url;
        listing.lastUpdatedAt = lastUpdatedAt;

        ListingController.saveListing(listing);
    },
    saveListing : (listing) => {
        console.log('SAVING LISTING: ');
        console.log(listing);
        listing.save(function (err) {
            if (err) {
                console.error('ERROR SAVING LISTING:');
                console.log(listing)
            }
        });
    }
}

setInterval( async () => {
    console.log('POLLING SQUARE ITEMS');
    await ListingController.getItemList();
}, minute * 60);

exports.ListingController = ListingController;