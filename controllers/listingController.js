var mongoose = require('mongoose');
var Listing = require('../models/listing').Listing;
var request = require('request');
const TOKEN = process.env.SQUARE_PERSONAL_ACCESS_TOKEN;
var baseUrl = 'https://connect.squareup.com/v2/';


var baseRequest = request.defaults({
    headers: {
        'Authorization': TOKEN,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

var ListingController = {

     getItemList : function() {
        var url = baseURL + 'catalog/list?types=ITEM';
        console.log("GET Items List");
        baseRequest(url, function(error, response, body) {
            console.log("Error", error);
            console.log("Response", response);
            console.log("Response Body", body);
            if (error) throw error;

            var items = body.objects;
            for (var i = 0; i < items.length; i++) {
                checkAndUpdateListing(items[i]);
            }
        });
    };

    function checkAndUpdateListing(item) {
        var squareId = item.id;
        var lastUpdatedAt = item.updated_at;

        function createListing(item) {
            var listing = new Listing({
                title: item.item_data.name,
                description: item.item_data.description,
                index: 0,
                isActive: !item.isDeleted,
                squareId: item.id,
                previewImageUrl: item.item_data.image_url,
                lastUpdatedAt: lastUpdatedAt
            });

            listing.save();
        }

        Listing.find({ squareId: squareId }, function(err, listing) {
            if (err) throw err;
            if (listing) {
                console.log('LISTING FOUND:');
                console.log(listing);

                // If the item has been updated after creation, update the listing document
                var date1 = Date.parse(listing.lastUpdatedAt);
                var date2 = Date.parse(lastUpdatedAt);
                if (date1 < date2) {
                    listing.title = item.title;
                    listing.description = item.item_data.description;
                    listing.isActive = !item.isDeleted;
                    listing.previewImageUrl = item.item_data.image_url;
                    listing.lastUpdatedAt = lastUpdatedAt;

                    listing.save(function (err) {
                        if(err) {
                            console.error('ERROR SAVING LISTING:');
                            console.log(listing)
                        }
                    });
                }
            } else {
                createListing(item);
            }
        });
    }
}

exports.ListingController = ListingController;