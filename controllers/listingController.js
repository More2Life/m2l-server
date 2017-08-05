var mongoose = require('mongoose');
var Listing = require('../models/listing').Listing;
var request = require('request');
var redisController = require('../database/redis.js').RedisController;
var moment = require('moment');

const TOKEN = process.env.SQUARE_PERSONAL_ACCESS_TOKEN;
var baseUrl = 'https://connect.squareup.com/v2/';
var minute = 60000;
var LAST_POLLED_AT_KEY = 'squareItemListLastPolledAt'


var baseRequest = request.defaults({
    headers: {
        'Authorization': TOKEN,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    json: true
})

var ListingController = {

    getItemList: () => {
        var postBody = {object_types : ["ITEM"]};
        var searchTime = moment().toISOString();
        console.log(searchTime);
        redisController.getValueForKey(LAST_POLLED_AT_KEY, (lastPolledAt) => {
            if (lastPolledAt) {
                postBody.begin_time = lastPolledAt;
            }
            var postUrl = baseUrl + 'catalog/search';
            console.log(postUrl);
            console.log(postBody);

            baseRequest.post({url: postUrl, body: postBody}, function (error, response, body) {
                if (error) console.log("Error: ", error);
                if (error) throw error;
                var items = body.objects;
                console.log("FETCHED ITEMS LIST:");
                console.log(items);
                if (items) {
                    items.forEach(function (item, index) {
                        ListingController.checkAndUpdateListing(item);
                    });
                }
                redisController.setKeyValue(LAST_POLLED_AT_KEY, searchTime)
            });
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
                console.log('ERROR SAVING LISTING:');
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